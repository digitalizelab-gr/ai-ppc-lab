const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "for", "to", "of", "in", "on", "with",
  "near", "me", "best", "top", "how", "what", "is", "are", "vs", "your",
  "you", "can", "will", "does", "do", "at", "by", "from", "this", "that",
]);

export function tokenize(term: string): string[] {
  return term
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t) && Number.isNaN(Number(t)));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
