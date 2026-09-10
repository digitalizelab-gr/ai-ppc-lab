import { SearchTermRow } from "@/lib/parsing/searchTermsSchema";

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "for", "to", "of", "in", "on", "with",
  "near", "me", "best", "top", "how", "what", "is", "are", "vs", "your",
  "you", "can", "will", "does", "do", "at", "by", "from", "this", "that",
]);

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function tokenize(term: string): string[] {
  return term
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t) && Number.isNaN(Number(t)));
}

export interface SearchTermEvidence {
  rowCount: number;
  totals: { impressions: number; clicks: number; cost: number; conversions: number };
  accountAverages: { ctrPct: number | null; conversionRatePct: number | null; cpa: number | null };
  zeroConversion: { spend: number; shareOfCostPct: number | null; termCount: number };
  topWastefulTerms: { term: string; cost: number; clicks: number; impressions: number }[];
  topConvertingTerms: { term: string; conversions: number; cost: number; conversionRatePct: number | null }[];
  topThemesInWastedSpend: { token: string; cost: number; termOccurrences: number }[];
}

/**
 * Deterministic aggregation shared by every search-terms-driven agent
 * (the full Search Term Goblin analysis and the /ai-test quick test). All
 * math happens here in plain code — Gemini only ever sees the output.
 */
export function buildSearchTermEvidence(rows: SearchTermRow[]): SearchTermEvidence {
  let impressions = 0;
  let clicks = 0;
  let cost = 0;
  let conversions = 0;
  for (const r of rows) {
    impressions += r.impressions;
    clicks += r.clicks;
    cost += r.cost;
    conversions += r.conversions;
  }

  const zeroConvRows = rows.filter((r) => r.conversions === 0 && r.cost > 0);
  const zeroConvSpend = zeroConvRows.reduce((sum, r) => sum + r.cost, 0);

  const topWastefulTerms = [...zeroConvRows]
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 12)
    .map((r) => ({ term: r.searchTerm, cost: round2(r.cost), clicks: r.clicks, impressions: r.impressions }));

  const convertingRows = rows.filter((r) => r.conversions > 0);
  const topConvertingTerms = [...convertingRows]
    .sort((a, b) => b.conversions - a.conversions)
    .slice(0, 8)
    .map((r) => ({
      term: r.searchTerm,
      conversions: round2(r.conversions),
      cost: round2(r.cost),
      conversionRatePct: r.clicks > 0 ? round2((r.conversions / r.clicks) * 100) : null,
    }));

  const tokenCost = new Map<string, { cost: number; termOccurrences: number }>();
  for (const r of zeroConvRows) {
    for (const token of new Set(tokenize(r.searchTerm))) {
      const entry = tokenCost.get(token) ?? { cost: 0, termOccurrences: 0 };
      entry.cost += r.cost;
      entry.termOccurrences += 1;
      tokenCost.set(token, entry);
    }
  }
  const topThemesInWastedSpend = [...tokenCost.entries()]
    .sort((a, b) => b[1].cost - a[1].cost)
    .slice(0, 15)
    .map(([token, v]) => ({ token, cost: round2(v.cost), termOccurrences: v.termOccurrences }));

  return {
    rowCount: rows.length,
    totals: { impressions, clicks, cost: round2(cost), conversions: round2(conversions) },
    accountAverages: {
      ctrPct: impressions > 0 ? round2((clicks / impressions) * 100) : null,
      conversionRatePct: clicks > 0 ? round2((conversions / clicks) * 100) : null,
      cpa: conversions > 0 ? round2(cost / conversions) : null,
    },
    zeroConversion: {
      spend: round2(zeroConvSpend),
      shareOfCostPct: cost > 0 ? round2((zeroConvSpend / cost) * 100) : null,
      termCount: zeroConvRows.length,
    },
    topWastefulTerms,
    topConvertingTerms,
    topThemesInWastedSpend,
  };
}
