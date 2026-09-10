import { RobotState } from "@/lib/types";
import { STATE_META } from "@/lib/stateMeta";

export default function StateBadge({ state }: { state: RobotState }) {
  const meta = STATE_META[state];
  const pulsing = state === "analysing";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider ${meta.textClass} ${meta.bgClass} ${meta.borderClass}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full bg-current ${pulsing ? "animate-pulse-glow" : ""}`}
      />
      {meta.label}
    </span>
  );
}
