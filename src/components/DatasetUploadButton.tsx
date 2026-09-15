"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { DatasetId } from "@/lib/types";
import { useLab } from "@/lib/store";
import { DATASET_MAP } from "@/lib/datasets";
import { robotsCompatibleWith } from "@/lib/robots";
import { MULTI_FILE_DATASET_TYPES } from "@/lib/liveAgents";

export default function DatasetUploadButton({
  datasetId,
  compact = false,
}: {
  datasetId: DatasetId;
  compact?: boolean;
}) {
  const { pantry, uploadDataset } = useLab();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const entry = pantry[datasetId];
  const dataset = DATASET_MAP[datasetId];
  const compatibleRobots = robotsCompatibleWith(datasetId);
  const multiple = MULTI_FILE_DATASET_TYPES.has(datasetId);

  async function handleFiles(files: File[]) {
    setBusy(true);
    setError(null);
    try {
      await uploadDataset(datasetId, files);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  if (entry) {
    const warn = entry.validation?.state === "warning";
    return (
      <div
        className={`animate-fade-in flex flex-col gap-1.5 rounded-lg border border-good/40 bg-good/5 ${
          compact ? "px-3 py-2" : "px-3 py-2.5"
        }`}
      >
        <div className="flex items-center gap-2">
          <span>{dataset.emoji}</span>
          <span className="font-mono text-xs text-text">{dataset.label}</span>
          <span className="font-mono text-[10px] font-semibold text-good">FED</span>
        </div>
        <span className="font-mono text-[10px] text-text-faint">
          {entry.sourceFiles && entry.sourceFiles.length > 1
            ? `${entry.sourceFiles.length} accounts merged`
            : entry.filename}{" "}
          · {entry.rows.toLocaleString()} rows
          {entry.currencyCode && ` · ${entry.currencyCode}`}
        </span>
        {entry.sourceFiles && entry.sourceFiles.length > 1 && (
          <span className="font-mono text-[9px] leading-snug text-text-faint">
            {entry.sourceFiles.join(", ")}
          </span>
        )}

        {compatibleRobots.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {compatibleRobots.map((r) => (
              <Link
                key={r.id}
                href={`/robots/${r.id}`}
                className="inline-flex items-center gap-1 rounded-full border border-good/30 bg-good/5 px-2 py-0.5 font-mono text-[9px] text-good transition-colors hover:bg-good/15"
              >
                ✓ {r.name}
              </Link>
            ))}
          </div>
        )}

        {warn && entry.validation?.issues.length ? (
          <span className="font-mono text-[10px] text-tape">
            ⚠ {entry.validation.issues[0]}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className={compact ? "" : "flex flex-col gap-1"}>
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className={`flex items-center gap-2 rounded-lg border border-border bg-bg-panel-2 text-left transition-colors hover:border-tape/50 hover:bg-tape/5 disabled:cursor-wait disabled:opacity-70 ${
          compact ? "px-3 py-2" : "px-3 py-2.5"
        } cursor-pointer`}
      >
        <span>{dataset.emoji}</span>
        <span className="font-mono text-xs text-text">{dataset.label}</span>
        {busy ? (
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-tape">
            <span className="h-2.5 w-2.5 animate-spin-slow rounded-full border-2 border-tape border-t-transparent" />
            UPLOADING…
          </span>
        ) : (
          <span className="font-mono text-[10px] text-text-faint">
            {multiple ? "+ UPLOAD ONE OR MORE" : "+ UPLOAD CSV/XLSX"}
          </span>
        )}
      </button>
      {error && (
        <p className="flex items-start gap-1 font-mono text-[10px] leading-snug text-danger">
          <span>⚠</span>
          <span>{error}</span>
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) handleFiles(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
