"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import AnalysingPanel from "@/components/AnalysingPanel";

interface QuickTestResult {
  wastedSpendOpportunities: string[];
  negativeKeywordSuggestions: string[];
  themesDetected: string[];
  quickWins: string[];
}

interface ApiResponse {
  filename: string;
  rowCount: number;
  validation: { state: "valid" | "warning" | "invalid"; issues: string[] };
  model: "flash" | "pro";
  evidence: unknown;
  result: QuickTestResult;
}

interface ApiError {
  message: string;
  code?: string;
  issues?: string[];
}

const SECTIONS: { key: keyof QuickTestResult; label: string; icon: string }[] = [
  { key: "wastedSpendOpportunities", label: "Wasted Spend Opportunities", icon: "💸" },
  { key: "negativeKeywordSuggestions", label: "Negative Keyword Suggestions", icon: "🚫" },
  { key: "themesDetected", label: "Themes Detected", icon: "🧭" },
  { key: "quickWins", label: "Quick Wins", icon: "⚡" },
];

export default function AiTestPage() {
  const [model, setModel] = useState<"flash" | "pro">("flash");
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setResponse(null);
    setFileName(file.name);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("model", model);
      const res = await fetch("/api/ai-test", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data as ApiError);
        return;
      }
      setResponse(data as ApiResponse);
    } catch {
      setError({ message: "Network error reaching the server." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/" className="font-mono text-[11px] text-text-faint hover:text-text">
        ← back to the garage
      </Link>

      <section className="mt-4 rounded-xl border border-border bg-bg-panel p-6">
        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-good/40 bg-good/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-good">
          <span className="h-1.5 w-1.5 rounded-full bg-good" />
          AI TEST ROUTE
        </div>
        <h1 className="font-display text-2xl font-bold">AI Test Lab</h1>
        <p className="mt-2 max-w-xl text-sm text-text-dim">
          Upload a Google Ads search terms export (CSV or XLSX). It gets parsed and
          deterministically aggregated server-side, then the evidence is sent to Gemini
          for a quick diagnostic: wasted spend, negative keyword suggestions, themes, and
          quick wins. This is a standalone sandbox — separate from the Pantry and
          doesn&apos;t touch robot state.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-text-faint">MODEL</span>
            <div className="flex overflow-hidden rounded-md border border-border">
              {(["flash", "pro"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setModel(m)}
                  className={`px-3 py-1.5 font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                    model === m ? "bg-good text-black" : "bg-bg-panel-2 text-text-faint hover:text-text"
                  }`}
                >
                  {m === "flash" ? "gemini-3.6-flash" : "gemini-3.1-pro-preview"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="cursor-pointer rounded-lg border border-border bg-bg-panel-2 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-text hover:border-tape/50 hover:bg-tape/5 disabled:opacity-60"
          >
            {busy ? "Analysing…" : "Upload CSV / XLSX"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          {fileName && (
            <span className="ml-3 font-mono text-[11px] text-text-faint">{fileName}</span>
          )}
        </div>
      </section>

      {busy && (
        <div className="mt-6">
          <AnalysingPanel
            accentColor="#f4c430"
            flavorLine={`Parsing, aggregating, and calling ${model === "flash" ? "gemini-3.6-flash" : "gemini-3.1-pro-preview"}…`}
          />
        </div>
      )}

      {error && (
        <div className="animate-fade-in mt-6 rounded-xl border border-danger/40 bg-danger/5 p-6">
          <p className="font-display text-base font-semibold text-danger">⚠ {error.message}</p>
          {error.code && (
            <p className="mt-1 font-mono text-[11px] text-text-faint">code: {error.code}</p>
          )}
          {error.issues && error.issues.length > 0 && (
            <ul className="mt-2 space-y-1">
              {error.issues.map((issue, i) => (
                <li key={i} className="font-mono text-[11px] text-text-faint">
                  • {issue}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {response && (
        <div className="animate-fade-in mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border-soft bg-bg-panel-2 px-4 py-2.5">
            <span className="font-mono text-[11px] text-text-faint">
              {response.filename} · {response.rowCount.toLocaleString()} rows · {response.model}
            </span>
            {response.validation.state === "warning" && (
              <span className="font-mono text-[11px] text-tape">
                ⚠ {response.validation.issues.length} warning(s)
              </span>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SECTIONS.map(({ key, label, icon }) => (
              <div key={key} className="rounded-xl border border-border bg-bg-panel p-5">
                <h3 className="mb-2 flex items-center gap-2 font-mono text-[11px] font-semibold tracking-wider text-text-faint">
                  <span>{icon}</span>
                  {label.toUpperCase()}
                </h3>
                <ul className="space-y-1.5">
                  {response.result[key].map((line, i) => (
                    <li key={i} className="flex gap-2 text-sm text-text-dim">
                      <span className="text-good">▸</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <details
            className="rounded-lg border border-border-soft px-4 py-3"
            open={showRaw}
            onToggle={(e) => setShowRaw((e.target as HTMLDetailsElement).open)}
          >
            <summary className="cursor-pointer font-mono text-[11px] font-semibold tracking-wider text-text-faint">
              RAW EVIDENCE + RESPONSE
            </summary>
            <pre className="mt-3 max-h-96 overflow-auto rounded-md bg-bg-panel-2 p-3 font-mono text-[11px] text-text-dim">
              {JSON.stringify({ evidence: response.evidence, result: response.result }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
