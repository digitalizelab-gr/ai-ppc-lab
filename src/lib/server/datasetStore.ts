import { randomUUID } from "crypto";
import { DatasetId, DatasetValidation } from "@/lib/types";

export interface StoredDataset {
  id: string;
  datasetType: DatasetId;
  filename: string;
  /** Set when multiple files were merged into one dataset (e.g. several peer accounts). */
  sourceFiles?: string[];
  /** e.g. "GBP" — extracted from a Currency code column when the source report has one. */
  currencyCode?: string;
  uploadedAt: number;
  rowCount: number;
  columns: string[];
  rows: Record<string, unknown>[];
  validation: DatasetValidation;
}

/**
 * In-memory, single-process dataset store. No DB by design — this is a lab.
 * Lives only for the life of the dev/server process; a restart clears it,
 * same as Reset Lab does deliberately.
 */
const store = new Map<string, StoredDataset>();

export function registerDataset(input: {
  datasetType: DatasetId;
  filename: string;
  sourceFiles?: string[];
  currencyCode?: string;
  columns: string[];
  rows: Record<string, unknown>[];
  validation: DatasetValidation;
}): StoredDataset {
  const dataset: StoredDataset = {
    id: randomUUID(),
    uploadedAt: Date.now(),
    rowCount: input.rows.length,
    ...input,
  };
  store.set(dataset.id, dataset);
  return dataset;
}

export function getDataset(id: string): StoredDataset | undefined {
  return store.get(id);
}

export function clearAllDatasets(): void {
  store.clear();
}
