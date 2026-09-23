"use client";

import { useState } from "react";
import { KeywordAction } from "@/lib/types";

/** Google Ads Editor / bulk-upload convention: [exact match], "phrase match". */
function formatForCopy(item: KeywordAction): string {
  return item.matchType === "exact" ? `[${item.term}]` : `"${item.term}"`;
}

export default function KeywordActionList({
  title,
  icon,
  items,
  accentColor,
}: {
  title: string;
  icon: string;
  items: KeywordAction[];
  accentColor: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = items.map(formatForCopy).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable (e.g. insecure context) — the list is still selectable by hand
    }
  }

  return (
    <div className="rounded-xl border border-border bg-bg-panel p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-wider text-text-faint">
          <span>{icon}</span>
          {title.toUpperCase()} ({items.length})
        </h4>
        <button
          onClick={handleCopy}
          className="shrink-0 cursor-pointer rounded-md border border-border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-text-dim transition-colors hover:border-good/50 hover:text-good"
        >
          {copied ? "Copied ✓" : "Copy list"}
        </button>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex flex-col gap-0.5 border-b border-border-soft pb-2.5 last:border-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <code
                className="rounded bg-bg-panel-2 px-1.5 py-0.5 font-mono text-[11px]"
                style={{ color: accentColor }}
              >
                {formatForCopy(item)}
              </code>
              <span className="font-mono text-[9px] uppercase tracking-wider text-text-faint">
                {item.matchType}
              </span>
              {(item.campaign || item.adGroup) && (
                <span className="font-mono text-[10px] text-text-faint">
                  → {[item.campaign, item.adGroup].filter(Boolean).join(" / ")}
                </span>
              )}
            </div>
            <p className="text-[12px] text-text-dim">{item.reason}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
