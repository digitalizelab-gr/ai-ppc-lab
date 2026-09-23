import { DatasetPayload, KeywordAction } from "@/lib/types";
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
- Keep "actions" as a short, high-level punch list (the headline moves, not the line items) — the detailed, copy-paste-ready term lists belong in "negativeKeywords" and "keywordsToAdd" instead, so do not duplicate individual terms in "actions".
- "negativeKeywords": one entry per term worth blocking, sourced only from evidence.topWastefulTerms, using the term's exact spelling from that list. matchType "exact" for a specific wasteful query, "phrase" when the reason is really about a token/pattern within it. "reason" is one short clause with the dollar figure, e.g. "412.30 wasted, 0 conversions across 340 clicks". Nothing else — no campaign or ad group field exists on this object, do not add one.
- "keywordsToAdd": one entry per term worth targeting directly, sourced only from evidence.topConvertingTerms (proven demand) or a clearly strong sub-theme in evidence.topThemesInWastedSpend that deserves its own converting-intent variant, using its exact spelling. "reason" states the conversion signal, e.g. "already converting at 6.1% organically via a related term".
- Omit "negativeKeywords" or "keywordsToAdd" entirely (do not return an empty array) if the evidence doesn't support any entries for that list.
- Return ONLY the structured JSON described by the response schema. No markdown, no commentary outside the JSON.`;

export function buildSearchTermGoblinPrompt(evidence: SearchTermEvidence): string {
  return `Here is the deterministic evidence computed from the account's search terms report:

${JSON.stringify(evidence, null, 2)}

Analyze this evidence and produce:
1. The most important insights about wasted spend, negative keyword opportunities, useful demand/intent patterns worth expanding into, and any unexpected themes in "topThemesInWastedSpend".
2. A short, high-level list of prioritized actions in "actions".
3. The detailed, copy-paste-ready term lists in "negativeKeywords" and "keywordsToAdd" per your system instructions.
4. A realistic expected impact statement grounded in the totals given — do not overstate it.
5. A confidence rating per the rules in your system instructions.`;
}

interface RawKeywordAction {
  term: string;
  matchType: "exact" | "phrase";
  reason: string;
}

function findLocation(evidence: SearchTermEvidence, term: string): { campaign?: string; adGroup?: string } {
  const norm = term.trim().toLowerCase();
  const hit =
    evidence.topWastefulTerms.find((t) => t.term.trim().toLowerCase() === norm) ??
    evidence.topConvertingTerms.find((t) => t.term.trim().toLowerCase() === norm);
  if (!hit) return {};
  const location: { campaign?: string; adGroup?: string } = {};
  if (hit.campaign) location.campaign = hit.campaign;
  if (hit.adGroup) location.adGroup = hit.adGroup;
  return location;
}

/**
 * Runs after Gemini's response is validated. campaign/adGroup are attached
 * here by a deterministic lookup against the same evidence Gemini saw —
 * see the comment on KeywordActionSchema for why this isn't Gemini's job.
 */
export function enrichSearchTermGoblinResult<
  T extends { negativeKeywords?: RawKeywordAction[]; keywordsToAdd?: RawKeywordAction[] }
>(result: T, evidence: SearchTermEvidence): T & { negativeKeywords?: KeywordAction[]; keywordsToAdd?: KeywordAction[] } {
  const enrich = (items?: RawKeywordAction[]): KeywordAction[] | undefined =>
    items?.map((item) => ({ ...item, ...findLocation(evidence, item.term) }));

  return {
    ...result,
    negativeKeywords: enrich(result.negativeKeywords),
    keywordsToAdd: enrich(result.keywordsToAdd),
  };
}
