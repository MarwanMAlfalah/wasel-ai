"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CalendarClock,
  Copy,
  Download,
  ExternalLink,
  FileText,
  MessageSquareMore,
  ReceiptText,
  WalletCards,
} from "lucide-react";

import { AIInsightCard } from "@/components/shared/ai-insight-card";
import { ArabicNumber } from "@/components/shared/arabic-number";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { useToast } from "@/components/shared/toast-provider";
import { Button } from "@/components/ui/button";
import {
  applyFinancialSummaryToInvoice,
  addStoredExpense,
  buildPublicInvoiceUrl,
  defaultTemporaryInvoiceData,
  expenseCategories,
  getStoredExpenses,
  getStoredFinancialSummary,
  getStoredInvoice,
  setStoredExpenses,
  setStoredInvoice,
  type TemporaryExpenseCategory,
  type TemporaryExpenseData,
  type TemporaryFinancialSummary,
  type TemporaryInvoiceData,
} from "@/lib/client-storage";

type ExpenseFormState = {
  amount: string;
  currency: string;
  category: TemporaryExpenseCategory;
  note: string;
};

export default function InvoiceDetailPage() {
  const params = useParams<{ invoiceId: string }>();
  const [isHydrated, setIsHydrated] = useState(false);
  const [invoice, setInvoice] =
    useState<TemporaryInvoiceData>(defaultTemporaryInvoiceData);
  const [expenses, setExpenses] = useState<TemporaryExpenseData[]>([]);
  const [financialSummary, setFinancialSummary] =
    useState<TemporaryFinancialSummary | null>(null);
  const [usesLocalExpenseFallback, setUsesLocalExpenseFallback] = useState(false);
  const [isSavingExpense, setIsSavingExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState<ExpenseFormState>({
    amount: "",
    currency: defaultTemporaryInvoiceData.currencyShort,
    category: expenseCategories[0],
    note: "",
  });
  const { showToast } = useToast();
  const summary = financialSummary ?? getStoredFinancialSummary(invoice);
  const publicInvoiceUrl = isHydrated
    ? buildPublicInvoiceUrl(invoice.token ?? "demo-token")
    : `/i/${invoice.token ?? "demo-token"}`;
  const showFallbackNote =
    usesLocalExpenseFallback ||
    !process.env.NEXT_PUBLIC_CONVEX_URL ||
    params?.invoiceId === "demo";

  useEffect(() => {
    let isActive = true;

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      const storedInvoice = getStoredInvoice() ?? defaultTemporaryInvoiceData;

      setInvoice(storedInvoice);
      setExpenses(getStoredExpenses(storedInvoice));
      setFinancialSummary(getStoredFinancialSummary(storedInvoice));
      setUsesLocalExpenseFallback(!process.env.NEXT_PUBLIC_CONVEX_URL);
      setExpenseForm((current) => ({
        ...current,
        currency: storedInvoice.currencyShort,
      }));
      setIsHydrated(true);
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const invoiceId = params?.invoiceId;

    if (!process.env.NEXT_PUBLIC_CONVEX_URL || !invoiceId || invoiceId === "demo") {
      return;
    }

    let isActive = true;

    async function loadInvoice() {
      try {
        const [invoiceResponse, expensesResponse, summaryResponse] =
          await Promise.all([
            fetch(`/api/invoices/${invoiceId}`),
            fetch(`/api/invoices/${invoiceId}/expenses`),
            fetch(`/api/invoices/${invoiceId}/financial-summary`),
          ]);

        if (!invoiceResponse.ok || !expensesResponse.ok || !summaryResponse.ok) {
          throw new Error("Load invoice details request failed");
        }

        const invoiceResult = (await invoiceResponse.json()) as {
          invoice: {
            invoiceId: string;
            workspaceId: string;
            token: string;
            invoiceNumber: string;
            freelancerName: string;
            clientName: string;
            service: string;
            totalAmount: number;
            currency: string;
            paidAmount: number;
            remainingAmount: number;
            deliveryDate: string | null;
            dueDate: string | null;
            paymentStatus: string;
            agreementTone: string;
            clientUrgency: string;
            followUpStyle: string;
            smartInsight: string;
            confidence: number;
            viewCount: number;
            firstViewedAt: number | null;
            lastViewedAt: number | null;
          };
        };
        const expensesResult = (await expensesResponse.json()) as {
          expenses: TemporaryExpenseData[];
        };
        const summaryResult = (await summaryResponse.json()) as {
          summary: TemporaryFinancialSummary;
        };

        if (!isActive) {
          return;
        }

        const nextInvoice = applyFinancialSummaryToInvoice(
          {
            ...(getStoredInvoice() ?? defaultTemporaryInvoiceData),
            id: invoiceResult.invoice.invoiceId,
            workspaceId: invoiceResult.invoice.workspaceId,
            token: invoiceResult.invoice.token,
            invoiceNumber: invoiceResult.invoice.invoiceNumber,
            freelancerName: invoiceResult.invoice.freelancerName,
            clientName: invoiceResult.invoice.clientName,
            serviceName: invoiceResult.invoice.service,
            currencyLabel: invoiceResult.invoice.currency,
            currencyShort: invoiceResult.invoice.currency,
            deliveryDate: invoiceResult.invoice.deliveryDate ?? "",
            dueDate: invoiceResult.invoice.dueDate ?? "",
            paymentStatus:
              invoiceResult.invoice.paymentStatus as TemporaryInvoiceData["paymentStatus"],
            viewCount: invoiceResult.invoice.viewCount,
            firstViewedAt: invoiceResult.invoice.firstViewedAt,
            lastViewedAt: invoiceResult.invoice.lastViewedAt,
            projectValue: invoiceResult.invoice.totalAmount,
            amountPaid: invoiceResult.invoice.paidAmount,
            amountRemaining: invoiceResult.invoice.remainingAmount,
          },
          summaryResult.summary,
        );

        setInvoice(nextInvoice);
        setStoredInvoice(nextInvoice);
        setExpenses(expensesResult.expenses);
        setStoredExpenses(nextInvoice, expensesResult.expenses);
        setFinancialSummary(summaryResult.summary);
        setUsesLocalExpenseFallback(false);
        setExpenseForm((current) => ({
          ...current,
          currency: nextInvoice.currencyShort,
        }));
      } catch {
        if (!isActive) {
          return;
        }

        const fallbackInvoice = getStoredInvoice() ?? defaultTemporaryInvoiceData;

        setInvoice(fallbackInvoice);
        setExpenses(getStoredExpenses(fallbackInvoice));
        setFinancialSummary(getStoredFinancialSummary(fallbackInvoice));
        setUsesLocalExpenseFallback(true);
      }
    }

    void loadInvoice();

    return () => {
      isActive = false;
    };
  }, [params?.invoiceId]);

  function updateExpenseField<Key extends keyof ExpenseFormState>(
    key: Key,
    value: ExpenseFormState[Key],
  ) {
    setExpenseForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function syncLocalFinancialState(baseInvoice: TemporaryInvoiceData) {
    const nextExpenses = getStoredExpenses(baseInvoice);
    const nextSummary = getStoredFinancialSummary(baseInvoice);
    const nextInvoice = applyFinancialSummaryToInvoice(baseInvoice, nextSummary);

    setExpenses(nextExpenses);
    setFinancialSummary(nextSummary);
    setInvoice(nextInvoice);
    setStoredInvoice(nextInvoice);

    return nextInvoice;
  }

  async function handleCopyInvoiceLink() {
    await navigator.clipboard.writeText(publicInvoiceUrl);
    showToast("تم نسخ رابط الفاتورة");
  }

  async function handleSaveExpense() {
    const amount = Number(expenseForm.amount.replace(/[^\d.]/g, ""));

    if (!Number.isFinite(amount) || amount <= 0) {
      showToast("أدخل مبلغًا صحيحًا للمصروف");
      return;
    }

    const payload = {
      amount,
      currency: expenseForm.currency.trim() || invoice.currencyShort,
      category: expenseForm.category,
      note: expenseForm.note.trim() || null,
    };

    setIsSavingExpense(true);

    try {
      if (
        process.env.NEXT_PUBLIC_CONVEX_URL &&
        invoice.id &&
        params?.invoiceId !== "demo"
      ) {
        const response = await fetch(`/api/invoices/${invoice.id}/expenses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workspaceId: invoice.workspaceId,
            ...payload,
          }),
        });

        if (!response.ok) {
          throw new Error("Add expense request failed");
        }

        const [expensesResponse, summaryResponse] = await Promise.all([
          fetch(`/api/invoices/${invoice.id}/expenses`),
          fetch(`/api/invoices/${invoice.id}/financial-summary`),
        ]);

        if (!expensesResponse.ok || !summaryResponse.ok) {
          throw new Error("Refresh expense request failed");
        }

        const expensesResult = (await expensesResponse.json()) as {
          expenses: TemporaryExpenseData[];
        };
        const summaryResult = (await summaryResponse.json()) as {
          summary: TemporaryFinancialSummary;
        };
        const nextInvoice = applyFinancialSummaryToInvoice(
          {
            ...invoice,
            currencyShort: summaryResult.summary.currency,
          },
          summaryResult.summary,
        );

        setInvoice(nextInvoice);
        setStoredInvoice(nextInvoice);
        setExpenses(expensesResult.expenses);
        setStoredExpenses(nextInvoice, expensesResult.expenses);
        setFinancialSummary(summaryResult.summary);
        setUsesLocalExpenseFallback(false);
      } else {
        throw new Error("Convex is unavailable");
      }
    } catch {
      addStoredExpense(invoice, {
        invoiceId: invoice.id,
        workspaceId: invoice.workspaceId,
        ...payload,
      });
      syncLocalFinancialState({
        ...invoice,
        currencyShort: payload.currency,
      });
      setUsesLocalExpenseFallback(true);
    } finally {
      setExpenseForm({
        amount: "",
        currency: invoice.currencyShort,
        category: expenseCategories[0],
        note: "",
      });
      setIsSavingExpense(false);
    }

    showToast("تم حفظ المصروف وتحديث الربح المتوقع");
  }

  return (
    <div className="space-y-6 lg:space-y-7">
      <PageHeader
        title="الفاتورة جاهزة"
        description="هذه صفحة ثابتة لعرض شكل الفاتورة الداخلية والرابط الذكي والملخص المالي قبل ربطها بالبيانات الفعلية."
        badge={<StatusBadge status={invoice.paymentStatus} />}
      />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,251,249,0.95))] p-5 shadow-[0_22px_62px_-50px_rgba(0,72,54,0.22)] sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-5">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                رقم الفاتورة
              </p>
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                {invoice.invoiceNumber}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ReceiptText className="size-5" />
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InvoiceLine label="من" value={invoice.freelancerName} />
            <InvoiceLine label="إلى" value={invoice.clientName} />
            <InvoiceLine label="الخدمة" value={invoice.serviceName} fullWidth />
            <InvoiceAmount
              label="الإجمالي"
              value={summary.totalAmount}
              currencyShort={summary.currency}
              emphasis
            />
            <InvoiceAmount
              label="المدفوع"
              value={summary.paidAmount}
              currencyShort={summary.currency}
            />
            <InvoiceAmount
              label="المتبقي"
              value={summary.remainingAmount}
              currencyShort={summary.currency}
            />
            <InvoiceLine label="موعد التسليم" value={invoice.deliveryDate} />
            <InvoiceLine label="موعد الاستحقاق" value={invoice.dueDate} />
            <div className="sm:col-span-2 rounded-[1.25rem] border border-input bg-background px-4 py-4">
              <p className="text-sm font-medium text-muted-foreground">الحالة</p>
              <div className="mt-2">
                <StatusBadge status={invoice.paymentStatus} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.9rem] border border-white/70 bg-[linear-gradient(135deg,rgba(0,122,90,0.96),rgba(11,96,74,0.92))] p-5 text-primary-foreground shadow-[0_28px_70px_-44px_rgba(0,72,54,0.55)] sm:p-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-primary-foreground">
                رابط الفاتورة الذكي
              </h3>
              <p className="text-sm leading-7 text-primary-foreground/82">
                أرسل الرابط للعميل. إذا فتحه، بنوضح لك أن الفاتورة تمت مشاهدتها.
              </p>
            </div>

            <div className="mt-4 rounded-[1.35rem] border border-white/12 bg-white/10 px-4 py-4 backdrop-blur">
              <p className="text-sm font-bold text-primary-foreground">
                {publicInvoiceUrl}
              </p>
              <p className="mt-2 text-sm text-primary-foreground/82">
                {invoice.viewCount && invoice.viewCount > 0
                  ? "العميل شاهد الفاتورة"
                  : "لم يشاهدها العميل بعد"}
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                className="h-11 rounded-2xl border-white/20 bg-white/10 text-primary-foreground hover:bg-white/16 hover:text-primary-foreground"
                onClick={handleCopyInvoiceLink}
              >
                <Copy className="size-4" />
                انسخ رابط الفاتورة
              </Button>
              <Button
                asChild
                className="h-11 rounded-2xl bg-white text-primary hover:bg-white/90"
              >
                <Link href={`/i/${invoice.token ?? "demo-token"}`}>
                  <ExternalLink className="size-4" />
                  فتح رابط الفاتورة
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-2xl border-white/20 bg-white/10 text-primary-foreground hover:bg-white/16 hover:text-primary-foreground"
              >
                <Download className="size-4" />
                تحميل PDF
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-2xl border-white/20 bg-white/10 text-primary-foreground hover:bg-white/16 hover:text-primary-foreground"
              >
                <Link href={`/app/invoices/${invoice.id ?? "demo"}/follow-up`}>
                  <MessageSquareMore className="size-4" />
                  نسخ رسالة واتساب
                </Link>
              </Button>
            </div>
          </div>

          <AIInsightCard
            label="تنبيه واصل"
            title="الفاتورة جاهزة للمشاركة"
            description="الدفعة المتبقية واضحة، ووقت الاستحقاق قريب بما يكفي لتجهيز متابعة قصيرة ولطيفة عند الحاجة."
            badge={<StatusBadge status={invoice.viewCount && invoice.viewCount > 0 ? "تمت المشاهدة" : "لم تُشاهد بعد"} />}
          />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <FinancialSummaryCard summary={summary} />
          <InfoCard
            icon={<CalendarClock className="size-5" />}
            title="النشاط الأخير"
            lines={[
              "تم تجهيز الفاتورة الداخلية",
              invoice.viewCount && invoice.viewCount > 0
                ? "تم تسجيل مشاهدة الرابط العام"
                : "بانتظار فتح الرابط من العميل",
              "رسالة المتابعة الجاهزة متاحة للإرسال",
            ]}
          />
        </div>

        <div className="rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,251,249,0.95))] p-5 shadow-[0_22px_60px_-50px_rgba(0,72,54,0.22)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                مصاريف المشروع
              </p>
              <h3 className="text-lg font-bold text-foreground">
                أضف مصروفًا واحسب الربح المتوقع مباشرة
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
          </div>

          {showFallbackNote ? (
            <p className="mt-4 rounded-[1.25rem] border border-dashed border-amber-200/80 bg-amber-50/85 px-4 py-3 text-sm leading-7 text-amber-800">
              يتم حفظ المصاريف مؤقتًا على هذا الجهاز
            </p>
          ) : null}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                المبلغ
              </span>
              <input
                value={expenseForm.amount}
                onChange={(event) => updateExpenseField("amount", event.target.value)}
                inputMode="decimal"
                className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                العملة
              </span>
              <input
                value={expenseForm.currency}
                onChange={(event) => updateExpenseField("currency", event.target.value)}
                className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                نوع المصروف
              </span>
              <select
                value={expenseForm.category}
                onChange={(event) =>
                  updateExpenseField(
                    "category",
                    event.target.value as TemporaryExpenseCategory,
                  )
                }
                className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                ملاحظة
              </span>
              <input
                value={expenseForm.note}
                onChange={(event) => updateExpenseField("note", event.target.value)}
                className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </label>
          </div>

          <div className="mt-5 flex justify-start">
            <Button
              className="h-11 rounded-2xl px-5"
              onClick={handleSaveExpense}
              disabled={isSavingExpense}
            >
              حفظ المصروف
            </Button>
          </div>

          <div className="mt-5 space-y-3">
            {expenses.length === 0 ? (
              <div className="rounded-[1.25rem] border border-dashed border-border bg-background px-4 py-4 text-sm leading-7 text-muted-foreground">
                لا توجد مصاريف محفوظة بعد. أضف أول مصروف ليظهر الربح المتوقع بشكل أدق.
              </div>
            ) : (
              expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="rounded-[1.25rem] border border-input bg-background/90 px-4 py-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">
                        {expense.category}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatExpenseDate(expense.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {expense.amount.toLocaleString("en-US")} {expense.currency}
                    </p>
                  </div>
                  {expense.note ? (
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {expense.note}
                    </p>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function InvoiceLine({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.25rem] border border-input bg-background/90 px-4 py-4 ${
        fullWidth ? "sm:col-span-2" : ""
      }`}
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-bold leading-7 text-foreground">{value}</p>
    </div>
  );
}

function InvoiceAmount({
  label,
  value,
  currencyShort,
  emphasis,
}: {
  label: string;
  value: number;
  currencyShort: string;
  emphasis?: boolean;
}) {
  return (
    <div className="rounded-[1.25rem] border border-input bg-background/90 px-4 py-4">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <ArabicNumber
          value={value}
          className={`text-base ${emphasis ? "text-xl font-extrabold text-foreground" : "font-bold text-foreground"}`}
        />
        <span className="text-sm text-muted-foreground">{currencyShort}</span>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  lines,
}: {
  icon: ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <div className="rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,251,249,0.95))] p-5 shadow-[0_20px_54px_-48px_rgba(0,72,54,0.2)]">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </span>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
        {lines.map((line) => (
          <li
            key={line}
            className="rounded-[1.15rem] border border-white/70 bg-background/80 px-4 py-3"
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FinancialSummaryCard({
  summary,
}: {
  summary: TemporaryFinancialSummary;
}) {
  return (
    <div className="rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,251,249,0.95))] p-5 shadow-[0_20px_54px_-48px_rgba(0,72,54,0.2)]">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <WalletCards className="size-5" />
        </span>
        <h3 className="text-lg font-bold text-foreground">الملخص المالي</h3>
      </div>

      <div className="mt-4 grid gap-3">
        <SummaryAmountRow
          label="قيمة المشروع"
          value={summary.totalAmount}
          currency={summary.currency}
        />
        <SummaryAmountRow
          label="المدفوع"
          value={summary.paidAmount}
          currency={summary.currency}
        />
        <SummaryAmountRow
          label="المتبقي"
          value={summary.remainingAmount}
          currency={summary.currency}
        />
        <SummaryAmountRow
          label="مصاريف المشروع"
          value={summary.totalExpenses}
          currency={summary.currency}
        />
        <SummaryAmountRow
          label="الربح المتوقع"
          value={summary.expectedProfit}
          currency={summary.currency}
          emphasis
        />
      </div>
    </div>
  );
}

function SummaryAmountRow({
  label,
  value,
  currency,
  emphasis,
}: {
  label: string;
  value: number;
  currency: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-white/70 bg-background/85 px-4 py-3 shadow-sm">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={emphasis ? "text-foreground" : "text-foreground"}>
        <span
          className={`inline-flex items-center gap-2 text-sm font-bold ${
            emphasis ? "text-lg font-extrabold" : ""
          }`}
        >
          <ArabicNumber value={value} />
          <span>{currency}</span>
        </span>
      </span>
    </div>
  );
}

function formatExpenseDate(createdAt: number) {
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
  }).format(new Date(createdAt));
}
