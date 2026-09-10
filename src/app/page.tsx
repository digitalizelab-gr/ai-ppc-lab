"use client";

import { ROBOTS } from "@/lib/robots";
import { useLab } from "@/lib/store";
import PantryPanel from "@/components/PantryPanel";
import RobotCard from "@/components/RobotCard";
import ChiefRobotTeaser from "@/components/ChiefRobotTeaser";

export default function LabHome() {
  const { hydrated, robotStatus } = useLab();

  const readyCount = hydrated
    ? ROBOTS.filter((r) => robotStatus(r) === "ready").length
    : 0;
  const workingCount = hydrated
    ? ROBOTS.filter((r) =>
        ["found-something", "nothing-interesting"].includes(robotStatus(r))
      ).length
    : 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <section className="mb-10">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-bg-panel px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-text-faint">
          <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-good" />
          lab status: online
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          A garage full of anti-bullshit PPC robots.
        </h1>
        <p className="mt-3 max-w-2xl text-text-dim">
          They survive on datasets and electricity, and they hate wasted spend
          more than they hate corporate jargon. Feed them, point them at your
          data, and see what they dig up.
        </p>
        {hydrated && (
          <p className="mt-3 font-mono text-[11px] text-text-faint">
            {readyCount} robot{readyCount === 1 ? "" : "s"} fed and ready ·{" "}
            {workingCount} with findings on the board
          </p>
        )}
      </section>

      <div className="mb-10">
        <PantryPanel />
      </div>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-bold">The Collective</h2>
          <span className="font-mono text-[11px] text-text-faint">
            6 robots, 1 still in pieces
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROBOTS.map((robot) => (
            <RobotCard key={robot.id} robot={robot} />
          ))}
          <ChiefRobotTeaser />
        </div>
      </section>
    </div>
  );
}
