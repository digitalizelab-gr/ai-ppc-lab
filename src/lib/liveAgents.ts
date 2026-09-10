import { DatasetId } from "./types";

/** Robots wired to a real Gemini-backed analysis route, not the mock random flow. */
export const LIVE_AGENT_IDS = new Set<string>(["search-term-goblin"]);

/** Dataset types that get a real upload UI (CSV/XLSX parsed server-side) instead of the mock "+FEED" button. */
export const REAL_UPLOAD_DATASET_TYPES = new Set<DatasetId>(["search-terms"]);
