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
  invoices: "wasil:invoices",
  latestInvoiceKey: "wasil:latest-invoice-key",
  invoiceViewed: "wasil:invoice-viewed",
  invoiceExpenses: "wasil:invoice-expenses",
  latestViewedInvoiceEvent: "wasil:latest-viewed-invoice-event",
} as const;

export const VIEWED_INVOICE_STATUS = "تمت المشاهدة" as const;
export const UNVIEWED_INVOICE_STATUS = "لم يشاهد بعد" as const;

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
  createdAt?: number;
  updatedAt?: number;
  isConfirmed?: boolean;
};

export const defaultTemporaryInvoiceData: TemporaryInvoiceData = {
  ...demoInvoice,
};

export type TemporaryExtractionData = ExtractionResult;

function getInvoiceStorageKey(invoice: Partial<TemporaryInvoiceData>) {
  return invoice.id ?? invoice.token ?? invoice.invoiceNumber ?? "demo";
}

function generateLocalIdentifier(prefix: "invoice" | "token") {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 10)
      : `${Date.now()}`;

  return `${prefix}-${randomPart}`;
}

function generateLocalInvoiceNumber() {
  return `WA-L${Date.now().toString().slice(-6)}`;
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

function normalizeInvoice(
  invoice: TemporaryInvoiceData,
): TemporaryInvoiceData {
  const createdAt = invoice.createdAt ?? Date.now();
  const updatedAt = invoice.updatedAt ?? createdAt;

  return {
    ...invoice,
    createdAt,
    updatedAt,
    isConfirmed: invoice.isConfirmed ?? Boolean(invoice.id || invoice.token),
  };
}

function sortInvoicesByCreatedAt(
  invoices: TemporaryInvoiceData[],
) {
  return [...invoices].sort(
    (left, right) => (right.createdAt ?? 0) - (left.createdAt ?? 0),
  );
}

function getLatestStoredInvoiceKey() {
  return readStorageValue<string>(STORAGE_KEYS.latestInvoiceKey);
}

function writeLatestStoredInvoiceKey(key: string) {
  writeStorageValue(STORAGE_KEYS.latestInvoiceKey, key);
}

function mergeStoredInvoices(
  invoices: TemporaryInvoiceData[],
  invoice: TemporaryInvoiceData,
) {
  const normalizedInvoice = normalizeInvoice(invoice);
  const invoiceKey = getInvoiceStorageKey(normalizedInvoice);
  const nextInvoices = invoices.filter(
    (currentInvoice) => getInvoiceStorageKey(currentInvoice) !== invoiceKey,
  );

  nextInvoices.push(normalizedInvoice);
  return sortInvoicesByCreatedAt(nextInvoices);
}

function persistStoredInvoices(
  invoices: TemporaryInvoiceData[],
  latestInvoiceKey?: string | null,
) {
  const normalizedInvoices = sortInvoicesByCreatedAt(
    invoices.map(normalizeInvoice),
  );

  writeStorageValue(STORAGE_KEYS.invoices, normalizedInvoices);

  const nextLatestKey =
    latestInvoiceKey ??
    getLatestStoredInvoiceKey() ??
    (normalizedInvoices[0]
      ? getInvoiceStorageKey(normalizedInvoices[0])
      : null);

  if (nextLatestKey) {
    writeLatestStoredInvoiceKey(nextLatestKey);
    const latestInvoice =
      normalizedInvoices.find(
        (invoice) => getInvoiceStorageKey(invoice) === nextLatestKey,
      ) ?? normalizedInvoices[0];

    if (latestInvoice) {
      writeStorageValue(STORAGE_KEYS.invoice, latestInvoice);
      writeStorageValue(
        STORAGE_KEYS.invoiceViewed,
        (latestInvoice.viewCount ?? 0) > 0,
      );
    }
  }
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

export function getStoredInvoices() {
  const storedInvoices =
    readStorageValue<TemporaryInvoiceData[]>(STORAGE_KEYS.invoices) ?? [];
  const legacyInvoice = readStorageValue<TemporaryInvoiceData>(STORAGE_KEYS.invoice);

  const mergedInvoices = legacyInvoice
    ? mergeStoredInvoices(storedInvoices, legacyInvoice)
    : sortInvoicesByCreatedAt(storedInvoices.map(normalizeInvoice));

  return mergedInvoices;
}

export function getStoredConfirmedInvoices() {
  return getStoredInvoices().filter((invoice) => invoice.isConfirmed);
}

export function getStoredInvoice(): TemporaryInvoiceData | null {
  const storedInvoices = getStoredInvoices();

  if (storedInvoices.length === 0) {
    return readStorageValue<TemporaryInvoiceData>(STORAGE_KEYS.invoice);
  }

  const latestKey = getLatestStoredInvoiceKey();

  if (!latestKey) {
    return storedInvoices[0];
  }

  return (
    storedInvoices.find(
      (invoice) => getInvoiceStorageKey(invoice) === latestKey,
    ) ?? storedInvoices[0]
  );
}

export function upsertStoredInvoice(
  value: TemporaryInvoiceData,
  options?: { setLatest?: boolean },
) {
  const normalizedInvoice = normalizeInvoice(value);
  const storedInvoices = getStoredInvoices();
  const nextInvoices = mergeStoredInvoices(storedInvoices, normalizedInvoice);
  const latestKey = options?.setLatest === false
    ? null
    : getInvoiceStorageKey(normalizedInvoice);

  persistStoredInvoices(nextInvoices, latestKey);
}

export function setStoredInvoice(value: TemporaryInvoiceData) {
  upsertStoredInvoice(value, { setLatest: true });
}

export function getStoredInvoiceById(invoiceId: string) {
  return getStoredInvoices().find((invoice) => invoice.id === invoiceId) ?? null;
}

export function getStoredInvoiceByToken(token: string) {
  return getStoredInvoices().find((invoice) => invoice.token === token) ?? null;
}

export function setLatestStoredInvoice(
  invoice: Partial<TemporaryInvoiceData>,
) {
  const invoiceKey = getInvoiceStorageKey(invoice);
  writeLatestStoredInvoiceKey(invoiceKey);

  const storedInvoice = getStoredInvoices().find(
    (currentInvoice) => getInvoiceStorageKey(currentInvoice) === invoiceKey,
  );

  if (storedInvoice) {
    writeStorageValue(STORAGE_KEYS.invoice, storedInvoice);
    writeStorageValue(
      STORAGE_KEYS.invoiceViewed,
      (storedInvoice.viewCount ?? 0) > 0,
    );
  }
}

export function createLocalConfirmedInvoice(
  invoice: TemporaryInvoiceData,
) {
  const now = Date.now();

  return normalizeInvoice({
    ...invoice,
    id: invoice.id ?? generateLocalIdentifier("invoice"),
    token: invoice.token ?? generateLocalIdentifier("token"),
    invoiceNumber:
      invoice.invoiceNumber && !["WA-001", "WA-DEMO"].includes(invoice.invoiceNumber)
        ? invoice.invoiceNumber
        : generateLocalInvoiceNumber(),
    invoiceViewStatus: invoice.invoiceViewStatus ?? UNVIEWED_INVOICE_STATUS,
    viewCount: invoice.viewCount ?? 0,
    firstViewedAt: invoice.firstViewedAt ?? null,
    lastViewedAt: invoice.lastViewedAt ?? null,
    createdAt: invoice.createdAt ?? now,
    updatedAt: now,
    isConfirmed: true,
  });
}

export function markStoredInvoiceViewed(token: string) {
  const storedInvoice = getStoredInvoiceByToken(token);

  if (!storedInvoice) {
    return null;
  }

  const now = Date.now();
  const nextInvoice = normalizeInvoice({
    ...storedInvoice,
    viewCount: (storedInvoice.viewCount ?? 0) + 1,
    firstViewedAt: storedInvoice.firstViewedAt ?? now,
    lastViewedAt: now,
    invoiceViewStatus: VIEWED_INVOICE_STATUS,
    updatedAt: now,
  });

  upsertStoredInvoice(nextInvoice, { setLatest: false });

  return nextInvoice;
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
  const storedInvoice = getStoredInvoice();

  if (storedInvoice) {
    return (storedInvoice.viewCount ?? 0) > 0;
  }

  return readStorageValue<boolean>(STORAGE_KEYS.invoiceViewed) ?? false;
}

export function setInvoiceViewed(
  value: boolean,
  invoice?: Partial<TemporaryInvoiceData>,
) {
  writeStorageValue(STORAGE_KEYS.invoiceViewed, value);

  const targetInvoice = invoice
    ? getStoredInvoices().find(
        (currentInvoice) =>
          getInvoiceStorageKey(currentInvoice) === getInvoiceStorageKey(invoice),
      )
    : getStoredInvoice();

  if (!targetInvoice) {
    return;
  }

  const now = Date.now();

  setStoredInvoice({
    ...targetInvoice,
    invoiceViewStatus: value
      ? VIEWED_INVOICE_STATUS
      : UNVIEWED_INVOICE_STATUS,
    viewCount: value
      ? Math.max(targetInvoice.viewCount ?? 0, 1)
      : targetInvoice.viewCount ?? 0,
    firstViewedAt: value
      ? (targetInvoice.firstViewedAt ?? now)
      : targetInvoice.firstViewedAt ?? null,
    lastViewedAt: value ? now : targetInvoice.lastViewedAt ?? null,
    updatedAt: now,
  });
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
    invoiceViewStatus: UNVIEWED_INVOICE_STATUS,
    viewCount: 0,
    firstViewedAt: null,
    lastViewedAt: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isConfirmed: false,
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

export function getInvoiceViewStatus(viewCount = 0) {
  return viewCount > 0 ? VIEWED_INVOICE_STATUS : UNVIEWED_INVOICE_STATUS;
}

export function isLocalInvoiceId(invoiceId?: string | null) {
  return !invoiceId || invoiceId === "demo" || invoiceId.startsWith("invoice-");
}

export function isLocalInvoiceToken(token?: string | null) {
  return !token || token === "demo-token" || token.startsWith("token-");
}

export function broadcastInvoiceViewed(token: string) {
  if (!isBrowser()) {
    return;
  }

  writeStorageValue(STORAGE_KEYS.latestViewedInvoiceEvent, {
    token,
    viewedAt: Date.now(),
  });
}

export function getInvoiceViewedBroadcastKey() {
  return STORAGE_KEYS.latestViewedInvoiceEvent;
}

export function buildFollowUpMessage(invoice: TemporaryInvoiceData) {
  return `هلا ${invoice.clientName}، يعطيكم العافية.
حبيت أذكّركم بالمبلغ المتبقي ${invoice.amountRemaining.toLocaleString("en-US")} ${invoice.currencyShort} لمشروع ${invoice.serviceName}، حسب اتفاقنا يكون السداد بتاريخ ${invoice.dueDate}.
إذا تم التحويل، علّمني عشان أحدث حالة الفاتورة.
شكرًا لكم.`;
}
