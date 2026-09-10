"use client";

import { useLab } from "@/lib/store";

export default function FeedbackButtons({
  resultKey,
  label = "Was this useful?",
}: {
  resultKey: string;
  label?: string;
}) {
  const { feedback, giveFeedback } = useLab();
  const value = feedback[resultKey];

  return (
    <div className="flex items-center gap-2.5">
      <span className="font-mono text-[11px] text-text-faint">{label}</span>
      <button
        onClick={() => giveFeedback(resultKey, "up")}
        aria-pressed={value === "up"}
        className={`rounded-md border px-2 py-1 text-sm transition-colors cursor-pointer ${
          value === "up"
            ? "border-good/60 bg-good/15"
            : "border-border hover:border-good/40 hover:bg-good/5"
        }`}
      >
        👍
      </button>
      <button
        onClick={() => giveFeedback(resultKey, "down")}
        aria-pressed={value === "down"}
        className={`rounded-md border px-2 py-1 text-sm transition-colors cursor-pointer ${
          value === "down"
            ? "border-danger/60 bg-danger/15"
            : "border-border hover:border-danger/40 hover:bg-danger/5"
        }`}
      >
        👎
      </button>
      {value && (
        <span className="font-mono text-[10px] text-text-faint">
          thanks, logged
        </span>
      )}
    </div>
  );
}
