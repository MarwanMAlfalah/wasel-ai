import {
  generateWithAnthropic,
  getAnthropicModel,
} from "@/lib/ai/anthropic";
import { generateWithGemini, getGeminiModel } from "@/lib/ai/gemini";
import { generateWithGrok } from "@/lib/ai/grok";
import { generateWithOpenAI, getOpenAIModel } from "@/lib/ai/openai";
import { aiProviderSchema, type AIProviderName } from "@/lib/ai/types";

const SECRET_ENV_NAMES = [
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "GEMINI_API_KEY",
  "GROK_API_KEY",
] as const;

export type RemoteAIProviderName = Exclude<AIProviderName, "mock">;

export type ProviderFallbackDiagnostic = {
  selectedProvider: RemoteAIProviderName;
  model: string;
  hasApiKey: boolean;
  errorCode: string | null;
  errorName: string | null;
  errorMessage: string | null;
};

function getStringErrorField(error: unknown, key: string) {
  if (!error || typeof error !== "object" || !(key in error)) {
    return null;
  }

  const value = (error as Record<string, unknown>)[key];

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return null;
}

function sanitizeDiagnosticValue(value: string | null) {
  if (!value) {
    return null;
  }

  let sanitized = value;

  for (const envName of SECRET_ENV_NAMES) {
    const secret = process.env[envName];

    if (secret) {
      sanitized = sanitized.split(secret).join("[REDACTED]");
    }
  }

  sanitized = sanitized
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]")
    .replace(/\s+/g, " ")
    .trim();

  return sanitized.slice(0, 300) || null;
}

export function sanitizeProviderError(error: unknown) {
  const status = getStringErrorField(error, "status");

  return {
    errorCode: sanitizeDiagnosticValue(
      getStringErrorField(error, "code") ??
        getStringErrorField(error, "type") ??
        (status ? `http_${status}` : null),
    ),
    errorName: sanitizeDiagnosticValue(
      getStringErrorField(error, "name") ??
        (error instanceof Error ? error.name : null),
    ),
    errorMessage: sanitizeDiagnosticValue(
      getStringErrorField(error, "message") ??
        (error instanceof Error ? error.message : null),
    ),
  };
}

export function getSelectedAIProvider(): AIProviderName {
  const parsedProvider = aiProviderSchema.safeParse(
    (process.env.AI_PROVIDER ?? "openai").trim().toLowerCase(),
  );

  if (!parsedProvider.success) {
    return "openai";
  }

  return parsedProvider.data;
}

export function isProviderConfigured(provider: AIProviderName) {
  switch (provider) {
    case "openai":
      return Boolean(process.env.OPENAI_API_KEY);
    case "gemini":
      return Boolean(process.env.GEMINI_API_KEY);
    case "anthropic":
      return Boolean(process.env.ANTHROPIC_API_KEY);
    case "grok":
      return Boolean(process.env.GROK_API_KEY);
    case "mock":
      return true;
  }
}

export function getProviderModel(provider: RemoteAIProviderName) {
  switch (provider) {
    case "openai":
      return getOpenAIModel();
    case "gemini":
      return getGeminiModel();
    case "anthropic":
      return getAnthropicModel();
    case "grok":
      return process.env.GROK_MODEL?.trim() || "grok-3-mini";
  }
}

export function createProviderFallbackDiagnostic(
  provider: RemoteAIProviderName,
  error: unknown,
): ProviderFallbackDiagnostic {
  return {
    selectedProvider: provider,
    model: getProviderModel(provider),
    hasApiKey: isProviderConfigured(provider),
    ...sanitizeProviderError(error),
  };
}

export function logProviderFallback(
  operation: "extract" | "follow-up",
  diagnostic: ProviderFallbackDiagnostic,
) {
  console.error("[ai:fallback]", {
    operation,
    selectedProvider: diagnostic.selectedProvider,
    model: diagnostic.model,
    hasApiKey: diagnostic.hasApiKey,
    errorCode: diagnostic.errorCode,
    errorName: diagnostic.errorName,
    errorMessage: diagnostic.errorMessage,
  });
}

export function getAIHealthSnapshot() {
  return {
    selectedProvider: getSelectedAIProvider(),
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    hasAnthropicKey: Boolean(process.env.ANTHROPIC_API_KEY),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasGrokKey: Boolean(process.env.GROK_API_KEY),
    openaiModel: getOpenAIModel(),
    geminiModel: getGeminiModel(),
    anthropicModel: getAnthropicModel(),
    nodeEnv: process.env.NODE_ENV ?? "development",
    runtime: "server" as const,
  };
}

export function getProviderImplementation(provider: RemoteAIProviderName) {
  switch (provider) {
    case "openai":
      return generateWithOpenAI;
    case "gemini":
      return generateWithGemini;
    case "anthropic":
      return generateWithAnthropic;
    case "grok":
      return generateWithGrok;
  }
}
