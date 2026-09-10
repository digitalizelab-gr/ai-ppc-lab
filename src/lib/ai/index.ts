import { GeminiProvider } from "./geminiProvider";
import {
  AnalysisResultSchema,
  ANALYSIS_RESPONSE_SCHEMA,
  RecommendationsSchema,
  RECOMMENDATIONS_RESPONSE_SCHEMA,
  type AnalysisOutput,
  type RecommendationsOutput,
} from "./schemas";
import { AIProvider, AIProviderError, ModelKey } from "./types";

/**
 * Only this file (and geminiProvider.ts, which it alone instantiates) knows
 * Gemini exists. Everything else in the app — agents, API routes, UI — calls
 * generateAnalysis / generateRecommendations / generateStructuredOutput and
 * never touches a provider directly. Swapping in ClaudeProvider later means
 * adding one branch in getProvider(), nothing else.
 */
let provider: AIProvider | undefined;

function getProvider(): AIProvider {
  if (provider) return provider;
  const name = process.env.AI_PROVIDER ?? "gemini";
  switch (name) {
    case "gemini":
      provider = new GeminiProvider();
      return provider;
    default:
      throw new AIProviderError(
        `Unknown AI_PROVIDER "${name}" — only "gemini" is implemented right now.`,
        "unknown"
      );
  }
}

export interface GenerateStructuredOutputParams<T> {
  systemInstruction: string;
  prompt: string;
  /** Gemini responseSchema (OpenAPI-subset JSON schema). */
  schema: Record<string, unknown>;
  /** Parses/validates the raw JSON Gemini returns. Throw to reject a malformed response. */
  validate?: (raw: unknown) => T;
  model?: ModelKey;
}

/** The general-purpose primitive. The other two helpers are built on top of this. */
export async function generateStructuredOutput<T = unknown>(
  params: GenerateStructuredOutputParams<T>
): Promise<T> {
  const raw = await getProvider().generateStructured({
    systemInstruction: params.systemInstruction,
    prompt: params.prompt,
    responseSchema: params.schema,
    model: params.model,
  });

  if (!params.validate) return raw as T;

  try {
    return params.validate(raw);
  } catch (err) {
    throw new AIProviderError(
      "Gemini's response didn't match the expected schema.",
      "invalid_json",
      err
    );
  }
}

export interface GenerateAnalysisParams {
  systemInstruction: string;
  prompt: string;
  model?: ModelKey;
}

/** Fixed insights/actions/expectedImpact/confidence/evidence shape — what every robot's live analysis returns. */
export async function generateAnalysis(params: GenerateAnalysisParams): Promise<AnalysisOutput> {
  return generateStructuredOutput<AnalysisOutput>({
    systemInstruction: params.systemInstruction,
    prompt: params.prompt,
    schema: ANALYSIS_RESPONSE_SCHEMA,
    validate: (raw) => AnalysisResultSchema.parse(raw),
    model: params.model,
  });
}

export interface GenerateRecommendationsParams {
  systemInstruction: string;
  prompt: string;
  model?: ModelKey;
}

/** A flat, prioritized punch list — lighter-weight than generateAnalysis when you just need actions. */
export async function generateRecommendations(
  params: GenerateRecommendationsParams
): Promise<RecommendationsOutput> {
  return generateStructuredOutput<RecommendationsOutput>({
    systemInstruction: params.systemInstruction,
    prompt: params.prompt,
    schema: RECOMMENDATIONS_RESPONSE_SCHEMA,
    validate: (raw) => RecommendationsSchema.parse(raw),
    model: params.model,
  });
}

export type { AnalysisOutput, RecommendationsOutput } from "./schemas";
export type { ModelKey, AIErrorCode } from "./types";
export { AIProviderError } from "./types";
