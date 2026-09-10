"use client";

import { useEffect, useState } from "react";

const STAGES = [
  "Reading the file…",
  "Crunching the numbers…",
  "Consulting Gemini…",
  "Structuring the findings…",
];

/**
 * A single fetch has no real progress to report, but a static spinner reads as
 * dead air. Cycling generic stage text (not robot personality — that stays in
 * flavorLine, from the predefined motto pools) gives the wait some shape.
 */
export default function AnalysingPanel({
  accentColor,
  flavorLine,
}: {
  accentColor: string;
  flavorLine: string;
}) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStageIndex((i) => (i + 1) % STAGES.length);
    }, 1500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="rounded-xl border p-6"
      style={{ borderColor: `${accentColor}55`, backgroundColor: `${accentColor}0d` }}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-3.5 w-3.5 shrink-0 animate-spin-slow rounded-full border-2"
          style={{ borderColor: accentColor, borderTopColor: "transparent" }}
        />
        <div>
          <p className="font-mono text-sm font-medium" style={{ color: accentColor }}>
            {flavorLine}
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-text-faint">{STAGES[stageIndex]}</p>
        </div>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full w-1/3 animate-scan rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
}
