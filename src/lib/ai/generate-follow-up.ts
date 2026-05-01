import {
  createProviderFallbackDiagnostic,
  getProviderImplementation,
  getSelectedAIProvider,
  isProviderConfigured,
  logProviderFallback,
} from "@/lib/ai/provider";
import type {
  FollowUpInput,
  FollowUpResult,
} from "@/lib/ai/types";

const followUpSystemPrompt = `You are “واصل AI”, an Arabic financial communication assistant for freelancers.
You write polite, natural, Saudi-friendly Arabic follow-up messages for clients.
Your messages are suitable for WhatsApp.
They should be respectful, clear, warm, and not embarrassing or aggressive.`;

function buildFollowUpUserPrompt(input: FollowUpInput) {
  return `Generate a follow-up message using this invoice data:

clientName: ${input.clientName ?? "null"}
service: ${input.service ?? "null"}
remainingAmount: ${input.remainingAmount ?? "null"}
currency: ${input.currency ?? "null"}
dueDate: ${input.dueDate ?? "null"}
paymentStatus: ${input.paymentStatus ?? "null"}
agreementTone: ${input.agreementTone ?? "null"}
clientUrgency: ${input.clientUrgency ?? "null"}
followUpStyle: ${input.followUpStyle ?? "null"}

Rules:
- Write in Arabic with a natural Saudi-friendly tone.
- Keep it professional but warm.
- Mention the remaining amount if available.
- Mention the project/service if available.
- Mention the due date if available.
- Ask the client to confirm once payment is completed.
- Do not sound aggressive.
- Do not be too long.
- Return only the message text.
- Do not include markdown.
- Do not include explanations.`;
}

function sanitizeMessage(text: string) {
  return text
    .replace(/```/g, "")
    .replace(/^["'`\s]+|["'`\s]+$/g, "")
    .trim();
}

function buildFallbackFollowUpMessage(input: FollowUpInput) {
  const client = input.clientName ? `هلا ${input.clientName}` : "هلا";
  const amount =
    input.remainingAmount !== null
      ? `${input.remainingAmount.toLocaleString("en-US")} ${input.currency ?? "ريال"}`
      : "المبلغ المتبقي";
  const service = input.service ? ` لمشروع ${input.service}` : "";
  const dueDate = input.dueDate ? `، حسب اتفاقنا يكون السداد بتاريخ ${input.dueDate}` : "";
  const styleLead =
    input.followUpStyle?.includes("مباش") || input.clientUrgency === "عالية"
      ? "حبيت أذكّرك بشكل سريع"
      : "حبيت أذكّرك";

  return `${client}، يعطيك العافية.
${styleLead} بالمبلغ المتبقي ${amount}${service}${dueDate}.
إذا تم التحويل، علّمني عشان أحدث حالة الفاتورة.
شكرًا لك.`;
}

async function runProviderFollowUp(input: FollowUpInput) {
  const provider = getSelectedAIProvider();

  if (provider === "mock") {
    throw new Error("Mock provider selected");
  }

  if (!isProviderConfigured(provider)) {
    throw new Error(`${provider} is not configured`);
  }

  const generate = getProviderImplementation(provider);
  const userPrompt = buildFollowUpUserPrompt(input);

  const rawText = await generate({
    systemPrompt: followUpSystemPrompt,
    userPrompt,
    responseMode: "text",
  });

  const message = sanitizeMessage(rawText);

  if (!message) {
    throw new Error("Follow-up message was empty");
  }

  return {
    message,
    provider,
  };
}

export async function generateFollowUpMessage(
  input: FollowUpInput,
): Promise<FollowUpResult> {
  const selectedProvider = getSelectedAIProvider();

  if (selectedProvider === "mock") {
    return {
      message: buildFallbackFollowUpMessage(input),
      provider: "mock",
      fallbackUsed: false,
      errorCode: null,
      errorMessage: null,
    };
  }

  try {
    const result = await runProviderFollowUp(input);

    return {
      message: result.message,
      provider: result.provider,
      fallbackUsed: false,
      errorCode: null,
      errorMessage: null,
    };
  } catch (error) {
    const diagnostic = createProviderFallbackDiagnostic(selectedProvider, error);
    logProviderFallback("follow-up", diagnostic);

    return {
      message: buildFallbackFollowUpMessage(input),
      provider: "mock",
      fallbackUsed: true,
      errorCode: diagnostic.errorCode,
      errorMessage: diagnostic.errorMessage,
    };
  }
}
