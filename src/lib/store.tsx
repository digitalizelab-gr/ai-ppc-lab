"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DATASET_MAP } from "./datasets";
import { ROBOT_MAP, ROBOTS } from "./robots";
import { LIVE_AGENT_IDS } from "./liveAgents";
import {
  DatasetId,
  FeedbackValue,
  PantryEntry,
  Robot,
  RobotRun,
  RobotState,
} from "./types";

const PANTRY_KEY = "ppclab.pantry.v2";
const RUNS_KEY = "ppclab.runs.v2";
const FEEDBACK_KEY = "ppclab.feedback.v1";

type PantryMap = Partial<Record<DatasetId, PantryEntry>>;
type RunsMap = Record<string, RobotRun>;
type FeedbackMap = Record<string, FeedbackValue>;

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — fail silently, this is a lab toy
  }
}

interface LabContextValue {
  hydrated: boolean;
  pantry: PantryMap;
  runs: RunsMap;
  feedback: FeedbackMap;
  analysingRobotId: string | null;
  feedDataset: (id: DatasetId) => void;
  uploadDataset: (id: DatasetId, file: File) => Promise<void>;
  robotStatus: (robot: Robot) => RobotState;
  runAnalysis: (robotId: string) => void;
  giveFeedback: (resultKey: string, value: FeedbackValue) => void;
  resetLab: () => void;
  compatibleDatasetsInPantry: (robot: Robot) => DatasetId[];
  missingDatasets: (robot: Robot) => DatasetId[];
}

const LabContext = createContext<LabContextValue | null>(null);

