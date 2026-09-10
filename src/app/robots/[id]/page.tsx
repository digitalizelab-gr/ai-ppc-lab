"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useLab } from "@/lib/store";
import { ROBOT_MAP, pick } from "@/lib/robots";
import { DATASET_MAP } from "@/lib/datasets";
import { REAL_UPLOAD_DATASET_TYPES } from "@/lib/liveAgents";
import RobotAvatar from "@/components/RobotAvatar";
import StateBadge from "@/components/StateBadge";
import ResultsView from "@/components/ResultsView";
import DatasetUploadButton from "@/components/DatasetUploadButton";
import AnalysingPanel from "@/components/AnalysingPanel";

export default function RobotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const robot = ROBOT_MAP[id];

  const {
    hydrated,
    pantry,
    runs,
    feedDataset,
    robotStatus,
    runAnalysis,
    missingDatasets,
  } = useLab();

  const [motto, setMotto] = useState<string>("");
  const [stateLine, setStateLine] = useState<string>("");

  const state = robot ? robotStatus(robot) : "hungry";

  useEffect(() => {
    if (!robot || !hydrated) return;
    // Random flavor text on state change — a display concern with no correct "derive during render" form.
    /* eslint-disable react-hooks/set-state-in-effect */
    setMotto(pick(robot.mottos));
    setStateLine(pick(robot.stateMessages[state]));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [robot, state, hydrated]);

  if (!robot) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <p className="font-mono text-text-dim">
          No robot answers to that name. It may have never been built.
        </p>
        <Link href="/" className="mt-4 inline-block text-good underline">
          back to the garage
        </Link>
      </div>
    );
  }

  const missing = missingDatasets(robot);
  const run = runs[robot.id];
  const result =
    run?.status === "found-something"
      ? run.result ?? robot.results.find((r) => r.id === run.resultId)
      : undefined;

  const feedEntry = robot.food.map((f) => pantry[f]).find((e) => e?.source === "upload");
  const sourceLabel = feedEntry
    ? `${feedEntry.filename} · ${feedEntry.rows.toLocaleString()} rows`
    : undefined;

  const canRun = state === "ready" || state === "found-something" || state === "nothing-interesting" || state === "error";

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/" className="font-mono text-[11px] text-text-faint hover:text-text">
        ← back to the garage
      </Link>

      <section className="mt-4 flex flex-col gap-5 rounded-xl border border-border bg-bg-panel p-6 sm:flex-row sm:items-start">
        <RobotAvatar robotId={robot.id} color={robot.color} state={state} size={96} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold">{robot.name}</h1>
            <StateBadge state={state} />
          </div>
          <p className="font-mono text-[11px] text-text-faint">{robot.role}</p>
          <p className="mt-2 max-w-xl text-sm text-text-dim">{robot.bio}</p>
          {hydrated && (
            <p
              className="mt-3 max-w-xl text-sm italic"
              style={{ color: robot.color }}
            >
              &ldquo;{motto}&rdquo;
            </p>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-bg-panel p-6">
        <h2 className="font-display text-base font-bold">Food</h2>
        <p className="font-mono text-[11px] text-text-faint">
          {robot.name} eats from the shared pantry. Fed once, fed for every robot.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {robot.food.map((f) => {
            if (REAL_UPLOAD_DATASET_TYPES.has(f)) {
              return <DatasetUploadButton key={f} datasetId={f} />;
            }
            const dataset = DATASET_MAP[f];
            const fed = Boolean(pantry[f]);
            return (
              <button
                key={f}
                onClick={() => !fed && feedDataset(f)}
                disabled={fed}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  fed
                    ? "border-good/40 bg-good/5 cursor-default"
                    : "border-border bg-bg-panel-2 hover:border-tape/50 hover:bg-tape/5 cursor-pointer"
                }`}
              >
                <span>{dataset.emoji}</span>
                <span className="font-mono text-xs">{dataset.label}</span>
                <span
                  className={`font-mono text-[10px] font-semibold ${
                    fed ? "text-good" : "text-text-faint"
                  }`}
                >
                  {fed ? "FED" : "FEED"}
                </span>
              </button>
            );
          })}
          {robot.futureFood?.map((f) => (
            <span
              key={f}
              className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 font-mono text-xs text-text-faint"
            >
              🔒 {f}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-bg-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold">Run Analysis</h2>
            {hydrated && (
              <p className="mt-1 text-sm text-text-dim">{stateLine}</p>
            )}
          </div>
          <button
            onClick={() => runAnalysis(robot.id)}
            disabled={!hydrated || !canRun}
            className={`shrink-0 rounded-lg px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
              canRun
                ? "cursor-pointer text-black hover:brightness-110"
                : "cursor-not-allowed border border-border text-text-faint"
            }`}
            style={canRun ? { backgroundColor: robot.color } : undefined}
          >
            {state === "analysing"
              ? "Analysing…"
              : result || run
              ? "Run again"
              : "Run analysis"}
          </button>
        </div>
        {state === "hungry" && missing.length > 0 && (
          <div className="mt-3 rounded-lg border border-dashed border-border px-3 py-2.5">
            <p className="font-mono text-[11px] text-text-faint">
              feed it first: {missing.map((m) => DATASET_MAP[m].label).join(", ")}
            </p>
          </div>
        )}
      </section>

      <section className="mt-6">
        {state === "analysing" && (
          <AnalysingPanel accentColor={robot.color} flavorLine={stateLine} />
        )}

        {state === "found-something" && result && (
          <ResultsView
            result={result}
            robotId={robot.id}
            accentColor={robot.color}
            sourceLabel={sourceLabel}
          />
        )}

        {state === "nothing-interesting" && (
          <div className="animate-fade-in rounded-xl border border-border bg-bg-panel p-6 text-center">
            <p className="font-display text-lg font-semibold text-text-dim">
              {stateLine}
            </p>
            <p className="mt-1 font-mono text-[11px] text-text-faint">
              try again later, or feed it fresher data.
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="animate-fade-in rounded-xl border border-danger/40 bg-danger/5 p-6 text-center">
            <p className="font-display text-lg font-semibold text-danger">
              ⚠ {stateLine}
            </p>
            {run?.errorMessage && (
              <p className="mt-2 font-mono text-[11px] text-text-faint">
                {run.errorMessage}
              </p>
            )}
          </div>
        )}

        {state === "ready" && (
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <p className="font-mono text-[11px] text-text-faint">
              fed and ready — hit{" "}
              <span className="font-semibold" style={{ color: robot.color }}>
                Run Analysis
              </span>{" "}
              above to see what it digs up.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
