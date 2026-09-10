export type ModelKey = "flash" | "pro";

export interface StructuredGenerationRequest {
  systemInstruction: string;
  prompt: string;
  /** JSON-Schema-ish object (OpenAPI subset) describing the required response shape. */
  responseSchema: Record<string, unknown>;
  model?: ModelKey;
}

export interface AIProvider {
  readonly name: string;
  generateStructured(req: StructuredGenerationRequest): Promise<unknown>;
}

export type AIErrorCode =
  | "missing_key"
  | "invalid_key"
  | "rate_limited"
  | "empty_response"
  | "invalid_json"
  | "timeout"
  | "network"
  | "unknown";

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly code: AIErrorCode = "unknown",
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}
