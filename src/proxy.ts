import { NextRequest, NextResponse } from "next/server";
import { DEMO_GATE_COOKIE, demoGateEnabled, sha256Hex } from "@/lib/demoGate";

export async function proxy(req: NextRequest) {
  if (!demoGateEnabled()) {
    return NextResponse.next();
  }

  const password = process.env.PPC_LAB_DEMO_PASSWORD as string;
  const expected = await sha256Hex(password);
  const cookie = req.cookies.get(DEMO_GATE_COOKIE)?.value;

  if (cookie === expected) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ message: "Demo password required." }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/gate";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|gate|api/gate).*)"],
};
