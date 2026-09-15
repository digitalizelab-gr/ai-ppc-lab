import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface RawParsedFile {
  columns: string[];
  rows: Record<string, string>[];
}

/**
 * Google Ads' own "download report" export (the one a real PPC person
 * actually has on hand) prepends a title line and a date-range line before
 * the real header, and appends "Total: ..." summary rows at the end. Rather
 * than special-case that exact shape, find the header generically: it's the
 * first row whose column count matches the most common column count in the
 * file (title/date preamble lines are short one-cell rows that lose that vote).
 */
function detectHeaderRow(rows: string[][]): { header: string[]; dataRows: string[][] } {
  if (rows.length === 0) {
    throw new Error("File has no rows.");
  }

  const counts = new Map<number, number>();
  for (const r of rows) {
    if (r.length <= 1) continue;
    counts.set(r.length, (counts.get(r.length) ?? 0) + 1);
  }

  let modeLen = 0;
  let modeCount = 0;
  for (const [len, count] of counts) {
    if (count > modeCount) {
      modeLen = len;
      modeCount = count;
    }
  }

  if (modeLen === 0) {
    return { header: rows[0].map((h) => h.trim()), dataRows: rows.slice(1) };
  }

  const headerIdx = rows.findIndex((r) => r.length === modeLen);
  const header = rows[headerIdx].map((h) => h.trim());
  const dataRows = rows.slice(headerIdx + 1).filter((r) => r.length === modeLen);
  return { header, dataRows };
}

function toObjectRows(header: string[], dataRows: string[][]): Record<string, string>[] {
  return dataRows.map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, i) => {
      obj[h] = r[i] ?? "";
    });
    return obj;
  });
}

export async function parseUploadedFile(file: File): Promise<RawParsedFile> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".csv")) {
    const text = await file.text();
    if (!text.trim()) {
      throw new Error("That CSV file is empty.");
    }
    // Delimiter is forced to "," rather than auto-detected: Papa's heuristic
    // samples early lines to guess the delimiter, and a "|"-separated campaign
    // naming convention (extremely common in real Google Ads accounts, e.g.
    // "Brand | Search | US") can out-vote the real comma delimiter, especially
    // when — as in Google Ads' own report export — the first couple of lines
    // are a title/date-range line with no commas at all to vote with.
    const result = Papa.parse<string[]>(text, { skipEmptyLines: true, delimiter: "," });
    const { header, dataRows } = detectHeaderRow(result.data);
    return { columns: header, rows: toObjectRows(header, dataRows) };
  }

  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const buffer = await file.arrayBuffer();
    if (buffer.byteLength === 0) {
      throw new Error("That spreadsheet file is empty.");
    }
    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(buffer, { type: "array" });
    } catch {
      throw new Error("Couldn't read that spreadsheet — the file may be corrupted.");
    }
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error("That spreadsheet has no sheets.");
    }
    const sheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json<string[]>(sheet, {
      header: 1,
      defval: "",
      raw: false,
    });
    const { header, dataRows } = detectHeaderRow(rawRows.map((r) => r.map((c) => String(c))));
    return { columns: header, rows: toObjectRows(header, dataRows) };
  }

  throw new Error("Unsupported file type — upload a .csv or .xlsx file.");
}
