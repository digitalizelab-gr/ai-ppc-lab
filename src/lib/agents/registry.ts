import { DatasetId, DatasetPayload } from "@/lib/types";
import { AnalysisOutput } from "@/lib/ai";
import {
  preprocessSearchTerms,
  SEARCH_TERM_GOBLIN_SYSTEM_INSTRUCTION,
  buildSearchTermGoblinPrompt,
  enrichSearchTermGoblinResult,
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
  preprocess: (datasets: Partial<Record<DatasetId, DatasetPayload>>) => unknown;
  /** Deterministic post-processing on Gemini's validated output (e.g. attaching campaign/adGroup by evidence lookup). Defaults to a no-op. */
  enrichResult?: (result: AnalysisOutput, evidence: unknown) => unknown;
}

export const AGENTS: Record<string, AgentDefinition> = {
  "search-term-goblin": {
    id: "search-term-goblin",
    requiredDatasetTypes: ["search-terms"],
    systemInstruction: SEARCH_TERM_GOBLIN_SYSTEM_INSTRUCTION,
    buildPrompt: (evidence) => buildSearchTermGoblinPrompt(evidence as Parameters<typeof buildSearchTermGoblinPrompt>[0]),
    preprocess: (datasets) => preprocessSearchTerms(datasets["search-terms"]!),
    enrichResult: (result, evidence) =>
      enrichSearchTermGoblinResult(result, evidence as Parameters<typeof buildSearchTermGoblinPrompt>[0]),
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
