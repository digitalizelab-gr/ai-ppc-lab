import { AnalysisResult, Confidence } from "@/lib/types";
import FeedbackButtons from "./FeedbackButtons";

const CONFIDENCE_META: Record<Confidence, { color: string; bars: number }> = {
  HIGH: { color: "var(--good)", bars: 3 },
  MEDIUM: { color: "var(--tape)", bars: 2 },
  LOW: { color: "var(--text-faint)", bars: 1 },
};

export default function ResultsView({
  result,
  robotId,
  accentColor,
  sourceLabel,
}: {
  result: AnalysisResult;
  robotId: string;
  accentColor: string;
  sourceLabel?: string;
}) {
  const conf = CONFIDENCE_META[result.confidence];

  return (
    <div className="animate-fade-in rounded-xl border border-border bg-bg-panel p-5 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        {result.evidence ? (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-good/40 bg-good/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-good">
            <span className="h-1.5 w-1.5 rounded-full bg-good" />
            LIVE · GEMINI-GENERATED
          </div>
        ) : (
          <span />
        )}
        {sourceLabel && (
          <span className="font-mono text-[10px] text-text-faint">analyzed {sourceLabel}</span>
        )}
      </div>

      <div className="mb-5 flex items-start justify-between gap-4">
        <h3 className="font-display text-xl font-bold leading-snug sm:text-2xl">
          {result.headline}
        </h3>
        <div
          className="flex shrink-0 flex-col items-end gap-1 rounded-md border px-2.5 py-1.5"
          style={{ borderColor: `${conf.color}55` }}
        >
          <span className="font-mono text-[10px] font-semibold tracking-wider" style={{ color: conf.color }}>
            CONFIDENCE
          </span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="h-2.5 w-1.5 rounded-sm"
                  style={{ backgroundColor: i <= conf.bars ? conf.color : "var(--border)" }}
                />
              ))}
            </div>
            <span className="font-mono text-[11px] font-bold" style={{ color: conf.color }}>
              {result.confidence}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h4 className="mb-2.5 font-mono text-[11px] font-semibold tracking-wider text-text-faint">
            INSIGHTS — WHY IT MATTERS
          </h4>
          <ul className="space-y-2.5">
            {result.insights.map((insight, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-text-dim">
                <span className="shrink-0" style={{ color: accentColor }}>▸</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2.5 font-mono text-[11px] font-semibold tracking-wider text-text-faint">
            RECOMMENDED ACTIONS
          </h4>
          <ul className="space-y-2.5">
            {result.actions.map((action, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-text">
                <span className="shrink-0 text-good">✓</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border-soft bg-bg-panel-2 px-4 py-3">
        <h4 className="mb-1 font-mono text-[11px] font-semibold tracking-wider text-text-faint">
          EXPECTED IMPACT
        </h4>
        <p className="text-sm leading-relaxed text-text">{result.expectedImpact}</p>
      </div>

      {result.evidence && result.evidence.length > 0 && (
        <details open className="group mt-4 rounded-lg border border-border-soft px-4 py-3">
          <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[11px] font-semibold tracking-wider text-text-faint">
            <span>EVIDENCE — WHAT SUPPORTS THIS ({result.evidence.length})</span>
            <span className="text-text-faint transition-transform group-open:rotate-180">▾</span>
          </summary>
          <ul className="mt-2.5 space-y-1.5">
            {result.evidence.map((line, i) => (
              <li key={i} className="flex gap-2 font-mono text-[11px] leading-relaxed text-text-dim">
                <span className="shrink-0" style={{ color: accentColor }}>•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-border-soft pt-4">
        <FeedbackButtons resultKey={`${robotId}:${result.id}`} />
      </div>
    </div>
  );
}
