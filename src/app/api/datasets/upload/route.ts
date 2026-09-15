import { NextResponse } from "next/server";
import { parseUploadedFile } from "@/lib/parsing/parseFile";
import { validateAndNormalizeSearchTerms } from "@/lib/parsing/searchTermsSchema";
import { registerDataset } from "@/lib/server/datasetStore";
import { DATASET_MAP } from "@/lib/datasets";
import { DatasetId } from "@/lib/types";

const MAX_BYTES = 15 * 1024 * 1024;
const SEARCH_TERMS_COLUMNS = ["searchTerm", "impressions", "clicks", "cost", "conversions"];

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ message: "Couldn't read the upload." }, { status: 400 });
  }

  const files = form.getAll("file").filter((f): f is File => f instanceof File);
  const datasetType = form.get("datasetType");

  if (files.length === 0) {
    return NextResponse.json({ message: "No file provided." }, { status: 400 });
  }
  if (typeof datasetType !== "string" || !DATASET_MAP[datasetType as DatasetId]) {
    return NextResponse.json({ message: "Unknown dataset type." }, { status: 400 });
  }

  const isSearchTermsShaped = datasetType === "search-terms" || datasetType === "peer-search-terms";

  let combinedColumns: string[] = [];
  const combinedRows: Record<string, unknown>[] = [];
  const filenames: string[] = [];
  const issues: string[] = [];
  let currencyCode: string | undefined;

  for (const file of files) {
    if (file.size === 0) {
      issues.push(`"${file.name}" is empty — skipped.`);
      continue;
    }
    if (file.size > MAX_BYTES) {
      issues.push(`"${file.name}" is too large (max 15MB) — skipped.`);
      continue;
    }

    let parsed;
    try {
      parsed = await parseUploadedFile(file);
    } catch (err) {
      issues.push(`"${file.name}": ${err instanceof Error ? err.message : "could not parse."}`);
      continue;
    }

    if (isSearchTermsShaped) {
      const result = validateAndNormalizeSearchTerms(parsed.columns, parsed.rows);
      if (result.validation.state === "invalid") {
        issues.push(`"${file.name}": ${result.validation.issues[0] ?? "failed validation."}`);
        continue;
      }
      combinedRows.push(...(result.rows as unknown as Record<string, unknown>[]));
      combinedColumns = SEARCH_TERMS_COLUMNS;
      for (const issue of result.validation.issues) issues.push(`"${file.name}": ${issue}`);
      if (result.currencyCode) {
        if (!currencyCode) {
          currencyCode = result.currencyCode;
        } else if (currencyCode !== result.currencyCode) {
          issues.push(
            `"${file.name}" is in ${result.currencyCode}, but earlier file(s) are in ${currencyCode} — cost comparisons across these will be skewed.`
          );
        }
      }
      filenames.push(file.name);
    } else {
      if (parsed.rows.length === 0) {
        issues.push(`"${file.name}" has no data rows — skipped.`);
        continue;
      }
      combinedRows.push(...parsed.rows);
      combinedColumns = parsed.columns;
      filenames.push(file.name);
    }
  }

  if (filenames.length === 0) {
    return NextResponse.json(
      { message: issues[0] ?? "File failed validation.", issues },
      { status: 422 }
    );
  }

  const validation = { state: (issues.length > 0 ? "warning" : "valid") as "warning" | "valid", issues };

  const dataset = registerDataset({
    datasetType: datasetType as DatasetId,
    filename: filenames.length === 1 ? filenames[0] : `${filenames.length} files`,
    sourceFiles: filenames,
    currencyCode,
    columns: combinedColumns,
    rows: combinedRows,
    validation,
  });

  return NextResponse.json({
    id: dataset.id,
    filename: dataset.filename,
    sourceFiles: dataset.sourceFiles,
    currencyCode: dataset.currencyCode,
    datasetType: dataset.datasetType,
    uploadedAt: dataset.uploadedAt,
    rowCount: dataset.rowCount,
    columns: dataset.columns,
    validation: dataset.validation,
  });
}
