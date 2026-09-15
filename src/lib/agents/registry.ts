import { DatasetId } from "@/lib/types";
import { StoredDataset } from "@/lib/server/datasetStore";
import {
  preprocessSearchTerms,
  SEARCH_TERM_GOBLIN_SYSTEM_INSTRUCTION,
  buildSearchTermGoblinPrompt,
} from "./searchTermGoblin";
import {
  buildKeywordGapEvidence,
  BLOODHOUND_SYSTEM_INSTRUCTION,
  buildBloodhoundPrompt,
} from "./keywordGap";

/**
 * The analytical half of an agent — everything generateAnalysis() needs.
 * Personality, mottos, and UI copy live separately in lib/robots.ts; the two
 * are joined only by this shared `id`. Adding a new live agent means adding
 * one entry here, not touching the UI or the AI layer — generateAnalysis()
 * already owns the response schema and validation.
 */
export interface AgentDefinition {
  id: string;
  requiredDatasetTypes: DatasetId[];
  systemInstruction: string;
  buildPrompt: (evidence: unknown) => string;
  preprocess: (datasets: Partial<Record<DatasetId, StoredDataset>>) => unknown;
}

export const AGENTS: Record<string, AgentDefinition> = {
  "search-term-goblin": {
    id: "search-term-goblin",
    requiredDatasetTypes: ["search-terms"],
    systemInstruction: SEARCH_TERM_GOBLIN_SYSTEM_INSTRUCTION,
    buildPrompt: (evidence) => buildSearchTermGoblinPrompt(evidence as Parameters<typeof buildSearchTermGoblinPrompt>[0]),
    preprocess: (datasets) => preprocessSearchTerms(datasets["search-terms"]!),
  },
  bloodhound: {
    id: "bloodhound",
    requiredDatasetTypes: ["search-terms", "peer-search-terms"],
    systemInstruction: BLOODHOUND_SYSTEM_INSTRUCTION,
    buildPrompt: (evidence) => buildBloodhoundPrompt(evidence as Parameters<typeof buildBloodhoundPrompt>[0]),
    preprocess: (datasets) => buildKeywordGapEvidence(datasets["search-terms"]!, datasets["peer-search-terms"]!),
  },
};

export function getAgent(id: string): AgentDefinition | undefined {
  return AGENTS[id];
}
