import { NextResponse } from "next/server";
import { parseUploadedFile } from "@/lib/parsing/parseFile";
import { validateAndNormalizeSearchTerms } from "@/lib/parsing/searchTermsSchema";
import { registerDataset } from "@/lib/server/datasetStore";
import { DATASET_MAP } from "@/lib/datasets";
import { DatasetId, DatasetValidation } from "@/lib/types";

const MAX_BYTES = 15 * 1024 * 1024;

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ message: "Couldn't read the upload." }, { status: 400 });
  }

  const file = form.get("file");
  const datasetType = form.get("datasetType");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided." }, { status: 400 });
  }
  if (typeof datasetType !== "string" || !DATASET_MAP[datasetType as DatasetId]) {
    return NextResponse.json({ message: "Unknown dataset type." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ message: "That file is empty." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: "File is too large (max 15MB)." }, { status: 400 });
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

  let columns = parsed.columns;
  let rows: Record<string, unknown>[] = parsed.rows;
  let validation: DatasetValidation;

  if (datasetType === "search-terms") {
    const result = validateAndNormalizeSearchTerms(parsed.columns, parsed.rows);
    validation = result.validation;
    if (validation.state !== "invalid") {
      rows = result.rows as unknown as Record<string, unknown>[];
      columns = ["searchTerm", "impressions", "clicks", "cost", "conversions"];
    }
  } else {
    validation =
      parsed.rows.length > 0
        ? { state: "valid", issues: [] }
        : { state: "invalid", issues: ["File has no data rows."] };
  }

  if (validation.state === "invalid") {
    return NextResponse.json(
      { message: validation.issues[0] ?? "File failed validation.", issues: validation.issues },
      { status: 422 }
    );
  }

  const dataset = registerDataset({
    datasetType: datasetType as DatasetId,
    filename: file.name,
    columns,
    rows,
    validation,
  });

  return NextResponse.json({
    id: dataset.id,
    filename: dataset.filename,
    datasetType: dataset.datasetType,
    uploadedAt: dataset.uploadedAt,
    rowCount: dataset.rowCount,
    columns: dataset.columns,
    validation: dataset.validation,
  });
}
