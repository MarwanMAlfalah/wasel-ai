import { z } from "zod";

export const aiProviderSchema = z.enum([
  "openai",
  "gemini",
  "anthropic",
  "grok",
  "mock",
]);

export type AIProviderName = z.infer<typeof aiProviderSchema>;

export const extractedAgreementSchema = z.object({
  clientName: z.string().min(1).nullable(),
  freelancerName: z.string().min(1).nullable(),
  service: z.string().min(1).nullable(),
  totalAmount: z.number().finite().nullable(),
  currency: z.enum(["SAR", "USD", "AED", "YER", "UNKNOWN"]),
  paidAmount: z.number().finite().nullable(),
  remainingAmount: z.number().finite().nullable(),
  deliveryDate: z.string().min(1).nullable(),
  dueDate: z.string().min(1).nullable(),
  paymentStatus: z.enum([
    "غير مدفوعة",
    "مدفوعة جزئيًا",
    "مدفوعة",
    "متأخرة",
    "غير محددة",
  ]),
  agreementTone: z.string(),
  clientUrgency: z.enum(["منخفضة", "متوسطة", "عالية", "غير محددة"]),
  followUpStyle: z.string(),
  smartInsight: z.string(),
  missingFields: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

export type ExtractedAgreement = z.infer<typeof extractedAgreementSchema>;

export type ExtractionResult = {
  data: ExtractedAgreement;
  provider: AIProviderName;
  fallbackUsed: boolean;
  errorCode?: string | null;
  errorMessage?: string | null;
};

export type GenerateJsonParams = {
  systemPrompt: string;
  userPrompt: string;
  responseMode?: "json" | "text";
};

export type GenerateJsonHandler = (
  params: GenerateJsonParams,
) => Promise<string>;

export type FollowUpInput = {
  clientName: string | null;
  service: string | null;
  remainingAmount: number | null;
  currency: string | null;
  dueDate: string | null;
  paymentStatus: string | null;
  agreementTone: string | null;
  clientUrgency: string | null;
  followUpStyle: string | null;
};

export const followUpToneLabelSchema = z.enum([
  "تذكير لطيف",
  "نبرة مهنية وواضحة",
  "متابعة مباشرة",
  "متابعة بعد تأخير",
]);

export type FollowUpToneLabel = z.infer<typeof followUpToneLabelSchema>;

export type FollowUpResult = {
  message: string;
  toneLabel: FollowUpToneLabel;
  reason: string;
  provider: AIProviderName;
  fallbackUsed: boolean;
  errorCode?: string | null;
  errorMessage?: string | null;
};
