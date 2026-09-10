"use client";

import { RobotState } from "@/lib/types";

interface RobotAvatarProps {
  robotId: string;
  color: string;
  state?: RobotState;
  size?: number;
  className?: string;
}

/**
 * A small shared robot chassis with per-robot accessories bolted on,
 * plus a state-driven face so the same robot reads as hungry / ready /
 * analysing / found-something / nothing-interesting / error.
 */
export default function RobotAvatar({
  robotId,
  color,
  state = "ready",
  size = 96,
  className = "",
}: RobotAvatarProps) {
  const bodyAnim =
    state === "hungry"
      ? "animate-droop"
      : state === "error"
      ? "animate-shake"
      : state === "found-something"
      ? "animate-bounce-soft"
      : "animate-float";

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`${bodyAnim} ${className}`}
    >
      <g className={bodyAnim === "animate-float" ? "" : ""}>
        {/* antenna */}
        <line x1="60" y1="14" x2="60" y2="26" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle
          cx="60"
          cy="10"
          r="5"
          fill={color}
          className={state === "ready" || state === "found-something" ? "animate-pulse-glow" : ""}
        />

        {/* head */}
        <rect x="30" y="26" width="60" height="42" rx="14" fill="#1a1d22" stroke={color} strokeWidth="2.5" />

        {/* accessory (behind/around head, per-robot) */}
        <Accessory robotId={robotId} color={color} />

        {/* eyes */}
        <Eyes state={state} color={color} />

        {/* body */}
        <rect x="24" y="72" width="72" height="36" rx="10" fill="#1a1d22" stroke={color} strokeWidth="2.5" />
        <rect x="40" y="84" width="40" height="4" rx="2" fill={color} opacity="0.35" />
        <rect x="40" y="93" width="26" height="4" rx="2" fill={color} opacity="0.25" />

        {/* arms */}
        <line x1="24" y1="86" x2="10" y2="96" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <line x1="96" y1="86" x2="110" y2="96" stroke={color} strokeWidth="4" strokeLinecap="round" />
      </g>

      <StateBadgeIcon state={state} color={color} />
    </svg>
  );
}

function Eyes({ state, color }: { state: RobotState; color: string }) {
  switch (state) {
    case "hungry":
      return (
        <>
          <rect x="44" y="45" width="10" height="3" rx="1.5" fill={color} opacity="0.7" />
          <rect x="66" y="45" width="10" height="3" rx="1.5" fill={color} opacity="0.7" />
        </>
      );
    case "analysing":
      return (
        <>
          <circle cx="49" cy="46" r="6" fill="none" stroke={color} strokeWidth="2" strokeDasharray="10 6" className="animate-spin-slow" style={{ transformOrigin: "49px 46px" }} />
          <circle cx="71" cy="46" r="6" fill="none" stroke={color} strokeWidth="2" strokeDasharray="10 6" className="animate-spin-slow" style={{ transformOrigin: "71px 46px" }} />
        </>
      );
    case "found-something":
      return (
        <>
          <circle cx="49" cy="46" r="6" fill={color} />
          <circle cx="71" cy="46" r="6" fill={color} />
          <circle cx="47" cy="44" r="1.6" fill="#0a0b0d" />
          <circle cx="69" cy="44" r="1.6" fill="#0a0b0d" />
        </>
      );
    case "nothing-interesting":
      return (
        <>
          <rect x="43" y="45" width="12" height="3" rx="1.5" fill={color} />
          <rect x="65" y="45" width="12" height="3" rx="1.5" fill={color} />
        </>
      );
    case "error":
      return (
        <>
          <g stroke={color} strokeWidth="2.4" strokeLinecap="round">
            <line x1="44" y1="41" x2="54" y2="51" />
            <line x1="54" y1="41" x2="44" y2="51" />
            <line x1="66" y1="41" x2="76" y2="51" />
            <line x1="76" y1="41" x2="66" y2="51" />
          </g>
        </>
      );
    case "ready":
    default:
      return (
        <>
          <circle cx="49" cy="46" r="6" fill={color} className="animate-blink" style={{ transformOrigin: "49px 46px" }} />
          <circle cx="71" cy="46" r="6" fill={color} className="animate-blink" style={{ transformOrigin: "71px 46px" }} />
        </>
      );
  }
}

