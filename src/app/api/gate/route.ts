import { NextResponse } from "next/server";
import { DEMO_GATE_COOKIE, demoGateEnabled, sha256Hex } from "@/lib/demoGate";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function POST(req: Request) {
  if (!demoGateEnabled()) {
    return NextResponse.json({ ok: true, note: "No demo password configured — access is already open." });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const password = process.env.PPC_LAB_DEMO_PASSWORD as string;
  if (!body.password || body.password !== password) {
    return NextResponse.json({ message: "Incorrect password." }, { status: 401 });
  }

  const token = await sha256Hex(password);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEMO_GATE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
  return res;
}
