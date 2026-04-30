import type { GenerateJsonHandler } from "@/lib/ai/types";

const GROK_MODEL = "grok-3-mini";

export const generateWithGrok: GenerateJsonHandler = async ({
  systemPrompt,
  userPrompt,
}) => {
  const apiKey = process.env.GROK_API_KEY;

  if (!apiKey) {
    throw new Error("GROK_API_KEY is missing");
  }

  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROK_MODEL,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Grok request failed: ${errorText}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Grok response did not include content");
  }

  return content;
};
