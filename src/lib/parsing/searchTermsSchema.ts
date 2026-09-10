import { DatasetValidation } from "@/lib/types";

export interface SearchTermRow {
  searchTerm: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
}

const COLUMN_ALIASES = {
  searchTerm: ["search term", "search terms", "query", "search query"],
  impressions: ["impressions", "impr.", "impr"],
  clicks: ["clicks"],
  cost: ["cost", "spend", "cost usd", "cost (usd)", "cost usd"],
  conversions: ["conversions", "conv.", "conversions.", "conv"],
} as const;

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, " ");
}

function findColumn(columns: string[], aliases: readonly string[]): string | undefined {
  const normalized = columns.map((c) => ({ raw: c, norm: normalizeHeader(c) }));
  for (const alias of aliases) {
    const hit = normalized.find((c) => c.norm === alias);
    if (hit) return hit.raw;
  }
  return undefined;
}

function parseNumber(v: unknown): number {
  if (v === undefined || v === null || v === "") return 0;
  const cleaned = String(v).replace(/[$,%]/g, "").trim();
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export interface ValidatedSearchTerms {
  rows: SearchTermRow[];
  validation: DatasetValidation;
}

export function validateAndNormalizeSearchTerms(
  columns: string[],
  rawRows: Record<string, string>[]
): ValidatedSearchTerms {
  const issues: string[] = [];

  if (rawRows.length === 0) {
    return { rows: [], validation: { state: "invalid", issues: ["File has no data rows."] } };
  }

  const searchTermCol = findColumn(columns, COLUMN_ALIASES.searchTerm);
  const clicksCol = findColumn(columns, COLUMN_ALIASES.clicks);
  const costCol = findColumn(columns, COLUMN_ALIASES.cost);
  const impressionsCol = findColumn(columns, COLUMN_ALIASES.impressions);
  const conversionsCol = findColumn(columns, COLUMN_ALIASES.conversions);

  if (!searchTermCol) {
    issues.push(
      `Missing a "Search term" column. Found: ${columns.join(", ") || "no columns at all"}.`
    );
    return { rows: [], validation: { state: "invalid", issues } };
  }
  if (!clicksCol && !costCol) {
    issues.push('Missing both "Clicks" and "Cost" columns — need at least one to find waste.');
    return { rows: [], validation: { state: "invalid", issues } };
  }
  if (!impressionsCol) issues.push('No "Impressions" column found — CTR will be skipped.');
  if (!conversionsCol) issues.push('No "Conversions" column found — treating every row as 0 conversions.');

  const rows: SearchTermRow[] = [];
  let blankTermRows = 0;

  for (const raw of rawRows) {
    const term = (raw[searchTermCol] ?? "").toString().trim();
    if (!term) {
      blankTermRows++;
      continue;
    }
    rows.push({
      searchTerm: term,
      impressions: impressionsCol ? parseNumber(raw[impressionsCol]) : 0,
      clicks: clicksCol ? parseNumber(raw[clicksCol]) : 0,
      cost: costCol ? parseNumber(raw[costCol]) : 0,
      conversions: conversionsCol ? parseNumber(raw[conversionsCol]) : 0,
    });
  }

  if (blankTermRows > 0) {
    issues.push(`Skipped ${blankTermRows} row(s) with a blank search term.`);
  }
  if (rows.length === 0) {
    issues.push("No usable rows remained after validation.");
    return { rows: [], validation: { state: "invalid", issues } };
  }

  return {
    rows,
    validation: { state: issues.length > 0 ? "warning" : "valid", issues },
  };
}
