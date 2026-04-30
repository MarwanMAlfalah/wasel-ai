import {
  extractedAgreementSchema,
  type ExtractedAgreement,
} from "@/lib/ai/types";

const arabicMonthMap: Record<string, string> = {
  يناير: "01",
  فبراير: "02",
  مارس: "03",
  ابريل: "04",
  أبريل: "04",
  مايو: "05",
  يونيو: "06",
  يوليو: "07",
  أغسطس: "08",
  اغسطس: "08",
  سبتمبر: "09",
  أكتوبر: "10",
  اكتوبر: "10",
  نوفمبر: "11",
  ديسمبر: "12",
};

function normalizeDigits(value: string) {
  return value.replace(/[٠-٩]/g, (digit) =>
    String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)),
  );
}

function normalizeWhitespace(value: string) {
  return normalizeDigits(value).replace(/\s+/g, " ").trim();
}

function parseAmount(match: string | undefined | null) {
  if (!match) {
    return null;
  }

  const digits = normalizeDigits(match).replace(/[^\d.]/g, "");
  if (!digits) {
    return null;
  }

  const amount = Number(digits);
  return Number.isFinite(amount) ? amount : null;
}

function parseArabicDate(text: string | null) {
  if (!text) {
    return null;
  }

  const normalized = normalizeWhitespace(text);
  const match = normalized.match(/(\d{1,2})\s+([^\s]+)\s+(\d{4})/);

  if (!match) {
    return null;
  }

  const [, day, monthName, year] = match;
  const month = arabicMonthMap[monthName];

  if (!month) {
    return null;
  }

  return `${year}-${month}-${day.padStart(2, "0")}`;
}

function extractDate(conversation: string, pattern: RegExp) {
  const match = normalizeWhitespace(conversation).match(pattern);
  return parseArabicDate(match?.[1] ?? null);
}

function inferCurrency(conversation: string): ExtractedAgreement["currency"] {
  const normalized = normalizeWhitespace(conversation);

  if (/(ريال سعودي|ر\.س|ريال|sar)/i.test(normalized)) {
    return "SAR";
  }

  if (/(usd|دولار)/i.test(normalized)) {
    return "USD";
  }

  if (/(aed|درهم)/i.test(normalized)) {
    return "AED";
  }

  if (/(yer|يمني|ريال يمني)/i.test(normalized)) {
    return "YER";
  }

  return "UNKNOWN";
}

function inferClientName(conversation: string) {
  const companyMatch = conversation.match(/(شركة\s+[^\n،,.]+)/);
  if (companyMatch?.[1]) {
    return companyMatch[1].trim();
  }

  const greetingMatch = normalizeWhitespace(conversation).match(
    /(?:العميل[:：]\s*)?([أ-يA-Za-z0-9\s]{2,30})[,،]?\s*(?:نحتاج|نبغى|حابين)/,
  );

  return greetingMatch?.[1]?.trim() ?? null;
}

function inferFreelancerName(conversation: string) {
  const speakerMatch = conversation.match(/^([^\n:]{2,30}):/m);
  if (speakerMatch?.[1] && !speakerMatch[1].includes("العميل")) {
    return speakerMatch[1].trim();
  }

  const greetingMatch = normalizeWhitespace(conversation).match(
    /(هلا|أهلًا|اهلا)\s+([^\s،,.]+)/,
  );

  return greetingMatch?.[2]?.trim() ?? null;
}

function inferService(conversation: string) {
  const normalized = normalizeWhitespace(conversation);
  const needMatch = normalized.match(
    /(?:نحتاج|نبغى|حابين|المشروع)\s+(.+?)(?:\.|،| بقيمة| قيمة المشروع| والبدء| والموعد|$)/,
  );

  return needMatch?.[1]?.trim() ?? null;
}

function collectMissingFields(data: Omit<ExtractedAgreement, "missingFields">) {
  const labels: string[] = [];

  const labelMap: Array<[keyof Omit<ExtractedAgreement, "missingFields">, string]> = [
    ["clientName", "اسم العميل"],
    ["freelancerName", "اسم المستقل"],
    ["service", "الخدمة"],
    ["totalAmount", "قيمة المشروع"],
    ["paidAmount", "المبلغ المدفوع"],
    ["remainingAmount", "المبلغ المتبقي"],
    ["deliveryDate", "موعد التسليم"],
    ["dueDate", "موعد استحقاق الدفع"],
  ];

  for (const [key, label] of labelMap) {
    if (data[key] === null) {
      labels.push(label);
    }
  }

  if (data.currency === "UNKNOWN") {
    labels.push("العملة");
  }

  if (data.paymentStatus === "غير محددة") {
    labels.push("حالة الدفع");
  }

  return labels;
}

