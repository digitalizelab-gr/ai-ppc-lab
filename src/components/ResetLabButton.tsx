"use client";

import { useState } from "react";
import { useLab } from "@/lib/store";

export default function ResetLabButton({ compact = false }: { compact?: boolean }) {
  const { resetLab } = useLab();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-danger/50 bg-danger/10 px-2 py-1.5">
        <span className="font-mono text-[11px] text-danger whitespace-nowrap">
          Wipe pantry &amp; results?
        </span>
        <button
          onClick={() => {
            resetLab();
            setConfirming(false);
          }}
          className="rounded bg-danger px-2 py-1 text-[11px] font-semibold text-black hover:brightness-110 cursor-pointer"
        >
          Yes, reset
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded border border-border px-2 py-1 text-[11px] text-text-dim hover:text-text cursor-pointer"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title="Clears fed datasets, robot results, and feedback. Does not touch app code."
      className={`group relative overflow-hidden rounded-md border border-tape/40 font-mono font-semibold uppercase tracking-wider text-tape hover:text-black hover:bg-tape transition-colors cursor-pointer ${
        compact ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-2 text-xs"
      }`}
    >
      Reset Lab
    </button>
  );
}
