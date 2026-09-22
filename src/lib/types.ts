export type DatasetId =
  | "search-terms"
  | "peer-search-terms"
  | "product-performance"
  | "feed-export"
  | "asset-performance"
  | "auction-insights"
  | "change-logs"
  | "campaign-performance"
  | "notes"
  | "client-context";

export interface Dataset {
  id: DatasetId;
  label: string;
  emoji: string;
  description: string;
  /** Roughly how many mock rows appear once "fed" — just flavor text. */
  mockRowRange: [number, number];
}

export type RobotState =
  | "hungry"
  | "ready"
  | "analysing"
  | "found-something"
  | "nothing-interesting"
  | "error";

export type Confidence = "HIGH" | "MEDIUM" | "LOW";

export interface AnalysisResult {
  id: string;
  headline: string;
  insights: string[];
  actions: string[];
  expectedImpact: string;
  confidence: Confidence;
  /** Short citations grounding each claim in real evidence. Only present for live (AI-backed) results. */
  evidence?: string[];
}

export interface Robot {
  id: string;
  name: string;
  role: string;
  bio: string;
  color: string;
  colorSoft: string;
  food: DatasetId[];
  /** Default false: "ready" as soon as ANY food is present (flavor-level readiness). True: every food type is a hard requirement before it can actually run (live agents with more than one required dataset). */
  requiresAllFood?: boolean;
  futureFood?: string[];
  mottos: string[];
  stateMessages: Record<RobotState, string[]>;
  results: AnalysisResult[];
}

export type DatasetValidationState = "valid" | "warning" | "invalid";

export interface DatasetValidation {
  state: DatasetValidationState;
  issues: string[];
}

/**
 * A fully parsed, validated dataset — the payload that travels client → server
 * on upload, gets cached in the Pantry, and travels client → server again on
 * every analysis run. There is deliberately no server-side dataset store: a
 * serverless deployment can route two requests to two different instances
 * with no shared memory, so "upload now, reference by id later" doesn't hold
 * up in production. Sending the (already-validated, already-small) data itself
 * on each request sidesteps that entirely.
 */
export interface DatasetPayload {
  datasetType: DatasetId;
  filename: string;
  sourceFiles?: string[];
  currencyCode?: string;
  columns: string[];
  rows: Record<string, unknown>[];
  validation: DatasetValidation;
}

export interface PantryEntry {
  datasetId: DatasetId;
  feddAt: number;
  rows: number;
  /** "mock" = the old one-click fake feed. "upload" = a real parsed file, cached here for re-sending on each analysis run. */
  source: "mock" | "upload";
  filename?: string;
  sourceFiles?: string[];
  currencyCode?: string;
  columns?: string[];
  validation?: DatasetValidation;
  /** Present only when source === "upload" — the actual parsed rows, resent to /api/analyze. */
  data?: Record<string, unknown>[];
}

export interface RobotRun {
  status: "found-something" | "nothing-interesting" | "error";
  /** Mock robots: references a canned result in robot.results. */
  resultId?: string;
  /** Live (AI-backed) robots: the full result returned by the analysis API. */
  result?: AnalysisResult;
  errorMessage?: string;
  ranAt: number;
}

export type FeedbackValue = "up" | "down";
