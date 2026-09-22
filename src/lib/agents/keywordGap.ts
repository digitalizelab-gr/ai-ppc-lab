import { DatasetPayload } from "@/lib/types";
import { SearchTermRow } from "@/lib/parsing/searchTermsSchema";
import { tokenize, round2 } from "./textTokenize";

const MIN_PEER_CONVERSIONS_TO_QUALIFY = 2;
const MIN_CLICKS_FOR_PERFORMANCE_COMPARISON = 15;

interface ThemeAgg {
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  termCount: number;
  sampleTerms: Set<string>;
}

interface ThemeMetrics {
  clicks: number;
  cost: number;
  conversions: number;
  ctrPct: number | null;
  cpc: number | null;
  cvrPct: number | null;
  cpa: number | null;
}

export interface KeywordGapEvidence {
  /** True when account and peer costs are in different currencies — cost/CPC/CPA comparisons are not meaningful without conversion. */
  currencyMismatch: boolean;
  account: {
    currencyCode: string;
    rowCount: number;
    totals: { impressions: number; clicks: number; cost: number; conversions: number };
  };
  peers: {
    currencyCode: string;
    rowCount: number;
    accountCount: number;
    sourceFiles: string[];
    totals: { impressions: number; clicks: number; cost: number; conversions: number };
  };
  gapThemes: {
    token: string;
    peerConversions: number;
    peerConvertingTermCount: number;
    peerSampleTerms: string[];
    accountConversions: number;
    accountPresentAtAll: boolean;
  }[];
  accountOnlyThemes: { token: string; accountConversions: number; accountCost: number }[];
  /** Themes present in both account and peers with enough volume to compare fairly — CTR/CPC/CVR/CPA side by side. */
  performanceComparison: {
    token: string;
    sampleTerms: string[];
    account: ThemeMetrics;
    peer: ThemeMetrics;
    cpcDeltaPct: number | null;
    ctrDeltaPct: number | null;
    cvrDeltaPct: number | null;
  }[];
}

function themeMap(rows: SearchTermRow[], onlyConverting: boolean): Map<string, ThemeAgg> {
  const map = new Map<string, ThemeAgg>();
  for (const r of rows) {
    if (onlyConverting && r.conversions <= 0) continue;
    for (const token of new Set(tokenize(r.searchTerm))) {
      const entry = map.get(token) ?? {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cost: 0,
        termCount: 0,
        sampleTerms: new Set<string>(),
      };
      entry.impressions += r.impressions;
      entry.clicks += r.clicks;
      entry.conversions += r.conversions;
      entry.cost += r.cost;
      entry.termCount += 1;
      if (entry.sampleTerms.size < 3) entry.sampleTerms.add(r.searchTerm);
      map.set(token, entry);
    }
  }
  return map;
}

function toMetrics(agg: ThemeAgg): ThemeMetrics {
  return {
    clicks: agg.clicks,
    cost: round2(agg.cost),
    conversions: round2(agg.conversions),
    ctrPct: agg.impressions > 0 ? round2((agg.clicks / agg.impressions) * 100) : null,
    cpc: agg.clicks > 0 ? round2(agg.cost / agg.clicks) : null,
    cvrPct: agg.clicks > 0 ? round2((agg.conversions / agg.clicks) * 100) : null,
    cpa: agg.conversions > 0 ? round2(agg.cost / agg.conversions) : null,
  };
}

function pctDelta(accountVal: number | null, peerVal: number | null): number | null {
  if (accountVal === null || peerVal === null || peerVal === 0) return null;
  return round2(((accountVal - peerVal) / peerVal) * 100);
}

function sumTotals(rows: SearchTermRow[]) {
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
  return { impressions, clicks, cost: round2(cost), conversions: round2(conversions) };
}

