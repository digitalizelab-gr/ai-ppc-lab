import { GoogleGenAI } from "@google/genai";
import { AIProvider, AIProviderError, ModelKey, StructuredGenerationRequest } from "./types";

// gemini-2.5-flash / gemini-2.5-pro are retired for new API keys as of this
// build (Google's API now 404s them with a migration hint) — verified live
// against the real API, not from training data. These are the models Google
// itself names as the current replacements; override via env if that shifts.
const MODEL_IDS: Record<ModelKey, string> = {
  flash: process.env.GEMINI_MODEL_FLASH || "gemini-3.6-flash",
  pro: process.env.GEMINI_MODEL_PRO || "gemini-3.1-pro-preview",
};

const REQUEST_TIMEOUT_MS = 30_000;

function classifyError(err: unknown): AIProviderError {
  if (err instanceof AIProviderError) return err;

  const apiErr = err as { status?: number; message?: string; name?: string } | undefined;

  if (apiErr?.status === 401 || apiErr?.status === 403) {
    return new AIProviderError(
      "Gemini rejected the API key — check GEMINI_API_KEY in .env.local.",
      "invalid_key",
      err
    );
  }
  if (apiErr?.status === 429) {
    return new AIProviderError(
      "Gemini rate limit hit — wait a moment and try again.",
      "rate_limited",
      err
    );
  }
  if (apiErr?.status && apiErr.status >= 500) {
    return new AIProviderError(
      `Gemini's servers had a problem (${apiErr.status}). Try again shortly.`,
      "network",
      err
    );
  }
  if (err instanceof Error && (err.name === "AbortError" || /timeout/i.test(err.message))) {
    return new AIProviderError("Gemini took too long to respond. Try again.", "timeout", err);
  }
  if (err instanceof TypeError) {
    return new AIProviderError("Could not reach the Gemini API.", "network", err);
  }

  return new AIProviderError(
    apiErr?.message ?? "The AI provider failed unexpectedly.",
    "unknown",
    err
  );
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new AIProviderError("Gemini took too long to respond. Try again.", "timeout"));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  private readonly client: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new AIProviderError(
        "GEMINI_API_KEY is not set. Add it to .env.local — see README for setup.",
        "missing_key"
      );
    }
    this.client = new GoogleGenAI({ apiKey });
  }

  async generateStructured({
    systemInstruction,
    prompt,
    responseSchema,
    model,
  }: StructuredGenerationRequest): Promise<unknown> {
    const modelId = MODEL_IDS[model ?? "flash"];

    let response;
    try {
      response = await withTimeout(
        this.client.models.generateContent({
          model: modelId,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0.3,
          },
        }),
        REQUEST_TIMEOUT_MS
      );
    } catch (err) {
      throw classifyError(err);
    }

    const text = response.text;
    if (!text || !text.trim()) {
      const finishReason = response.candidates?.[0]?.finishReason ?? "unknown";
      throw new AIProviderError(
        `Gemini returned no content (finishReason: ${finishReason}).`,
        "empty_response"
      );
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      throw new AIProviderError("Gemini's response was not valid JSON.", "invalid_json", err);
    }
  }
}
