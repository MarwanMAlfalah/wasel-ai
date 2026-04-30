"use client";

import { demoInvoice } from "@/lib/demo-data";
import type { StatusBadgeValue } from "@/components/shared/status-badge";
import type {
  AIProviderName,
  ExtractedAgreement,
  ExtractionResult,
} from "@/lib/ai/types";

const STORAGE_KEYS = {
  conversation: "wasil:conversation",
  extraction: "wasil:extraction",
  invoice: "wasil:invoice",
  invoiceViewed: "wasil:invoice-viewed",
} as const;

export type TemporaryInvoiceData = {
  invoiceNumber: string;
  freelancerName: string;
  clientName: string;
  serviceName: string;
  projectValue: number;
  currencyLabel: string;
  currencyShort: string;
  amountPaid: number;
  amountRemaining: number;
  projectExpenses: number;
  expectedProfit: number;
  deliveryDate: string;
  dueDate: string;
  paymentStatus: StatusBadgeValue;
  invoiceViewStatus: StatusBadgeValue;
};

export const defaultTemporaryInvoiceData: TemporaryInvoiceData = {
  ...demoInvoice,
};

export type TemporaryExtractionData = ExtractionResult;

function isBrowser() {
  return typeof window !== "undefined";
}

function readStorageValue<T>(key: string): T | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function writeStorageValue<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredConversation() {
  return readStorageValue<string>(STORAGE_KEYS.conversation);
}

export function setStoredConversation(value: string) {
  writeStorageValue(STORAGE_KEYS.conversation, value);
}

export function getStoredExtraction(): TemporaryExtractionData | null {
  return readStorageValue<TemporaryExtractionData>(STORAGE_KEYS.extraction);
}

export function setStoredExtraction(value: TemporaryExtractionData) {
  writeStorageValue(STORAGE_KEYS.extraction, value);
}

export function getStoredInvoice(): TemporaryInvoiceData | null {
  return readStorageValue<TemporaryInvoiceData>(STORAGE_KEYS.invoice);
}

export function setStoredInvoice(value: TemporaryInvoiceData) {
  writeStorageValue(STORAGE_KEYS.invoice, value);
}

export function getInvoiceViewed() {
  return readStorageValue<boolean>(STORAGE_KEYS.invoiceViewed) ?? false;
}

export function setInvoiceViewed(value: boolean) {
  writeStorageValue(STORAGE_KEYS.invoiceViewed, value);
}

export function mapCurrencyToLabel(currency: ExtractedAgreement["currency"]) {
  switch (currency) {
    case "SAR":
      return { label: "ريال سعودي", short: "ريال" };
    case "USD":
      return { label: "دولار أمريكي", short: "دولار" };
    case "AED":
      return { label: "درهم إماراتي", short: "درهم" };
    case "YER":
      return { label: "ريال يمني", short: "ريال" };
    case "UNKNOWN":
      return { label: "غير محددة", short: "عملة" };
  }
}

export function extractionToTemporaryInvoice(
  extraction: ExtractedAgreement,
  provider: AIProviderName,
): TemporaryInvoiceData {
  const currency = mapCurrencyToLabel(extraction.currency);

  return {
    ...defaultTemporaryInvoiceData,
    invoiceNumber: provider === "mock" ? "WA-DEMO" : defaultTemporaryInvoiceData.invoiceNumber,
    clientName: extraction.clientName ?? defaultTemporaryInvoiceData.clientName,
    freelancerName:
      extraction.freelancerName ?? defaultTemporaryInvoiceData.freelancerName,
    serviceName: extraction.service ?? defaultTemporaryInvoiceData.serviceName,
    projectValue:
      extraction.totalAmount ?? defaultTemporaryInvoiceData.projectValue,
    currencyLabel: currency.label,
    currencyShort: currency.short,
    amountPaid: extraction.paidAmount ?? defaultTemporaryInvoiceData.amountPaid,
    amountRemaining:
      extraction.remainingAmount ?? defaultTemporaryInvoiceData.amountRemaining,
    deliveryDate:
      extraction.deliveryDate ?? defaultTemporaryInvoiceData.deliveryDate,
    dueDate: extraction.dueDate ?? defaultTemporaryInvoiceData.dueDate,
    paymentStatus:
      extraction.paymentStatus === "مدفوعة جزئيًا"
        ? "مدفوع جزئيًا"
        : extraction.paymentStatus,
    expectedProfit:
      (extraction.totalAmount ?? defaultTemporaryInvoiceData.projectValue) -
      defaultTemporaryInvoiceData.projectExpenses,
    invoiceViewStatus: "لم تُشاهد بعد",
  };
}

export function buildPublicInvoiceUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/i/demo-token`;
  }

  if (!isBrowser()) {
    return "/i/demo-token";
  }

  return `${window.location.origin}/i/demo-token`;
}

export function buildFollowUpMessage(invoice: TemporaryInvoiceData) {
  return `هلا ${invoice.clientName}، يعطيكم العافية.
حبيت أذكّركم بالمبلغ المتبقي ${invoice.amountRemaining.toLocaleString("en-US")} ${invoice.currencyShort} لمشروع ${invoice.serviceName}، حسب اتفاقنا يكون السداد بتاريخ ${invoice.dueDate}.
إذا تم التحويل، علّمني عشان أحدث حالة الفاتورة.
شكرًا لكم.`;
}
