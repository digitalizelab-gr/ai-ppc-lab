import { NextResponse } from "next/server";

// No server-side dataset store to clear (see DatasetPayload for why) — all
// state lives client-side in the Pantry, so a reset is purely a client-side
// concern. This endpoint exists so the client has one consistent "reset"
// call to make regardless of what future server-side state might exist.
export async function POST() {
  return NextResponse.json({ ok: true });
}
