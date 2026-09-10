"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Robot } from "@/lib/types";
import { useLab } from "@/lib/store";
import RobotAvatar from "./RobotAvatar";
import StateBadge from "./StateBadge";
import { pick } from "@/lib/robots";

export default function RobotCard({ robot }: { robot: Robot }) {
  const { hydrated, robotStatus, compatibleDatasetsInPantry } = useLab();
  const state = robotStatus(robot);
  const fedCount = compatibleDatasetsInPantry(robot).length;

  const [motto, setMotto] = useState(robot.mottos[0]);

  useEffect(() => {
    if (!hydrated) return;
    // Random flavor text on state change — a display concern with no correct "derive during render" form.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMotto(state === "hungry" ? pick(robot.stateMessages.hungry) : pick(robot.mottos));
  }, [robot, state, hydrated]);

  return (
    <Link
      href={`/robots/${robot.id}`}
      className="group relative flex flex-col rounded-xl border p-5 transition-all hover:-translate-y-0.5"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-panel)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100"
        style={{ boxShadow: `0 0 0 1px ${robot.color}55, 0 8px 30px -12px ${robot.color}66` }}
      />
      <div className="mb-3 flex items-start justify-between">
        <RobotAvatar robotId={robot.id} color={robot.color} state={state} size={64} />
        <StateBadge state={state} />
      </div>

      <h3 className="font-display text-lg font-bold">{robot.name}</h3>
      <p className="font-mono text-[11px] text-text-faint">{robot.role}</p>

      <p className="mt-3 min-h-[2.5rem] text-sm text-text-dim italic">
        &ldquo;{motto}&rdquo;
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-border-soft pt-3">
        <div className="flex -space-x-1">
          {robot.food.map((f) => (
            <span
              key={f}
              className={`grid h-6 w-6 place-items-center rounded-full border text-[11px] ${
                fedCount > 0 ? "border-good/50 bg-good/10" : "border-border bg-bg-panel-2"
              }`}
            >
              🍽️
            </span>
          ))}
        </div>
        <span className="font-mono text-[11px] text-text-faint group-hover:text-text transition-colors">
          open lab →
        </span>
      </div>
    </Link>
  );
}
