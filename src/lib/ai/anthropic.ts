import Anthropic from "@anthropic-ai/sdk";

import type { GenerateJsonHandler } from "@/lib/ai/types";

let anthropicClient: Anthropic | null = null;

export function getAnthropicModel() {
  return process.env.ANTHROPIC_MODEL?.trim() || "claude-3-5-sonnet-latest";
}

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is missing");
  }

  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey });
  }

  return anthropicClient;
}

export const generateWithAnthropic: GenerateJsonHandler = async ({
  systemPrompt,
  userPrompt,
}) => {
  const message = await getAnthropicClient().messages.create({
    model: getAnthropicModel(),
    max_tokens: 1400,
    temperature: 0.2,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const text = message.content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
    .trim();

  if (!text) {
    throw new Error("Anthropic response did not include text");
  }

  return text;
};
