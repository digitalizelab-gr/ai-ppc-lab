import { RobotState } from "./types";

export const STATE_META: Record<
  RobotState,
  { label: string; textClass: string; bgClass: string; borderClass: string }
> = {
  hungry: {
    label: "HUNGRY",
    textClass: "text-text-faint",
    bgClass: "bg-white/5",
    borderClass: "border-border",
  },
  ready: {
    label: "READY",
    textClass: "text-good",
    bgClass: "bg-good/10",
    borderClass: "border-good/40",
  },
  analysing: {
    label: "ANALYSING",
    textClass: "text-tape",
    bgClass: "bg-tape/10",
    borderClass: "border-tape/40",
  },
  "found-something": {
    label: "FOUND SOMETHING",
    textClass: "text-[#ff5fb3]",
    bgClass: "bg-[#ff5fb3]/10",
    borderClass: "border-[#ff5fb3]/40",
  },
  "nothing-interesting": {
    label: "NOTHING INTERESTING",
    textClass: "text-text-dim",
    bgClass: "bg-white/5",
    borderClass: "border-border",
  },
  error: {
    label: "ERROR",
    textClass: "text-danger",
    bgClass: "bg-danger/10",
    borderClass: "border-danger/40",
  },
};
