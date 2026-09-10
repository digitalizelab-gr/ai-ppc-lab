import { NextResponse } from "next/server";
import { getDataset } from "@/lib/server/datasetStore";
import { getAgent } from "@/lib/agents/registry";
import { generateAnalysis, AIProviderError } from "@/lib/ai";

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

  let body: { datasetId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }
  if (!body.datasetId) {
    return NextResponse.json({ message: "Missing datasetId." }, { status: 400 });
  }

  const dataset = getDataset(body.datasetId);
  if (!dataset) {
    return NextResponse.json(
      { message: "That dataset is no longer available — upload it again." },
      { status: 404 }
    );
  }
  if (dataset.datasetType !== agent.requiredDatasetType) {
    return NextResponse.json({ message: "Wrong dataset type for this robot." }, { status: 400 });
  }
  if (dataset.validation.state === "invalid") {
    return NextResponse.json({ message: "That dataset failed validation — re-upload a valid file." }, { status: 400 });
  }

  const evidence = agent.preprocess(dataset);

  try {
    const result = await generateAnalysis({
      systemInstruction: agent.systemInstruction,
      prompt: agent.buildPrompt(evidence),
    });
    return NextResponse.json({ result: { id: `live-${Date.now()}`, ...result } });
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
