"use client";

import { DATASETS } from "@/lib/datasets";
import { useLab } from "@/lib/store";
import { REAL_UPLOAD_DATASET_TYPES } from "@/lib/liveAgents";
import DatasetUploadButton from "./DatasetUploadButton";

export default function PantryPanel() {
  const { pantry, feedDataset } = useLab();

  return (
    <section className="rounded-xl border border-border bg-bg-panel p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">The Pantry</h2>
          <p className="font-mono text-[11px] text-text-faint">
            shared data. feed it once, every compatible robot can eat.
          </p>
        </div>
        <span className="font-mono text-[11px] text-text-dim">
          {Object.keys(pantry).length} / {DATASETS.length} loaded
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-3">
        {DATASETS.map((d) => {
          if (REAL_UPLOAD_DATASET_TYPES.has(d.id)) {
            return <DatasetUploadButton key={d.id} datasetId={d.id} compact />;
          }

          const entry = pantry[d.id];
          const fed = Boolean(entry);
          return (
            <button
              key={d.id}
              onClick={() => !fed && feedDataset(d.id)}
              disabled={fed}
              title={d.description}
              className={`group flex flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                fed
                  ? "border-good/40 bg-good/5 cursor-default"
                  : "border-border bg-bg-panel-2 hover:border-tape/50 hover:bg-tape/5 cursor-pointer"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-base">{d.emoji}</span>
                {fed ? (
                  <span className="font-mono text-[9px] font-semibold text-good">FED</span>
                ) : (
                  <span className="font-mono text-[9px] text-text-faint group-hover:text-tape">
                    + FEED
                  </span>
                )}
              </div>
              <span className="font-mono text-[11px] leading-snug text-text">
                {d.label}
              </span>
              {fed && entry && (
                <span className="font-mono text-[10px] text-text-faint">
                  {entry.rows.toLocaleString()} rows
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
