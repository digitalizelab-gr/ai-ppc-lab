import { z } from "zod";
import { SearchTermEvidence } from "./searchTermsEvidence";

export const QUICK_TEST_SYSTEM_INSTRUCTION = `You are a Google/Microsoft Ads search-term analyst running a quick diagnostic pass. You receive pre-aggregated, deterministic evidence computed from a real search terms report — never invent search terms, numbers, or statistics not present in the evidence.

Return exactly four short, prioritized lists:
- wastedSpendOpportunities: specific search terms or patterns burning budget with no return, with the dollar amount.
- negativeKeywordSuggestions: exact negative keywords to add, grounded in the wasted spend evidence.
- themesDetected: recurring intent themes visible in the evidence (converting or not).
- quickWins: the highest-leverage, lowest-effort actions to take this week.

Every list item should be a single, specific, evidence-grounded sentence — no vague advice like "review your keywords." Do not use humor or a character voice. Return ONLY the structured JSON described by the response schema.`;

export function buildQuickTestPrompt(evidence: SearchTermEvidence): string {
  return `Here is the deterministic evidence computed from an uploaded search terms report:

${JSON.stringify(evidence, null, 2)}

Produce the four lists described in your system instructions, grounded strictly in this evidence.`;
}

export const QuickTestResultSchema = z.object({
  wastedSpendOpportunities: z.array(z.string().min(1)).min(1).max(8),
  negativeKeywordSuggestions: z.array(z.string().min(1)).min(1).max(10),
  themesDetected: z.array(z.string().min(1)).min(1).max(8),
  quickWins: z.array(z.string().min(1)).min(1).max(6),
});
export type QuickTestResult = z.infer<typeof QuickTestResultSchema>;

export const QUICK_TEST_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    wastedSpendOpportunities: { type: "array", items: { type: "string" } },
    negativeKeywordSuggestions: { type: "array", items: { type: "string" } },
    themesDetected: { type: "array", items: { type: "string" } },
    quickWins: { type: "array", items: { type: "string" } },
  },
  required: ["wastedSpendOpportunities", "negativeKeywordSuggestions", "themesDetected", "quickWins"],
};
