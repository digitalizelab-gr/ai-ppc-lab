import { z } from "zod";

/** Fixed contract for generateAnalysis() — every live agent's result shape. */
export const AnalysisResultSchema = z.object({
  headline: z.string().min(1),
  insights: z.array(z.string().min(1)).min(1).max(8),
  actions: z.array(z.string().min(1)).min(1).max(8),
  expectedImpact: z.string().min(1),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
  evidence: z.array(z.string().min(1)).min(1).max(10),
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
