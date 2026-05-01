import { z } from "zod";

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
  FollowUpToneLabel,
} from "@/lib/ai/types";
import { followUpToneLabelSchema } from "@/lib/ai/types";

const followUpResponseSchema = z.object({
  message: z.string().min(1),
  toneLabel: followUpToneLabelSchema,
  reason: z.string().min(1),
});

type DueTiming = "future" | "today" | "soon" | "past" | "unknown";

const followUpSystemPrompt = `You are Wasil AI, a Saudi Arabic financial assistant for freelancers.
Write Arabic payment follow-up messages that sound like a real Saudi freelancer writing to a client on WhatsApp.
The tone must be:
- natural
- polite
- clear
- professional
- warm but not too casual
- Saudi white dialect, not heavy formal Arabic
- never robotic
- never exaggerated in politeness
- never legal or corporate in tone
- no emojis

Use phrases naturally when suitable:
- هلا
- يعطيك العافية
- حبيت أذكّرك
- بخصوص
- إذا تم التحويل بلغني الله يعافيك
- عشان أحدّث حالة الفاتورة
- شاكر لك تعاونك

Avoid phrases like:
- نرجو منكم التكرم
- نفيدكم علمًا
- يرجى العلم
- أهلاً وسهلاً بفريق
- نتمنى أن تكونوا بخير when it sounds stiff
- long corporate paragraphs

Return valid JSON only.`;

function normalizeArabicDigits(value: string) {
  return value.replace(/[٠-٩]/g, (digit) =>
    String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)),
  );
}

function parseDueDate(dueDate: string | null) {
  if (!dueDate) {
    return null;
  }

  const normalized = normalizeArabicDigits(dueDate).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    const parsed = new Date(`${normalized}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDueTiming(dueDate: string | null): DueTiming {
  const parsed = parseDueDate(dueDate);

  if (!parsed) {
    return "unknown";
  }

  const today = startOfDay(new Date());
  const due = startOfDay(parsed);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) {
    return "past";
  }

  if (diffDays === 0) {
    return "today";
  }

  if (diffDays <= 3) {
    return "soon";
  }

  return "future";
}

function isFriendlyTone(agreementTone: string | null) {
  if (!agreementTone) {
    return false;
  }

  return /(ودي|لطيف|إيجابي|مرن|مريح|أهلًا|اهلا|متفقين|تمام|ودي)/.test(
    agreementTone,
  );
}

function isFormalTone(agreementTone: string | null) {
  if (!agreementTone) {
    return false;
  }

  return /(رسمي|شركة|مؤسسي|عملي|منظم|مهني|واضح)/.test(agreementTone);
}

function formatAmount(
  remainingAmount: number | null,
  currency: string | null,
) {
  if (remainingAmount === null) {
    return null;
  }

  return `${remainingAmount.toLocaleString("en-US")} ${currency ?? "ريال"}`;
}

function normalizeMessage(text: string) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/^["'`\s]+|["'`\s]+$/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractJsonPayload(rawText: string) {
  const text = rawText.trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in follow-up response");
  }

  return text.slice(start, end + 1);
}

function getToneDecision(input: FollowUpInput): {
  toneLabel: FollowUpToneLabel;
  reason: string;
} {
  const dueTiming = getDueTiming(input.dueDate);
  const isPartial = input.paymentStatus === "مدفوعة جزئيًا";
  const friendlyTone = isFriendlyTone(input.agreementTone);
  const formalTone = isFormalTone(input.agreementTone);
  const directStyle =
    input.clientUrgency === "عالية" ||
    Boolean(input.followUpStyle?.includes("مباش")) ||
    dueTiming === "today" ||
    dueTiming === "soon";

  if (dueTiming === "past") {
    return {
      toneLabel: "متابعة بعد تأخير",
      reason: isPartial
        ? "لأن جزءًا من الفاتورة مدفوع، لكن المتبقي تجاوز موعد الاستحقاق، فالأفضل متابعة محترمة وواضحة تركز على المتبقي."
        : "لأن موعد الاستحقاق تجاوز، فالأفضل متابعة أوضح من التذكير اللطيف مع بقاء الأسلوب مهنيًا ومحترمًا.",
    };
  }

  if (directStyle) {
    return {
      toneLabel: "متابعة مباشرة",
      reason: dueTiming === "today" || dueTiming === "soon"
        ? "لأن موعد الاستحقاق قريب أو اليوم، فالأفضل رسالة واضحة ومختصرة تذكر بالمبلغ المطلوب بدون مبالغة."
        : "لأن السياق يوحي بحاجة إلى متابعة أسرع، فالأفضل صياغة مباشرة ومحترمة تناسب واتساب.",
    };
  }

  if (dueTiming === "future") {
    return {
      toneLabel: "تذكير لطيف",
      reason: isPartial
        ? "لأن العميل سدد جزءًا من المبلغ وموعد الاستحقاق ما زال قائمًا، فالأفضل تذكير لطيف يوضح المتبقي فقط."
        : "لأن موعد الاستحقاق ما زال لاحقًا، فالأفضل رسالة خفيفة وودية تذكر بالاتفاق بدون ضغط زائد.",
    };
  }

  return {
    toneLabel: "نبرة مهنية وواضحة",
    reason: formalTone
      ? "لأن نبرة الاتفاق أقرب للرسمي والعملي، فالأفضل رسالة مرتبة وواضحة بنبرة مهنية طبيعية."
      : friendlyTone
        ? "لأن نبرة الاتفاق ودية نسبيًا، فالأفضل أسلوب مهني خفيف ودافئ يحافظ على العلاقة."
        : "لأن المعطيات المتاحة لا تستدعي شدة أو ليونة زائدة، فالأفضل نبرة مهنية واضحة ومريحة للعميل.",
  };
}

