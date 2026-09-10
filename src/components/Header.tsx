"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ResetLabButton from "./ResetLabButton";

export default function Header() {
  const pathname = usePathname();
  if (pathname === "/gate") return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-bg">
      <div className="h-1 tape-stripe opacity-70" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-good/50 bg-good/10 font-mono text-sm font-bold text-good group-hover:bg-good/20 transition-colors">
            ⚡
          </span>
          <div className="leading-tight">
            <div className="font-display text-[15px] font-bold tracking-tight">
              PPC LAB
            </div>
            <div className="font-mono text-[10px] text-text-faint">
              anti-bullshit robot collective
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/ai-test"
            className="font-mono text-[11px] text-text-faint hover:text-text transition-colors"
          >
            AI test lab →
          </Link>
          <ResetLabButton />
        </div>
      </div>
    </header>
  );
}