function StateBadgeIcon({ state, color }: { state: RobotState; color: string }) {
  const cx = 96;
  const cy = 24;
  switch (state) {
    case "hungry":
      return (
        <g transform={`translate(${cx - 8}, ${cy - 8})`}>
          <rect x="0" y="4" width="16" height="8" rx="1.5" fill="none" stroke="#5b5e66" strokeWidth="1.6" />
          <rect x="16" y="6" width="2.5" height="4" fill="#5b5e66" />
          <rect x="2" y="6" width="4" height="4" fill="#5b5e66" opacity="0.5" />
        </g>
      );
    case "error":
      return (
        <g transform={`translate(${cx - 9}, ${cy - 8})`} className="animate-pulse-glow">
          <path d="M9 0 L18 16 H0 Z" fill="none" stroke="#ff5c5c" strokeWidth="1.6" strokeLinejoin="round" />
          <line x1="9" y1="6" x2="9" y2="11" stroke="#ff5c5c" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="9" cy="13.5" r="1" fill="#ff5c5c" />
        </g>
      );
    case "found-something":
      return (
        <g transform={`translate(${cx - 6}, ${cy - 9})`} className="animate-bounce-soft">
          <circle cx="6" cy="9" r="9" fill="none" stroke={color} strokeWidth="1.6" />
          <line x1="6" y1="4.5" x2="6" y2="10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="6" cy="13" r="1" fill={color} />
        </g>
      );
    case "ready":
      return (
        <g transform={`translate(${cx - 6}, ${cy - 9})`} className="animate-pulse-glow">
          <path d="M7 0 L1 10 H6 L4 18 L12 7 H7 Z" fill={color} />
        </g>
      );
    default:
      return null;
  }
}

function Accessory({ robotId, color }: { robotId: string; color: string }) {
  switch (robotId) {
    case "search-term-goblin":
      return (
        <>
          <path d="M28 40 L14 30 L26 52 Z" fill="#1a1d22" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M92 40 L106 30 L94 52 Z" fill="#1a1d22" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M50 62 L54 68 L58 62 Z" fill={color} opacity="0.8" />
          <path d="M62 62 L66 68 L70 62 Z" fill={color} opacity="0.8" />
        </>
      );
    case "feed-goblin":
      return (
        <>
          <path d="M50 26 L60 8 L70 26 Z" fill="#1a1d22" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="60" cy="8" r="2.5" fill={color} />
          <rect x="24" y="100" width="72" height="3" fill={color} opacity="0.5" />
        </>
      );
    case "creative-critic":
      return (
        <>
          <circle cx="71" cy="46" r="9" fill="none" stroke={color} strokeWidth="1.8" />
          <line x1="80" y1="46" x2="88" y2="50" stroke={color} strokeWidth="1.8" />
          <path d="M52 74 L60 79 L68 74 L60 70 Z" fill={color} />
        </>
      );
    case "auction-spy":
      return (
        <>
          <path d="M26 30 L94 30 L86 20 L34 20 Z" fill="#1a1d22" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
          <rect x="40" y="14" width="40" height="10" rx="2" fill="#1a1d22" stroke={color} strokeWidth="2.2" />
          <path d="M20 72 L24 86 L30 74 Z" fill="#1a1d22" stroke={color} strokeWidth="2" />
          <path d="M100 72 L96 86 L90 74 Z" fill="#1a1d22" stroke={color} strokeWidth="2" />
        </>
      );
    case "change-detective":
      return (
        <>
          <path d="M28 28 Q60 8 92 28 L92 32 Q60 16 28 32 Z" fill="#1a1d22" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M24 26 L14 20 L18 30 Z" fill="#1a1d22" stroke={color} strokeWidth="1.8" />
          <path d="M96 26 L106 20 L102 30 Z" fill="#1a1d22" stroke={color} strokeWidth="1.8" />
          <circle cx="14" cy="90" r="8" fill="none" stroke={color} strokeWidth="2.2" />
          <line x1="19.5" y1="95.5" x2="26" y2="102" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case "account-historian":
      return (
        <>
          <circle cx="49" cy="46" r="10" fill="none" stroke={color} strokeWidth="1.8" />
          <circle cx="71" cy="46" r="10" fill="none" stroke={color} strokeWidth="1.8" />
          <line x1="59" y1="46" x2="61" y2="46" stroke={color} strokeWidth="1.8" />
          <rect x="52" y="85" width="16" height="12" rx="1.5" fill="none" stroke={color} strokeWidth="1.8" />
          <line x1="60" y1="85" x2="60" y2="97" stroke={color} strokeWidth="1.2" />
        </>
      );
    default:
      return null;
  }
}
