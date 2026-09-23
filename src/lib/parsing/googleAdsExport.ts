/** Google Ads' UI export appends "Total: ..." rows below the real data on every report type — never real rows. */
export const AGGREGATE_ROW_PREFIX = /^total:/i;

export function isAggregateRow(value: unknown): boolean {
  return AGGREGATE_ROW_PREFIX.test(String(value ?? "").trim());
}
