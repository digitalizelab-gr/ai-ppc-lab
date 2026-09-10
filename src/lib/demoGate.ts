export const DEMO_GATE_COOKIE = "ppc_lab_demo_auth";

/**
 * Edge-compatible (Web Crypto, not Node crypto) so this works in both
 * middleware and route handlers regardless of runtime. The cookie never
 * holds the raw password — just a hash of it — so it's safe even though
 * it isn't itself a secret value.
 */
export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function demoGateEnabled(): boolean {
  return Boolean(process.env.PPC_LAB_DEMO_PASSWORD);
}