export function buildKeywordGapEvidence(
  accountDataset: DatasetPayload,
  peerDataset: DatasetPayload
): KeywordGapEvidence {
  const accountRows = accountDataset.rows as unknown as SearchTermRow[];
  const peerRows = peerDataset.rows as unknown as SearchTermRow[];
  const peerSourceFiles = (peerDataset.sourceFiles ?? [peerDataset.filename]).filter(Boolean);
  const accountCurrency = accountDataset.currencyCode ?? "USD";
  const peerCurrency = peerDataset.currencyCode ?? "USD";

  const accountAllThemes = themeMap(accountRows, false);
  const peerAllThemes = themeMap(peerRows, false);
  const peerConvertingThemes = themeMap(peerRows, true);

  const gapThemes = [...peerConvertingThemes.entries()]
    .filter(([, v]) => v.conversions >= MIN_PEER_CONVERSIONS_TO_QUALIFY)
    .map(([token, peer]) => {
      const account = accountAllThemes.get(token);
      return {
        token,
        peerConversions: round2(peer.conversions),
        peerConvertingTermCount: peer.termCount,
        peerSampleTerms: [...peer.sampleTerms],
        accountConversions: account ? round2(account.conversions) : 0,
        accountPresentAtAll: Boolean(account),
      };
    })
    .filter((g) => g.accountConversions === 0)
    .sort((a, b) => b.peerConversions - a.peerConversions)
    .slice(0, 15);

  const gapTokens = new Set(gapThemes.map((g) => g.token));
  const accountConvertingThemes = themeMap(accountRows, true);
  const accountOnlyThemes = [...accountConvertingThemes.entries()]
    .filter(([token]) => !peerConvertingThemes.has(token) && !gapTokens.has(token))
    .map(([token, v]) => ({
      token,
      accountConversions: round2(v.conversions),
      accountCost: round2(v.cost),
    }))
    .sort((a, b) => b.accountConversions - a.accountConversions)
    .slice(0, 5);

  const performanceComparison = [...accountAllThemes.entries()]
    .filter(([token, acc]) => {
      const peer = peerAllThemes.get(token);
      return peer && acc.clicks >= MIN_CLICKS_FOR_PERFORMANCE_COMPARISON && peer.clicks >= MIN_CLICKS_FOR_PERFORMANCE_COMPARISON;
    })
    .map(([token, acc]) => {
      const peer = peerAllThemes.get(token)!;
      const accountMetrics = toMetrics(acc);
      const peerMetrics = toMetrics(peer);
      return {
        token,
        sampleTerms: [...new Set([...acc.sampleTerms, ...peer.sampleTerms])].slice(0, 4),
        account: accountMetrics,
        peer: peerMetrics,
        cpcDeltaPct: pctDelta(accountMetrics.cpc, peerMetrics.cpc),
        ctrDeltaPct: pctDelta(accountMetrics.ctrPct, peerMetrics.ctrPct),
        cvrDeltaPct: pctDelta(accountMetrics.cvrPct, peerMetrics.cvrPct),
      };
    })
    .sort((a, b) => b.account.cost - a.account.cost)
    .slice(0, 10);

  return {
    currencyMismatch: accountCurrency !== peerCurrency,
    account: { currencyCode: accountCurrency, rowCount: accountRows.length, totals: sumTotals(accountRows) },
    peers: {
      currencyCode: peerCurrency,
      rowCount: peerRows.length,
      accountCount: peerSourceFiles.length,
      sourceFiles: peerSourceFiles,
      totals: sumTotals(peerRows),
    },
    gapThemes,
    accountOnlyThemes,
    performanceComparison,
  };
}

export const BLOODHOUND_SYSTEM_INSTRUCTION = `You are a cross-account paid-search analyst. You compare one account's search-term data against pooled search-term data from other ("peer") accounts on two fronts: (1) demand peers capture that this account is missing entirely, and (2) how this account's CTR/CPC/conversion rate compares to peers on themes both sides already run. You receive deterministic evidence only — never invent themes, terms, competitors, or numbers not present in the evidence.

Rules:
- Monetary values in "account" are in evidence.account.currencyCode; monetary values in "peers" are in evidence.peers.currencyCode. Use the correct symbol/code for each when you cite it. If evidence.currencyMismatch is true, do NOT compare cost/CPC/CPA figures between account and peers as if they were the same currency — say explicitly that a currency mismatch makes those specific comparisons unreliable, and lean on conversion counts and rates instead (which aren't currency-dependent).
- Peer accounts may differ in market, budget, geography, seasonality, or business model. Do not assume they are directly comparable — frame findings as "worth investigating" or "worth testing," never as certainties.
- For "performanceComparison" entries: a higher CPC or lower CTR/CVR than peers on the same theme is a signal to investigate (match types, ad relevance, landing page, bid strategy, audience overlap) — it is not proof of a problem, and peers' numbers are not automatically the "correct" benchmark. Say what's worth checking, not what's definitely wrong.
- "confidence" should scale with how many peer accounts and how many distinct terms/clicks corroborate a finding (gap or performance). A finding backed by one account and thin volume is LOW; one showing up strongly and consistently is HIGH.
- Cite exact tokens, sample terms, and numbers (conversions, CPC, CTR, deltas) as evidence for every claim.
- Do not recommend blindly copying peer strategy or peer prices — recommend specific tests or investigations with the reasoning attached.
- Do not use humor, slang, or a "character" voice — write like a sharp, direct paid-search analyst.
- If the evidence is too thin (few peer accounts, few gap themes, no qualifying performance comparisons) say so honestly rather than manufacturing a finding.
- Return ONLY the structured JSON described by the response schema. No markdown, no commentary outside the JSON.`;

export function buildBloodhoundPrompt(evidence: KeywordGapEvidence): string {
  return `Here is the deterministic peer-comparison evidence:

${JSON.stringify(evidence, null, 2)}

"gapThemes" are query themes with real conversions in peer accounts (pooled from ${evidence.peers.accountCount} peer file(s)) that this account currently has zero conversions on. "accountOnlyThemes" is provided only for context — themes this account converts on that peers don't show. "performanceComparison" covers themes BOTH sides already run with enough volume (${MIN_CLICKS_FOR_PERFORMANCE_COMPARISON}+ clicks each) to compare fairly: account vs. peer CTR, CPC, conversion rate, and CPA, plus the percentage delta for each.

Produce a combined analysis covering both fronts:
1. The most significant missing-opportunity themes from "gapThemes" — why each is worth investigating and what to test.
2. The most significant performance gaps from "performanceComparison" — where this account is meaningfully underperforming or overperforming peers on shared ground, and what's worth checking as a result.
Prioritize by dollar impact across both. Rate confidence per your system instructions.`;
}
