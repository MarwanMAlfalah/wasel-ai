import { generateWithAnthropic } from "@/lib/ai/anthropic";
import { generateWithGemini } from "@/lib/ai/gemini";
import { generateWithGrok } from "@/lib/ai/grok";
import { generateWithOpenAI } from "@/lib/ai/openai";
import { aiProviderSchema, type AIProviderName } from "@/lib/ai/types";

export function getSelectedAIProvider(): AIProviderName {
  const parsedProvider = aiProviderSchema.safeParse(
    process.env.AI_PROVIDER ?? "openai",
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

export function getProviderImplementation(provider: AIProviderName) {
  switch (provider) {
    case "openai":
      return generateWithOpenAI;
    case "gemini":
      return generateWithGemini;
    case "anthropic":
      return generateWithAnthropic;
    case "grok":
      return generateWithGrok;
    case "mock":
      throw new Error("Mock provider is handled separately");
  }
}
