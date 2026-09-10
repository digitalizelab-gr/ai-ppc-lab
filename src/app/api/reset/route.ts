import { NextResponse } from "next/server";
import { clearAllDatasets } from "@/lib/server/datasetStore";

export async function POST() {
  clearAllDatasets();
  return NextResponse.json({ ok: true });
}