export async function extractWithMock(
  conversationText: string,
): Promise<ExtractedAgreement> {
  const normalized = normalizeWhitespace(conversationText);

  const totalAmount =
    parseAmount(
      normalized.match(
        /(?:قيمة المشروع|المشروع|السعر|التكلفة)\s*(?:هو|:)?\s*([\d,]+)/,
      )?.[1],
    ) ??
    parseAmount(
      normalized.match(/([\d,]+)\s*(?:ريال|ر\.س|sar|دولار|درهم)/i)?.[1],
    );

  const paidAmount =
    parseAmount(
      normalized.match(
        /(?:نحول|تم التحويل|دفعنا|دفعة أولى|عربون)\s*([\d,]+)/,
      )?.[1],
    ) ?? null;

  const explicitRemaining = parseAmount(
    normalized.match(/(?:الباقي|المتبقي)\s*([\d,]+)/)?.[1],
  );

  const remainingAmount =
    explicitRemaining ??
    (totalAmount !== null && paidAmount !== null
      ? Math.max(totalAmount - paidAmount, 0)
      : null);

  const deliveryDate = extractDate(
    conversationText,
    /موعد التسليم(?:[^0-9٠-٩]+)(\d{1,2}\s+[^\s]+\s+\d{4})/,
  );
  const dueDate = extractDate(
    conversationText,
    /(?:موعد استحقاق(?: الدفعة الأخيرة)?|السداد بتاريخ|موعد الدفع)(?:[^0-9٠-٩]+)(\d{1,2}\s+[^\s]+\s+\d{4})/,
  );

  let paymentStatus: ExtractedAgreement["paymentStatus"] = "غير محددة";

  if (totalAmount !== null && remainingAmount === 0) {
    paymentStatus = "مدفوعة";
  } else if ((paidAmount ?? 0) > 0 && (remainingAmount ?? 0) > 0) {
    paymentStatus = "مدفوعة جزئيًا";
  } else if ((paidAmount ?? 0) === 0 && totalAmount !== null) {
    paymentStatus = "غير مدفوعة";
  }

  const urgency: ExtractedAgreement["clientUrgency"] =
    /(مستعجل|بأسرع وقت|اليوم|فورًا|فورا)/.test(normalized)
      ? "عالية"
      : /(هذا الأسبوع|قريب|ضروري)/.test(normalized)
        ? "متوسطة"
        : "منخفضة";

  const agreementTone = /(ممتاز|تمام|متفقين|أهلًا|اهلا)/.test(normalized)
    ? "التعاون مهني وإيجابي، والحديث واضح بين الطرفين."
    : "نبرة الاتفاق تبدو عملية ومباشرة.";

  const followUpStyle =
    urgency === "عالية"
      ? "رسالة مباشرة ومهذبة مع تذكير واضح بموعد السداد"
      : "رسالة لطيفة ومهنية مع توضيح المبلغ المتبقي";

  const smartInsight =
    remainingAmount !== null && totalAmount !== null && remainingAmount >= totalAmount / 2
      ? "المبلغ المتبقي يشكل جزءًا كبيرًا من قيمة المشروع، والأفضل التذكير قبل موعد الاستحقاق."
      : "يظهر من المحادثة أن الاتفاق واضح، لذلك يكفي تذكير قصير ومهني عند الحاجة.";

  const partialData = {
    clientName: inferClientName(conversationText),
    freelancerName: inferFreelancerName(conversationText),
    service: inferService(conversationText),
    totalAmount,
    currency: inferCurrency(conversationText),
    paidAmount,
    remainingAmount,
    deliveryDate,
    dueDate,
    paymentStatus,
    agreementTone,
    clientUrgency: urgency,
    followUpStyle,
    smartInsight,
    confidence: 0.63,
  } satisfies Omit<ExtractedAgreement, "missingFields">;

  const result = {
    ...partialData,
    missingFields: collectMissingFields(partialData),
  } satisfies ExtractedAgreement;

  return extractedAgreementSchema.parse(result);
}
