"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function GateForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Incorrect password.");
        setBusy(false);
        return;
      }
      window.location.href = next;
    } catch {
      setError("Network error — try again.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 grid h-16 w-16 place-items-center rounded-2xl border-2 border-good/50 bg-good/10 text-3xl">
            🤖
          </div>
          <h1 className="font-display text-xl font-bold">The garage is locked.</h1>
          <p className="mt-1 max-w-xs text-sm text-text-dim">
            This is a private test build of PPC Lab. Got a password from whoever
            sent you the link? Type it below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-bg-panel p-5">
          <label className="mb-2 block font-mono text-[11px] font-semibold tracking-wider text-text-faint">
            DEMO PASSWORD
          </label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-border bg-bg-panel-2 px-3 py-2.5 font-mono text-sm text-text outline-none focus:border-good/50"
          />
          {error && (
            <p className="mt-2 font-mono text-[11px] text-danger">⚠ {error}</p>
          )}
          <button
            type="submit"
            disabled={busy || !password}
            className="mt-4 w-full cursor-pointer rounded-lg bg-good px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Checking…" : "Let me in"}
          </button>
        </form>

        <p className="mt-4 text-center font-mono text-[10px] text-text-faint">
          anti-bullshit PPC robot collective · handle with care
        </p>
      </div>
    </div>
  );
}

export default function GatePage() {
  return (
    <Suspense fallback={null}>
      <GateForm />
    </Suspense>
  );
}