function buildFollowUpUserPrompt(input: FollowUpInput) {
  const dueTiming = getDueTiming(input.dueDate);
  const toneDecision = getToneDecision(input);

  return `اكتب رسالة متابعة دفع للعميل بالعربية اعتمادًا على البيانات التالية:

clientName: ${input.clientName ?? "null"}
service: ${input.service ?? "null"}
remainingAmount: ${input.remainingAmount ?? "null"}
currency: ${input.currency ?? "null"}
dueDate: ${input.dueDate ?? "null"}
paymentStatus: ${input.paymentStatus ?? "null"}
agreementTone: ${input.agreementTone ?? "null"}
clientUrgency: ${input.clientUrgency ?? "null"}
followUpStyle: ${input.followUpStyle ?? "null"}
dueTimingAnalysis: ${dueTiming}
preferredToneLabel: ${toneDecision.toneLabel}
preferredReason: ${toneDecision.reason}

منطق القرار:
- إذا كانت الفاتورة مدفوعة جزئيًا، اعترف بذلك بوضوح وركز فقط على المبلغ المتبقي.
- إذا كان موعد الاستحقاق في المستقبل، استخدم تذكيرًا لطيفًا.
- إذا كان موعد الاستحقاق اليوم أو خلال أيام قليلة، استخدم متابعة واضحة ومهنية.
- إذا كان موعد الاستحقاق قد مضى، استخدم متابعة أكثر مباشرة لكن باحترام.
- إذا كانت نبرة الاتفاق ودية، استخدم أسلوبًا أدفأ.
- إذا كانت نبرة الاتفاق رسمية أو مؤسسية، استخدم أسلوبًا مهنيًا أنيقًا بدون مبالغة.

قواعد الكتابة:
- اجعل الرسالة وكأنها من مستقل سعودي يرسلها على واتساب بنفسه.
- الرسالة مناسبة لنسخها مباشرة إلى واتساب.
- اجعلها من 3 إلى 5 فقرات قصيرة كحد أقصى.
- الفقرات قصيرة وواضحة، وتجنب الفقرة الطويلة.
- اذكر الحقائق المعروفة فقط.
- لا تخترع اسمًا أو مبلغًا أو تاريخًا أو حالة غير موجودة.
- لا تذكر الذكاء الاصطناعي.
- لا تبدو الرسالة كإشعار قانوني.
- لا تبالغ في الاعتذار.
- لا تستخدم إيموجي.
- اذكر الخدمة إذا كانت موجودة.
- اذكر المبلغ المتبقي إذا كان موجودًا.
- اذكر موعد الاستحقاق إذا كان موجودًا.
- تجنب تمامًا عبارات مثل:
  "نرجو منكم التكرم"
  "يرجى العلم بأنه"
  "نفيدكم علمًا"
  "أهلاً وسهلاً بفريق شركة..."
  "نتمنى أن تكونوا بخير" إذا بدت متكلفة
- اكتب باللهجة السعودية البيضاء الخفيفة، وليس بالفصحى الرسمية الثقيلة. استخدم عبارات طبيعية مثل: يعطيك العافية، حبيت أذكّرك، بخصوص، بلغني الله يعافيك، عشان أحدّث حالة الفاتورة. لا تستخدم عامية قوية أو كلمات محلية مبالغ فيها.
- لا تذكر أي معلومة ناقصة.
- إذا كانت الرسالة بعد تأخير، كن أوضح لكن حافظ على الاحترام.
- إذا كانت الرسالة قبل الموعد أو في وقت مبكر، خفف النبرة واجعلها ألطف.

أعد JSON فقط بالشكل التالي:
{
  "message": "string",
  "toneLabel": "تذكير لطيف" | "نبرة مهنية وواضحة" | "متابعة مباشرة" | "متابعة بعد تأخير",
  "reason": "سبب قصير يشرح اختيار النبرة"
}`;
}

