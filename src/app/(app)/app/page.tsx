"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  Eye,
  ReceiptText,
  WalletCards,
} from "lucide-react";

import { AIInsightCard } from "@/components/shared/ai-insight-card";
import { ArabicNumber } from "@/components/shared/arabic-number";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  applyFinancialSummaryToInvoice,
  defaultTemporaryInvoiceData,
  getInvoiceViewed,
  getStoredFinancialSummary,
  getStoredInvoice,
  setStoredInvoice,
  type TemporaryFinancialSummary,
  type TemporaryInvoiceData,
} from "@/lib/client-storage";

const emptySummary: TemporaryFinancialSummary = {
  totalAmount: 0,
  paidAmount: 0,
  remainingAmount: 0,
  totalExpenses: 0,
  expectedProfit: 0,
  currency: "ريال",
};

export default function DashboardPage() {
  const [invoice, setInvoice] =
    useState<TemporaryInvoiceData>(defaultTemporaryInvoiceData);
  const [financialSummary, setFinancialSummary] =
    useState<TemporaryFinancialSummary>(emptySummary);
  const [invoiceViewed, setInvoiceViewed] = useState(false);
  const [hasInvoice, setHasInvoice] = useState(false);

  useEffect(() => {
    let isActive = true;

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      const storedInvoice = getStoredInvoice();

      setInvoice(storedInvoice ?? defaultTemporaryInvoiceData);
      setFinancialSummary(
        storedInvoice ? getStoredFinancialSummary(storedInvoice) : emptySummary,
      );
      setHasInvoice(Boolean(storedInvoice));
      setInvoiceViewed(getInvoiceViewed());
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      return;
    }

    let isActive = true;

    async function loadInvoices() {
      try {
        const response = await fetch("/api/invoices/list");

        if (!response.ok) {
          throw new Error("Load invoices request failed");
        }

        const result = (await response.json()) as {
          invoices: Array<{
            invoiceId: string;
            token: string;
            invoiceNumber: string;
            clientName: string;
            service: string;
            totalAmount: number;
            remainingAmount: number;
            paymentStatus: string;
            dueDate: string | null;
            viewCount: number;
            createdAt: number;
          }>;
        };

        if (!isActive) {
          return;
        }

        if (result.invoices.length === 0) {
          const storedInvoice = getStoredInvoice();

          setHasInvoice(Boolean(storedInvoice));
          setFinancialSummary(
            storedInvoice ? getStoredFinancialSummary(storedInvoice) : emptySummary,
          );
          return;
        }

        const latestInvoice = result.invoices[0];
        const [invoiceResponse, summaryResponse] = await Promise.all([
          fetch(`/api/invoices/${latestInvoice.invoiceId}`),
          fetch(`/api/invoices/${latestInvoice.invoiceId}/financial-summary`),
        ]);

        if (!invoiceResponse.ok || !summaryResponse.ok) {
          throw new Error("Load invoice dashboard details request failed");
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
            deliveryDate: invoiceResult.invoice.deliveryDate ?? "",
            dueDate: invoiceResult.invoice.dueDate ?? "",
            paymentStatus:
              invoiceResult.invoice.paymentStatus as TemporaryInvoiceData["paymentStatus"],
            viewCount: invoiceResult.invoice.viewCount,
            projectValue: invoiceResult.invoice.totalAmount,
            amountPaid: invoiceResult.invoice.paidAmount,
            amountRemaining: invoiceResult.invoice.remainingAmount,
            currencyShort: invoiceResult.invoice.currency,
            currencyLabel: invoiceResult.invoice.currency,
          },
          summaryResult.summary,
        );

        setInvoice(nextInvoice);
        setStoredInvoice(nextInvoice);
        setFinancialSummary(summaryResult.summary);
        setInvoiceViewed(invoiceResult.invoice.viewCount > 0);
        setHasInvoice(true);
      } catch {
        // keep local fallback
      }
    }

    void loadInvoices();

    return () => {
      isActive = false;
    };
  }, []);

  const displaySummary = hasInvoice ? financialSummary : emptySummary;
  const invoiceStatusText = hasInvoice
    ? invoiceViewed
      ? "العميل شاهد الفاتورة اليوم"
      : "العميل لم يشاهد الفاتورة بعد"
    : "لا توجد فاتورة محفوظة بعد";
  const smartAlertDescription = getSmartAlertDescription({
    hasInvoice,
    summary: displaySummary,
    invoiceViewed,
  });

  return (
    <div className="space-y-6 lg:space-y-7">
      <PageHeader
        title="لوحة التحكم"
        description="هنا تشوف حالة مشروعك الحالية بشكل سريع: قيمة الاتفاق، المدفوع، المتبقي، المصاريف، والربح المتوقع قبل إرسال أي متابعة."
        badge={<StatusBadge status={invoiceViewed ? "تمت المشاهدة" : "لم تُشاهد بعد"} />}
        action={
          <Button asChild className="h-11 rounded-2xl px-5 text-sm font-bold">
            <Link href="/app/new">إضافة محادثة جديدة</Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
        <StatCard
          title="قيمة المشروع"
          value={<CurrencyValue value={displaySummary.totalAmount} currency={displaySummary.currency} />}
          hint="إجمالي الاتفاق قبل احتساب المصاريف."
          icon={<ReceiptText className="size-5" />}
          className="xl:col-span-3"
        />
        <StatCard
          title="المدفوع"
          value={<CurrencyValue value={displaySummary.paidAmount} currency={displaySummary.currency} />}
          hint="إجمالي المبلغ المسجل حتى الآن."
          icon={<CircleDollarSign className="size-5" />}
          className="xl:col-span-3"
        />
        <StatCard
          title="المتبقي"
          value={<CurrencyValue value={displaySummary.remainingAmount} currency={displaySummary.currency} />}
          hint="المبلغ المتوقع متابعته مع العميل."
          icon={<WalletCards className="size-5" />}
          className="xl:col-span-3"
        />
        <StatCard
          title="مصاريف المشروع"
          value={<CurrencyValue value={displaySummary.totalExpenses} currency={displaySummary.currency} />}
          hint="المصاريف المسجلة على الفاتورة الحالية."
          icon={<ChartNoAxesColumnIncreasing className="size-5" />}
          className="xl:col-span-3"
        />
        <StatCard
          title="الربح المتوقع"
          value={<CurrencyValue value={displaySummary.expectedProfit} currency={displaySummary.currency} />}
          hint="قيمة المشروع بعد خصم المصاريف."
          icon={<ChartNoAxesColumnIncreasing className="size-5" />}
          className="xl:col-span-4"
        />
        <StatCard
          title="حالة الفاتورة"
          value={invoiceStatusText}
          hint="تتحدث هذه البطاقة حسب فتح الرابط العام من صفحة العميل."
          icon={<Eye className="size-5" />}
          className="md:col-span-2 xl:col-span-8"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <AIInsightCard
          label="تنبيه واصل"
          title={hasInvoice ? "قراءة سريعة لوضع المشروع" : "ابدأ بأول فاتورة"}
          description={smartAlertDescription}
          badge={<StatusBadge status={invoiceViewed ? "تمت المشاهدة" : "لم تُشاهد بعد"} />}
          footer={
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href={hasInvoice ? `/app/invoices/${invoice.id ?? "demo"}` : "/app/new"}>
                  {hasInvoice ? "فتح الفاتورة" : "إضافة فاتورة"}
                </Link>
              </Button>
              <Button asChild className="rounded-2xl">
                <Link
                  href={
                    hasInvoice
                      ? `/app/invoices/${invoice.id ?? "demo"}/follow-up`
                      : "/app/new"
                  }
                >
                  {hasInvoice ? "رسالة المتابعة" : "بدء رحلة جديدة"}
                </Link>
              </Button>
            </div>
          }
        />

        <div className="rounded-[1.85rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,251,249,0.95))] p-5 shadow-[0_20px_56px_-48px_rgba(0,72,54,0.22)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                ملخص الاتفاق الحالي
              </p>
              <h3 className="text-lg font-bold text-foreground">
                {hasInvoice ? invoice.clientName : "لا توجد فاتورة محفوظة بعد"}
              </h3>
            </div>
            <StatusBadge
              status={hasInvoice ? invoice.paymentStatus : "غير محددة"}
            />
          </div>

          <dl className="mt-5 space-y-3.5 text-sm">
            <SummaryRow
              label="الخدمة"
              value={hasInvoice ? invoice.serviceName : "أضف محادثة جديدة لبدء أول فاتورة"}
            />
            <SummaryRow
              label="موعد التسليم"
              value={hasInvoice ? invoice.deliveryDate : "—"}
            />
            <SummaryRow
              label="موعد الاستحقاق"
              value={hasInvoice ? invoice.dueDate : "—"}
            />
            <SummaryRow label="الرابط العام" value={invoiceStatusText} />
          </dl>
        </div>
      </section>
    </div>
  );
}

