import { DatasetId } from "@/lib/types";
import { StoredDataset } from "@/lib/server/datasetStore";
import {
  preprocessSearchTerms,
  SEARCH_TERM_GOBLIN_SYSTEM_INSTRUCTION,
  buildSearchTermGoblinPrompt,
} from "./searchTermGoblin";

/**
 * The analytical half of an agent — everything generateAnalysis() needs.
 * Personality, mottos, and UI copy live separately in lib/robots.ts; the two
 * are joined only by this shared `id`. Adding a new live agent means adding
 * one entry here, not touching the UI or the AI layer — generateAnalysis()
 * already owns the response schema and validation.
 */
export interface AgentDefinition {
  id: string;
  requiredDatasetType: DatasetId;
  systemInstruction: string;
  buildPrompt: (evidence: unknown) => string;
  preprocess: (dataset: StoredDataset) => unknown;
}

export const AGENTS: Record<string, AgentDefinition> = {
  "search-term-goblin": {
    id: "search-term-goblin",
    requiredDatasetType: "search-terms",
    systemInstruction: SEARCH_TERM_GOBLIN_SYSTEM_INSTRUCTION,
    buildPrompt: (evidence) => buildSearchTermGoblinPrompt(evidence as Parameters<typeof buildSearchTermGoblinPrompt>[0]),
    preprocess: preprocessSearchTerms,
  },
};

export function getAgent(id: string): AgentDefinition | undefined {
  return AGENTS[id];
}
