import { GoogleGenAI } from "@google/genai";

import type { GenerateJsonHandler } from "@/lib/ai/types";

const GEMINI_COMPATIBILITY_MODEL = "gemini-2.5-flash";

let geminiClient: GoogleGenAI | null = null;

export function getGeminiModel() {
  return process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }

  return geminiClient;
}

function isMissingLegacyGeminiModel(error: unknown) {
  const status =
    typeof error === "object" && error && "status" in error
      ? (error as { status?: unknown }).status
      : null;
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String((error as { message?: unknown }).message)
        : "";

  return (
    status === 404 ||
    /not found/i.test(message) ||
    /not supported for generateContent/i.test(message)
  );
}

async function generateGeminiContent(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  responseMode: "json" | "text",
) {
  const response = await getGeminiClient().models.generateContent({
    model,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.2,
      responseMimeType:
        responseMode === "json" ? "application/json" : "text/plain",
    },
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini response did not include text");
  }

  return text;
}

export const generateWithGemini: GenerateJsonHandler = async ({
  systemPrompt,
  userPrompt,
  responseMode = "json",
}) => {
  const requestedModel = getGeminiModel();

  try {
    return await generateGeminiContent(
      requestedModel,
      systemPrompt,
      userPrompt,
      responseMode,
    );
  } catch (error) {
    const shouldRetryWithCompatibilityModel =
      !process.env.GEMINI_MODEL &&
      requestedModel === "gemini-1.5-flash" &&
      isMissingLegacyGeminiModel(error);

    if (!shouldRetryWithCompatibilityModel) {
      throw error;
    }

    return generateGeminiContent(
      GEMINI_COMPATIBILITY_MODEL,
      systemPrompt,
      userPrompt,
      responseMode,
    );
  }
};
