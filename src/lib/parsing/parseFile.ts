import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface RawParsedFile {
  columns: string[];
  rows: Record<string, string>[];
}

export async function parseUploadedFile(file: File): Promise<RawParsedFile> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".csv")) {
    const text = await file.text();
    if (!text.trim()) {
      throw new Error("That CSV file is empty.");
    }
    const result = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    });
    if (result.errors.some((e) => e.type === "Delimiter")) {
      throw new Error("Couldn't detect a delimiter — is this really a CSV file?");
    }
    return { columns: result.meta.fields ?? [], rows: result.data };
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
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
      defval: "",
      raw: false,
    });
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    return { columns, rows };
  }

  throw new Error("Unsupported file type — upload a .csv or .xlsx file.");
}