function buildFallbackMessageBody(
  input: FollowUpInput,
  toneLabel: FollowUpToneLabel,
) {
  const client = input.clientName ? `هلا ${input.clientName}` : "هلا";
  const amount = formatAmount(input.remainingAmount, input.currency) ?? "المبلغ المتبقي";
  const service = input.service ? ` بخصوص ${input.service}` : "";
  const dueDate = input.dueDate ? `، وموعد الاستحقاق ${input.dueDate}` : "";
  const isPartial = input.paymentStatus === "مدفوعة جزئيًا";

  const opening =
    toneLabel === "متابعة بعد تأخير"
      ? `${client}، يعطيك العافية.`
      : `${client}، يعطيك العافية.`;

  const reminder =
    toneLabel === "تذكير لطيف"
      ? `${isPartial ? "حبيت أذكّرك" : "حبيت أذكّرك"}${service}، والمتبقي ${amount}${dueDate}.`
      : toneLabel === "متابعة مباشرة"
        ? `${isPartial ? "حبيت أتابع معك بخصوص المتبقي" : "حبيت أتابع معك بخصوص الفاتورة"}${service}، والمبلغ المطلوب ${amount}${dueDate}.`
        : toneLabel === "متابعة بعد تأخير"
          ? `${isPartial ? "أبغى أتابع معك بخصوص المتبقي من الفاتورة" : "أبغى أتابع معك بخصوص الفاتورة"}${service}، والمبلغ المتبقي ${amount}${dueDate}.`
          : `${isPartial ? "حبيت أذكّرك بخصوص المتبقي من الفاتورة" : "حبيت أذكّرك بخصوص الفاتورة"}${service}، والمبلغ المتبقي ${amount}${dueDate}.`;

  const partialAcknowledgement = isPartial
    ? "شاكر لك الدفعة السابقة، وباقي فقط المتبقي حتى أقفل الفاتورة."
    : null;

  const close =
    toneLabel === "متابعة بعد تأخير"
      ? "إذا تم التحويل بلغني الله يعافيك عشان أحدّث حالة الفاتورة. أكون شاكر لك لو تعطيني تحديث."
      : "إذا تم التحويل بلغني الله يعافيك عشان أحدّث حالة الفاتورة.";

  return [opening, partialAcknowledgement, reminder, close, "شاكر لك تعاونك."]
    .filter(Boolean)
    .join("\n\n");
}

function buildFallbackFollowUpResult(input: FollowUpInput): Pick<
  FollowUpResult,
  "message" | "toneLabel" | "reason"
> {
  const toneDecision = getToneDecision(input);

  return {
    message: buildFallbackMessageBody(input, toneDecision.toneLabel),
    toneLabel: toneDecision.toneLabel,
    reason: toneDecision.reason,
  };
}

function parseProviderResponse(rawText: string, input: FollowUpInput) {
  try {
    const jsonPayload = extractJsonPayload(rawText);
    const parsed = JSON.parse(jsonPayload) as unknown;
    const validated = followUpResponseSchema.parse(parsed);

    return {
      message: normalizeMessage(validated.message),
      toneLabel: validated.toneLabel,
      reason: normalizeMessage(validated.reason),
    };
  } catch {
    const message = normalizeMessage(rawText);

    if (!message) {
      throw new Error("Follow-up message was empty");
    }

    const toneDecision = getToneDecision(input);

    return {
      message,
      toneLabel: toneDecision.toneLabel,
      reason: toneDecision.reason,
    };
  }
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
    responseMode: "json",
  });

  const parsed = parseProviderResponse(rawText, input);

  if (!parsed.message) {
    throw new Error("Follow-up message was empty");
  }

  return {
    ...parsed,
    provider,
  };
}

export async function generateFollowUpMessage(
  input: FollowUpInput,
): Promise<FollowUpResult> {
  const selectedProvider = getSelectedAIProvider();

  if (selectedProvider === "mock") {
    const fallback = buildFallbackFollowUpResult(input);

    return {
      ...fallback,
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
      toneLabel: result.toneLabel,
      reason: result.reason,
      provider: result.provider,
      fallbackUsed: false,
      errorCode: null,
      errorMessage: null,
    };
  } catch (error) {
    const diagnostic = createProviderFallbackDiagnostic(selectedProvider, error);
    logProviderFallback("follow-up", diagnostic);
    const fallback = buildFallbackFollowUpResult(input);

    return {
      ...fallback,
      provider: "mock",
      fallbackUsed: true,
      errorCode: diagnostic.errorCode,
      errorMessage: diagnostic.errorMessage,
    };
  }
}
