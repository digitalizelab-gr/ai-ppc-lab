import { DatasetId } from "./types";

/** Robots wired to a real Gemini-backed analysis route, not the mock random flow. */
export const LIVE_AGENT_IDS = new Set<string>(["search-term-goblin", "bloodhound"]);

/** Dataset types that get a real upload UI (CSV/XLSX parsed server-side) instead of the mock "+FEED" button. */
export const REAL_UPLOAD_DATASET_TYPES = new Set<DatasetId>(["search-terms", "peer-search-terms"]);

/** Dataset types that accept more than one file in a single upload, merged into one dataset. */
export const MULTI_FILE_DATASET_TYPES = new Set<DatasetId>(["peer-search-terms"]);
