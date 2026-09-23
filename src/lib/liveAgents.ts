import { DatasetId } from "./types";

/** Robots wired to a real Gemini-backed analysis route, not the mock random flow. */
export const LIVE_AGENT_IDS = new Set<string>(["search-term-goblin", "bloodhound"]);

/**
 * Dataset types that get a real upload UI (CSV/XLSX parsed server-side)
 * instead of the mock "+FEED" button. All 10 dataset types accept real
 * files now — but only search-terms and peer-search-terms are actually
 * *read* by a live agent so far (see LIVE_AGENT_IDS above). The rest are
 * parsed, validated, and stored for real, ready for the robot that reads
 * them whenever it's built — feeding one today does not make its robot
 * analyze real data yet.
 */
export const REAL_UPLOAD_DATASET_TYPES = new Set<DatasetId>([
  "search-terms",
  "peer-search-terms",
  "product-performance",
  "feed-export",
  "asset-performance",
  "auction-insights",
  "change-logs",
  "campaign-performance",
  "notes",
  "client-context",
]);

/** Dataset types that accept more than one file in a single upload, merged into one dataset. */
export const MULTI_FILE_DATASET_TYPES = new Set<DatasetId>(["peer-search-terms"]);
