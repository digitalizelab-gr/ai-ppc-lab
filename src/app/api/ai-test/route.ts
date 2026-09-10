import { NextResponse } from "next/server";
import { parseUploadedFile } from "@/lib/parsing/parseFile";
import { validateAndNormalizeSearchTerms } from "@/lib/parsing/searchTermsSchema";
import { buildSearchTermEvidence } from "@/lib/agents/searchTermsEvidence";
import {
  QUICK_TEST_SYSTEM_INSTRUCTION,
  buildQuickTestPrompt,
  QUICK_TEST_RESPONSE_SCHEMA,
  QuickTestResultSchema,
} from "@/lib/agents/searchTermsQuickTest";
import { generateStructuredOutput, AIProviderError, ModelKey } from "@/lib/ai";

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

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ message: "Couldn't read the upload." }, { status: 400 });
  }

  const file = form.get("file");
  const modelRaw = form.get("model");
  const model: ModelKey = modelRaw === "pro" ? "pro" : "flash";

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ message: "That file is empty." }, { status: 400 });
  }

  let parsed;
  try {
    parsed = await parseUploadedFile(file);
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Could not parse that file." },
      { status: 400 }
    );
  }

  const { rows, validation } = validateAndNormalizeSearchTerms(parsed.columns, parsed.rows);
  if (validation.state === "invalid") {
    return NextResponse.json(
      { message: validation.issues[0] ?? "File failed validation.", issues: validation.issues },
      { status: 422 }
    );
  }

  const evidence = buildSearchTermEvidence(rows);

  try {
    const result = await generateStructuredOutput({
      systemInstruction: QUICK_TEST_SYSTEM_INSTRUCTION,
      prompt: buildQuickTestPrompt(evidence),
      schema: QUICK_TEST_RESPONSE_SCHEMA,
      validate: (raw) => QuickTestResultSchema.parse(raw),
      model,
    });

    return NextResponse.json({
      filename: file.name,
      rowCount: rows.length,
      validation,
      model,
      evidence,
      result,
    });
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
