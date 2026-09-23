import { NextResponse } from "next/server";
import { getAgent } from "@/lib/agents/registry";
import { generateAnalysis, AIProviderError } from "@/lib/ai";
import { DatasetId, DatasetPayload } from "@/lib/types";

export const maxDuration = 60;

function statusForErrorCode(code: string): number {
  switch (code) {
    case "missing_key":
      return 500;
    case "invalid_key":
      return 401;
    case "rate_limited":
      return 429;
    case "timeout":
      return 504;
    default:
      return 502;
  }
}

function isValidDatasetPayload(v: unknown): v is DatasetPayload {
  if (!v || typeof v !== "object") return false;
  const d = v as Partial<DatasetPayload>;
  return (
    typeof d.datasetType === "string" &&
    Array.isArray(d.columns) &&
    Array.isArray(d.rows) &&
    !!d.validation &&
    typeof d.validation.state === "string"
  );
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;
  const agent = getAgent(agentId);
  if (!agent) {
    return NextResponse.json(
      { message: `"${agentId}" isn't wired to live analysis yet.` },
      { status: 501 }
    );
  }

  let body: { datasets?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }
  if (!body.datasets) {
    return NextResponse.json({ message: "Missing datasets." }, { status: 400 });
  }

  const datasets: Partial<Record<DatasetId, DatasetPayload>> = {};
  for (const type of agent.requiredDatasetTypes) {
    const candidate = body.datasets[type];
    if (!isValidDatasetPayload(candidate)) {
      return NextResponse.json(
        { message: `Missing or malformed dataset for "${type}" — re-upload it.` },
        { status: 400 }
      );
    }
    if (candidate.datasetType !== type) {
      return NextResponse.json({ message: `Wrong dataset type supplied for "${type}".` }, { status: 400 });
    }
    if (candidate.validation.state === "invalid") {
      return NextResponse.json(
        { message: `The "${type}" dataset failed validation — re-upload a valid file.` },
        { status: 400 }
      );
    }
    datasets[type] = candidate;
  }

  const evidence = agent.preprocess(datasets);

  try {
    const result = await generateAnalysis({
      systemInstruction: agent.systemInstruction,
      prompt: agent.buildPrompt(evidence),
    });
    const enriched = agent.enrichResult ? agent.enrichResult(result, evidence) : result;
    return NextResponse.json({ result: { id: `live-${Date.now()}`, ...(enriched as object) } });
  } catch (err) {
    if (err instanceof AIProviderError) {
      return NextResponse.json(
        { message: err.message, code: err.code },
        { status: statusForErrorCode(err.code) }
      );
    }
    return NextResponse.json({ message: "The AI provider failed unexpectedly." }, { status: 502 });
  }
}