function CurrencyValue({
  value,
  currency,
}: {
  value: number;
  currency: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <ArabicNumber value={value} />
      <span className="text-base font-bold text-muted-foreground">{currency}</span>
    </span>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-white/70 bg-background/85 px-4 py-3 shadow-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-bold text-foreground">{value}</dd>
    </div>
  );
}

function getSmartAlertDescription({
  hasInvoice,
  summary,
  invoiceViewed,
}: {
  hasInvoice: boolean;
  summary: TemporaryFinancialSummary;
  invoiceViewed: boolean;
}) {
  if (!hasInvoice) {
    return "ابدأ بإضافة أول فاتورة عشان يعرض واصل ملخص المشروع والتنبيه المناسب بالعربية.";
  }

  if (summary.totalExpenses > 0) {
    return `بعد احتساب المصاريف، ربحك المتوقع من هذا المشروع هو ${summary.expectedProfit.toLocaleString("en-US")} ${summary.currency}.`;
  }

  if (summary.remainingAmount > 0 && invoiceViewed) {
    return `العميل شاهد الفاتورة، وما زال المتبقي ${summary.remainingAmount.toLocaleString("en-US")} ${summary.currency}. يمكنك إرسال تذكير لطيف.`;
  }

  return "أضف مصاريف المشروع عشان يحسب واصل ربحك المتوقع بدقة.";
}
