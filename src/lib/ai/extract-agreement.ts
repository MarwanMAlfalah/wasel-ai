import {
  createProviderFallbackDiagnostic,
  getProviderImplementation,
  getSelectedAIProvider,
  isProviderConfigured,
  logProviderFallback,
} from "@/lib/ai/provider";
import { extractWithMock } from "@/lib/ai/mock";
import {
  extractedAgreementSchema,
  type ExtractionResult,
  type ExtractedAgreement,
} from "@/lib/ai/types";

const systemPrompt = `You are “واصل AI”, an Arabic invoice extraction assistant for Arab freelancers.
You read Arabic client conversations and extract structured invoice and payment details.
You understand Saudi Arabic, Gulf Arabic, and formal Arabic.
You must return valid JSON only.`;

function buildUserPrompt(conversationText: string) {
  return `Extract invoice and agreement details from the following conversation:

"""
${conversationText}
"""

Return ONLY valid JSON with this exact schema:
{
  "clientName": string | null,
  "freelancerName": string | null,
  "service": string | null,
  "totalAmount": number | null,
  "currency": "SAR" | "USD" | "AED" | "YER" | "UNKNOWN",
  "paidAmount": number | null,
  "remainingAmount": number | null,
  "deliveryDate": string | null,
  "dueDate": string | null,
  "paymentStatus": "غير مدفوعة" | "مدفوعة جزئيًا" | "مدفوعة" | "متأخرة" | "غير محددة",
  "agreementTone": string,
  "clientUrgency": "منخفضة" | "متوسطة" | "عالية" | "غير محددة",
  "followUpStyle": string,
  "smartInsight": string,
  "missingFields": string[],
  "confidence": number
}

Rules:
- If currency is ريال سعودي, ريال, ر.س, or SAR, return "SAR".
- If the client is a company, extract the company name as clientName.
- If payment is split into first payment and remaining amount, set paymentStatus to "مدفوعة جزئيًا".
- Detect deliveryDate and dueDate separately.
- Dates should be returned in ISO format YYYY-MM-DD when possible.
- totalAmount, paidAmount, remainingAmount must be numbers without commas.
- If remainingAmount is not explicitly stated but can be calculated, calculate it.
- If a field is missing, set it to null and add its Arabic label to missingFields.
- agreementTone must describe the relationship tone in Arabic.
- clientUrgency must estimate urgency from the conversation.
- followUpStyle must recommend the best follow-up style in Arabic.
- smartInsight must be one short useful Arabic insight for the freelancer.
- confidence must be a number between 0 and 1.
- Do not include markdown.
- Do not include explanations outside JSON.`;
}

function extractJsonPayload(rawText: string) {
  const fenced = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = fenced.indexOf("{");
  const end = fenced.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in AI response");
  }

  return fenced.slice(start, end + 1);
}

function normalizeExtractedAgreement(data: ExtractedAgreement): ExtractedAgreement {
  const calculatedRemaining =
    data.remainingAmount ??
    (data.totalAmount !== null && data.paidAmount !== null
      ? Math.max(data.totalAmount - data.paidAmount, 0)
      : null);

  let paymentStatus = data.paymentStatus;

  if (paymentStatus === "غير محددة") {
    if (data.totalAmount !== null && calculatedRemaining === 0) {
      paymentStatus = "مدفوعة";
    } else if ((data.paidAmount ?? 0) > 0 && (calculatedRemaining ?? 0) > 0) {
      paymentStatus = "مدفوعة جزئيًا";
    } else if ((data.paidAmount ?? 0) === 0 && data.totalAmount !== null) {
      paymentStatus = "غير مدفوعة";
    }
  }

  const missingFields = new Set<string>(data.missingFields);

  const missingMap: Array<[keyof ExtractedAgreement, string]> = [
    ["clientName", "اسم العميل"],
    ["freelancerName", "اسم المستقل"],
    ["service", "الخدمة"],
    ["totalAmount", "قيمة المشروع"],
    ["paidAmount", "المبلغ المدفوع"],
    ["remainingAmount", "المبلغ المتبقي"],
    ["deliveryDate", "موعد التسليم"],
    ["dueDate", "موعد استحقاق الدفع"],
  ];

  for (const [key, label] of missingMap) {
    if (
      (key === "remainingAmount" ? calculatedRemaining : data[key]) === null
    ) {
      missingFields.add(label);
    }
  }

  if (data.currency === "UNKNOWN") {
    missingFields.add("العملة");
  }

  if (paymentStatus === "غير محددة") {
    missingFields.add("حالة الدفع");
  }

  return {
    ...data,
    remainingAmount: calculatedRemaining,
    paymentStatus,
    missingFields: [...missingFields],
  };
}

function parseProviderResponse(rawText: string) {
  const jsonPayload = extractJsonPayload(rawText);
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonPayload) as unknown;
  } catch {
    throw new Error("AI response did not contain valid JSON");
  }

  const validated = extractedAgreementSchema.safeParse(parsed);

  if (!validated.success) {
    throw new Error(validated.error.issues[0]?.message ?? "Invalid JSON schema");
  }

  return normalizeExtractedAgreement(validated.data);
}

async function runProviderAttempt(
  conversationText: string,
): Promise<{
  data: ExtractedAgreement;
  provider: Exclude<ExtractionResult["provider"], "mock">;
}> {
  const provider = getSelectedAIProvider();

  if (provider === "mock") {
    throw new Error("Mock provider does not use remote AI");
  }

  if (!isProviderConfigured(provider)) {
    throw new Error(`${provider} is not configured`);
  }

  const generate = getProviderImplementation(provider);
  const userPrompt = buildUserPrompt(conversationText);

  try {
    const rawText = await generate({
      systemPrompt,
      userPrompt,
      responseMode: "json",
    });

    return {
      data: parseProviderResponse(rawText),
      provider,
    };
  } catch {
    const retryPrompt = `${userPrompt}

The previous response was invalid or not parseable as valid JSON.
Return the same answer again as JSON only, matching the schema exactly, with no markdown and no extra text.`;

    const rawRetryText = await generate({
      systemPrompt,
      userPrompt: retryPrompt,
      responseMode: "json",
    });

    return {
      data: parseProviderResponse(rawRetryText),
      provider,
    };
  }
}

export async function extractAgreement(
  conversationText: string,
): Promise<ExtractionResult> {
  const selectedProvider = getSelectedAIProvider();

  if (selectedProvider === "mock") {
    return {
      data: await extractWithMock(conversationText),
      provider: "mock",
      fallbackUsed: false,
      errorCode: null,
      errorMessage: null,
    };
  }

  try {
    const result = await runProviderAttempt(conversationText);

    return {
      data: result.data,
      provider: result.provider,
      fallbackUsed: false,
      errorCode: null,
      errorMessage: null,
    };
  } catch (error) {
    const diagnostic = createProviderFallbackDiagnostic(selectedProvider, error);
    logProviderFallback("extract", diagnostic);

    return {
      data: await extractWithMock(conversationText),
      provider: "mock",
      fallbackUsed: true,
      errorCode: diagnostic.errorCode,
      errorMessage: diagnostic.errorMessage,
    };
  }
}
