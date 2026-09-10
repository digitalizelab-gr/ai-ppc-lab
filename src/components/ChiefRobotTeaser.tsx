import { CHIEF_ROBOT } from "@/lib/chief";

export default function ChiefRobotTeaser() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-6 text-center opacity-70">
      <svg viewBox="0 0 120 120" width={56} height={56}>
        <line x1="60" y1="14" x2="60" y2="26" stroke={CHIEF_ROBOT.color} strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="10" r="5" fill={CHIEF_ROBOT.color} />
        <rect x="26" y="26" width="68" height="46" rx="16" fill="#1a1d22" stroke={CHIEF_ROBOT.color} strokeWidth="2.5" strokeDasharray="4 3" />
        <rect x="46" y="43" width="10" height="10" fill="none" stroke={CHIEF_ROBOT.color} strokeWidth="1.8" />
        <rect x="64" y="43" width="10" height="10" fill="none" stroke={CHIEF_ROBOT.color} strokeWidth="1.8" />
        <rect x="22" y="76" width="76" height="34" rx="10" fill="#1a1d22" stroke={CHIEF_ROBOT.color} strokeWidth="2.5" strokeDasharray="4 3" />
      </svg>
      <div>
        <div className="font-display text-base font-bold text-text-dim">
          {CHIEF_ROBOT.name}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-text-faint">
          {CHIEF_ROBOT.role}
        </div>
      </div>
      <p className="max-w-xs text-xs text-text-faint">{CHIEF_ROBOT.bio}</p>
      <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-text-faint">
        still being assembled
      </span>
    </div>
  );
}
