export type DatasetId =
  | "search-terms"
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

export interface PantryEntry {
  datasetId: DatasetId;
  feddAt: number;
  rows: number;
  /** "mock" = the old one-click fake feed. "upload" = a real parsed file sitting in the server-side dataset store. */
  source: "mock" | "upload";
  serverDatasetId?: string;
  filename?: string;
  columns?: string[];
  validation?: DatasetValidation;
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
