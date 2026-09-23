import { z } from "zod";

/**
 * What Gemini itself produces for a keyword action — deliberately just the
 * term, match type, and reasoning. campaign/adGroup are NOT Gemini's to
 * fill in: asking a model to transcribe a structured field verbatim from
 * a nested evidence lookup is exactly the kind of mechanical join that
 * belongs in deterministic code, not a prompt (it produced mangled,
 * reasoning-leaked output when asked to do it). Each agent instead
 * attaches campaign/adGroup itself after generation, by looking the term
 * up in its own evidence — see searchTermGoblin's enrichResult.
 */
const KeywordActionSchema = z.object({
  term: z.string().min(1),
  matchType: z.enum(["exact", "phrase"]),
  reason: z.string().min(1),
});

const KEYWORD_ACTION_JSON_SCHEMA = {
  type: "object",
  properties: {
    term: { type: "string" },
    matchType: { type: "string", enum: ["exact", "phrase"] },
    reason: { type: "string" },
  },
  required: ["term", "matchType", "reason"],
};

/** Fixed contract for generateAnalysis() — every live agent's result shape. */
export const AnalysisResultSchema = z.object({
  headline: z.string().min(1),
  insights: z.array(z.string().min(1)).min(1).max(8),
  actions: z.array(z.string().min(1)).min(1).max(8),
  expectedImpact: z.string().min(1),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
  evidence: z.array(z.string().min(1)).min(1).max(10),
  // Optional, structured, copy-paste-ready — not every agent populates these.
  negativeKeywords: z.array(KeywordActionSchema).max(15).optional(),
  keywordsToAdd: z.array(KeywordActionSchema).max(10).optional(),
});
export type AnalysisOutput = z.infer<typeof AnalysisResultSchema>;

export const ANALYSIS_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    headline: { type: "string" },
    insights: { type: "array", items: { type: "string" } },
    actions: { type: "array", items: { type: "string" } },
    expectedImpact: { type: "string" },
    confidence: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
    evidence: { type: "array", items: { type: "string" } },
    negativeKeywords: { type: "array", items: KEYWORD_ACTION_JSON_SCHEMA },
    keywordsToAdd: { type: "array", items: KEYWORD_ACTION_JSON_SCHEMA },
  },
  required: ["headline", "insights", "actions", "expectedImpact", "confidence", "evidence"],
};

/** Fixed contract for generateRecommendations() — a flat, prioritized punch list. */
export const RecommendationsSchema = z.object({
  recommendations: z
    .array(
      z.object({
        title: z.string().min(1),
        detail: z.string().min(1),
        impact: z.enum(["HIGH", "MEDIUM", "LOW"]),
      })
    )
    .min(1)
    .max(10),
});
export type RecommendationsOutput = z.infer<typeof RecommendationsSchema>;

export const RECOMMENDATIONS_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
          impact: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
        },
        required: ["title", "detail", "impact"],
      },
    },
  },
  required: ["recommendations"],
};
