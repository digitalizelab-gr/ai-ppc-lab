import { DatasetPayload } from "@/lib/types";
import { SearchTermRow } from "@/lib/parsing/searchTermsSchema";
import { buildSearchTermEvidence, SearchTermEvidence } from "./searchTermsEvidence";

export function preprocessSearchTerms(dataset: DatasetPayload): SearchTermEvidence {
  return buildSearchTermEvidence(dataset.rows as unknown as SearchTermRow[], dataset.currencyCode);
}

export const SEARCH_TERM_GOBLIN_SYSTEM_INSTRUCTION = `You are a meticulous Google/Microsoft Ads search-term analyst. You receive pre-aggregated, deterministic evidence computed from a real search terms report — you never see the raw report itself, and all totals and lists in the evidence are already correct.

Rules:
- All monetary values in the evidence are in the currency given by evidence.currencyCode. Use that currency's symbol or code in your writing (e.g. "£412.30" for GBP, "€412.30" for EUR) — never default to "$" unless currencyCode is USD.
- Base every insight and action strictly on the evidence provided. Never invent search terms, numbers, competitors, or statistics that are not present in the evidence.
- For every insight or action that makes a specific claim, add a matching short string to the "evidence" array citing the exact term/metric/value it rests on (e.g. "wasted 412.30 on \\"free resume templates\\" with 0 conversions across 340 clicks" — using the correct currency symbol for the actual currency).
- Prioritize by dollar impact: the biggest wastes and biggest opportunities first.
- "confidence" should be HIGH only when multiple data points corroborate the same conclusion, MEDIUM for one strong data point, LOW for a thin or borderline signal.
- Write "headline" as one sharp sentence stating the single most important finding, ideally with a number in it.
- Do not use humor, slang, or a "character" voice — write like a sharp, direct paid-search analyst.
- If the evidence is too thin to say anything meaningful, say so honestly instead of manufacturing a finding.
- Return ONLY the structured JSON described by the response schema. No markdown, no commentary outside the JSON.`;

export function buildSearchTermGoblinPrompt(evidence: SearchTermEvidence): string {
  return `Here is the deterministic evidence computed from the account's search terms report:

${JSON.stringify(evidence, null, 2)}

Analyze this evidence and produce:
1. The most important insights about wasted spend, negative keyword opportunities, useful demand/intent patterns worth expanding into, and any unexpected themes in "topThemesInWastedSpend".
2. Specific, prioritized actions (e.g. exact negative keywords to add, ad groups to build, terms to investigate further).
3. A realistic expected impact statement grounded in the totals given — do not overstate it.
4. A confidence rating per the rules in your system instructions.`;
}
