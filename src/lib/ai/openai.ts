import OpenAI from "openai";

import type { GenerateJsonHandler } from "@/lib/ai/types";

let openAIClient: OpenAI | null = null;

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  if (!openAIClient) {
    openAIClient = new OpenAI({ apiKey });
  }

  return openAIClient;
}

export const generateWithOpenAI: GenerateJsonHandler = async ({
  systemPrompt,
  userPrompt,
}) => {
  const completion = await getOpenAIClient().chat.completions.create({
    model: getOpenAIModel(),
    temperature: 0.2,
    response_format: {
      type: "json_object",
    },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const content = completion.choices[0]?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("OpenAI response did not include content");
  }

  return content.trim();
};
