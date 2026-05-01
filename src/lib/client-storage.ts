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
  invoiceExpenses: "wasil:invoice-expenses",
} as const;

export const expenseCategories = [
  "أدوات",
  "اشتراك",
  "صور أو ملفات",
  "إنترنت",
  "مواصلات",
  "تعهيد",
  "أخرى",
] as const;

export type TemporaryExpenseCategory = (typeof expenseCategories)[number];

export type TemporaryExpenseData = {
  id: string;
  invoiceId?: string;
  workspaceId?: string;
  amount: number;
  currency: string;
  category: TemporaryExpenseCategory;
  note: string | null;
  createdAt: number;
};

export type TemporaryFinancialSummary = {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  totalExpenses: number;
  expectedProfit: number;
  currency: string;
};

export type TemporaryInvoiceData = {
  id?: string;
  workspaceId?: string;
  token?: string;
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
  viewCount?: number;
  firstViewedAt?: number | null;
  lastViewedAt?: number | null;
};

export const defaultTemporaryInvoiceData: TemporaryInvoiceData = {
  ...demoInvoice,
};

export type TemporaryExtractionData = ExtractionResult;

function getInvoiceStorageKey(invoice: Partial<TemporaryInvoiceData>) {
  return invoice.id ?? invoice.token ?? invoice.invoiceNumber ?? "demo";
}

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

function getStoredExpensesMap() {
  return readStorageValue<Record<string, TemporaryExpenseData[]>>(
    STORAGE_KEYS.invoiceExpenses,
  ) ?? {};
}

export function getStoredExpenses(invoice: Partial<TemporaryInvoiceData>) {
  const key = getInvoiceStorageKey(invoice);
  return getStoredExpensesMap()[key] ?? [];
}

export function setStoredExpenses(
  invoice: Partial<TemporaryInvoiceData>,
  expenses: TemporaryExpenseData[],
) {
  const key = getInvoiceStorageKey(invoice);
  const storedExpensesMap = getStoredExpensesMap();

  storedExpensesMap[key] = expenses;
  writeStorageValue(STORAGE_KEYS.invoiceExpenses, storedExpensesMap);
}

export function addStoredExpense(
  invoice: Partial<TemporaryInvoiceData>,
  value: Omit<TemporaryExpenseData, "id" | "createdAt"> & {
    id?: string;
    createdAt?: number;
  },
) {
  const expense: TemporaryExpenseData = {
    ...value,
    id:
      value.id ??
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}`),
    createdAt: value.createdAt ?? Date.now(),
  };
  const expenses = [expense, ...getStoredExpenses(invoice)].sort(
    (left, right) => right.createdAt - left.createdAt,
  );

  setStoredExpenses(invoice, expenses);
  return expense;
}

export function calculateFinancialSummary(
  invoice: Pick<
    TemporaryInvoiceData,
    "projectValue" | "amountPaid" | "amountRemaining" | "currencyShort"
  >,
  expenses: Array<Pick<TemporaryExpenseData, "amount">>,
): TemporaryFinancialSummary {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const remainingAmount =
    typeof invoice.amountRemaining === "number"
      ? invoice.amountRemaining
      : invoice.projectValue - invoice.amountPaid;

  return {
    totalAmount: invoice.projectValue,
    paidAmount: invoice.amountPaid,
    remainingAmount,
    totalExpenses,
    expectedProfit: invoice.projectValue - totalExpenses,
    currency: invoice.currencyShort,
  };
}

export function getStoredFinancialSummary(
  invoice: Pick<
    TemporaryInvoiceData,
    | "id"
    | "token"
    | "invoiceNumber"
    | "projectValue"
    | "amountPaid"
    | "amountRemaining"
    | "projectExpenses"
    | "expectedProfit"
    | "currencyShort"
  >,
) {
  const expenses = getStoredExpenses(invoice);

  if (expenses.length === 0 && invoice.projectExpenses > 0) {
    return {
      totalAmount: invoice.projectValue,
      paidAmount: invoice.amountPaid,
      remainingAmount: invoice.amountRemaining,
      totalExpenses: invoice.projectExpenses,
      expectedProfit: invoice.expectedProfit,
      currency: invoice.currencyShort,
    };
  }

  return calculateFinancialSummary(invoice, expenses);
}

export function applyFinancialSummaryToInvoice(
  invoice: TemporaryInvoiceData,
  summary: TemporaryFinancialSummary,
): TemporaryInvoiceData {
  return {
    ...invoice,
    projectValue: summary.totalAmount,
    amountPaid: summary.paidAmount,
    amountRemaining: summary.remainingAmount,
    projectExpenses: summary.totalExpenses,
    expectedProfit: summary.expectedProfit,
    currencyShort: summary.currency || invoice.currencyShort,
  };
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

export function buildPublicInvoiceUrl(token = "demo-token") {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/i/${token}`;
  }

  if (!isBrowser()) {
    return `/i/${token}`;
  }

  return `${window.location.origin}/i/${token}`;
}

export function buildFollowUpMessage(invoice: TemporaryInvoiceData) {
  return `هلا ${invoice.clientName}، يعطيكم العافية.
حبيت أذكّركم بالمبلغ المتبقي ${invoice.amountRemaining.toLocaleString("en-US")} ${invoice.currencyShort} لمشروع ${invoice.serviceName}، حسب اتفاقنا يكون السداد بتاريخ ${invoice.dueDate}.
إذا تم التحويل، علّمني عشان أحدث حالة الفاتورة.
شكرًا لكم.`;
}