export function LabProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [pantry, setPantry] = useState<PantryMap>({});
  const [runs, setRuns] = useState<RunsMap>({});
  const [feedback, setFeedback] = useState<FeedbackMap>({});
  const [analysingRobotId, setAnalysingRobotId] = useState<string | null>(
    null
  );

  useEffect(() => {
    // One-time client-only hydration from localStorage — cannot run on the server,
    // and there is no external store to subscribe to, so a plain setState is correct here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPantry(readJSON(PANTRY_KEY, {} as PantryMap));
    setRuns(readJSON(RUNS_KEY, {} as RunsMap));
    setFeedback(readJSON(FEEDBACK_KEY, {} as FeedbackMap));
    setHydrated(true);
  }, []);

  const feedDataset = useCallback((id: DatasetId) => {
    setPantry((prev) => {
      if (prev[id]) return prev;
      const dataset = DATASET_MAP[id];
      const [min, max] = dataset.mockRowRange;
      const rows = Math.floor(min + Math.random() * (max - min));
      const next: PantryMap = {
        ...prev,
        [id]: { datasetId: id, feddAt: Date.now(), rows, source: "mock" },
      };
      writeJSON(PANTRY_KEY, next);
      return next;
    });
  }, []);

  const uploadDataset = useCallback(async (id: DatasetId, file: File) => {
    const form = new FormData();
    form.append("file", file);
    form.append("datasetType", id);

    const res = await fetch("/api/datasets/upload", { method: "POST", body: form });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Upload failed.");
    }

    setPantry((prev) => {
      const next: PantryMap = {
        ...prev,
        [id]: {
          datasetId: id,
          feddAt: Date.now(),
          rows: data.rowCount,
          source: "upload",
          serverDatasetId: data.id,
          filename: data.filename,
          columns: data.columns,
          validation: data.validation,
        },
      };
      writeJSON(PANTRY_KEY, next);
      return next;
    });
  }, []);

  const compatibleDatasetsInPantry = useCallback(
    (robot: Robot) => robot.food.filter((f) => pantry[f]),
    [pantry]
  );

  const missingDatasets = useCallback(
    (robot: Robot) => robot.food.filter((f) => !pantry[f]),
    [pantry]
  );

  const robotStatus = useCallback(
    (robot: Robot): RobotState => {
      if (analysingRobotId === robot.id) return "analysing";
      const run = runs[robot.id];
      if (run) return run.status;
      const hasFood = robot.food.some((f) => pantry[f]);
      return hasFood ? "ready" : "hungry";
    },
    [pantry, runs, analysingRobotId]
  );

  const runAnalysis = useCallback(
    (robotId: string) => {
      const robot = ROBOT_MAP[robotId];
      if (!robot) return;
      setAnalysingRobotId(robotId);

      if (LIVE_AGENT_IDS.has(robotId)) {
        (async () => {
          try {
            const datasetEntry = robot.food
              .map((f) => pantry[f])
              .find((entry) => entry?.source === "upload" && entry.serverDatasetId);
            if (!datasetEntry?.serverDatasetId) {
              throw new Error("No uploaded dataset found — feed this robot a real file first.");
            }
            const res = await fetch(`/api/analyze/${robotId}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ datasetId: datasetEntry.serverDatasetId }),
            });
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.message || "Analysis failed.");
            }
            const run: RobotRun = { status: "found-something", result: data.result, ranAt: Date.now() };
            setRuns((prev) => {
              const next = { ...prev, [robotId]: run };
              writeJSON(RUNS_KEY, next);
              return next;
            });
          } catch (err) {
            const run: RobotRun = {
              status: "error",
              errorMessage: err instanceof Error ? err.message : "Unknown error.",
              ranAt: Date.now(),
            };
            setRuns((prev) => {
              const next = { ...prev, [robotId]: run };
              writeJSON(RUNS_KEY, next);
              return next;
            });
          } finally {
            setAnalysingRobotId(null);
          }
        })();
        return;
      }

      const delay = 1300 + Math.random() * 900;
      window.setTimeout(() => {
        const roll = Math.random();
        let run: RobotRun;
        if (roll < 0.08) {
          run = { status: "error", ranAt: Date.now() };
        } else if (roll < 0.22) {
          run = { status: "nothing-interesting", ranAt: Date.now() };
        } else {
          const result =
            robot.results[Math.floor(Math.random() * robot.results.length)];
          run = {
            status: "found-something",
            resultId: result.id,
            ranAt: Date.now(),
          };
        }
        setRuns((prev) => {
          const next = { ...prev, [robotId]: run };
          writeJSON(RUNS_KEY, next);
          return next;
        });
        setAnalysingRobotId(null);
      }, delay);
    },
    [pantry]
  );

  const giveFeedback = useCallback((resultKey: string, value: FeedbackValue) => {
    setFeedback((prev) => {
      const next = { ...prev, [resultKey]: prev[resultKey] === value ? undefined : value };
      if (next[resultKey] === undefined) delete next[resultKey];
      writeJSON(FEEDBACK_KEY, next);
      return next as FeedbackMap;
    });
  }, []);

  const resetLab = useCallback(() => {
    fetch("/api/reset", { method: "POST" }).catch(() => {
      // best-effort: local state still clears even if the server call fails
    });
    setPantry({});
    setRuns({});
    setFeedback({});
    writeJSON(PANTRY_KEY, {});
    writeJSON(RUNS_KEY, {});
    writeJSON(FEEDBACK_KEY, {});
  }, []);

  const value = useMemo<LabContextValue>(
    () => ({
      hydrated,
      pantry,
      runs,
      feedback,
      analysingRobotId,
      feedDataset,
      uploadDataset,
      robotStatus,
      runAnalysis,
      giveFeedback,
      resetLab,
      compatibleDatasetsInPantry,
      missingDatasets,
    }),
    [
      hydrated,
      pantry,
      runs,
      feedback,
      analysingRobotId,
      feedDataset,
      uploadDataset,
      robotStatus,
      runAnalysis,
      giveFeedback,
      resetLab,
      compatibleDatasetsInPantry,
      missingDatasets,
    ]
  );

  return <LabContext.Provider value={value}>{children}</LabContext.Provider>;
}

export function useLab() {
  const ctx = useContext(LabContext);
  if (!ctx) throw new Error("useLab must be used within LabProvider");
  return ctx;
}

export function allRobots() {
  return ROBOTS;
}
