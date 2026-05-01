"use client";

import { useCallback, useEffect, useState } from "react";
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
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  applyFinancialSummaryToInvoice,
  defaultTemporaryInvoiceData,
  getStoredConfirmedInvoices,
  getStoredFinancialSummary,
  getInvoiceViewStatus,
  getInvoiceViewedBroadcastKey,
  isLocalInvoiceId,
  upsertStoredInvoice,
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

type RecentInvoice = {
  invoiceId: string;
  token: string;
  invoiceNumber: string;
  clientName: string;
  totalAmount: number;
  currency: string;
  paymentStatus: TemporaryInvoiceData["paymentStatus"];
  dueDate: string | null;
  viewCount: number;
  createdAt: number;
  source: "convex" | "local";
};

type RemoteInvoiceDetails = {
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
  createdAt: number;
  updatedAt: number;
};

function mapStoredInvoiceToRecentInvoice(
  invoice: TemporaryInvoiceData,
): RecentInvoice {
  return {
    invoiceId: invoice.id ?? "demo",
    token: invoice.token ?? "demo-token",
    invoiceNumber: invoice.invoiceNumber,
    clientName: invoice.clientName,
    totalAmount: invoice.projectValue,
    currency: invoice.currencyShort,
    paymentStatus: invoice.paymentStatus,
    dueDate: invoice.dueDate || null,
    viewCount: invoice.viewCount ?? 0,
    createdAt: invoice.createdAt ?? 0,
    source: "local",
  };
}

function mergeRecentInvoices(
  remoteInvoices: RecentInvoice[],
  localInvoices: RecentInvoice[],
) {
  const remoteKeys = new Set(
    remoteInvoices.map((invoice) => `${invoice.invoiceId}:${invoice.token}`),
  );
  const uniqueLocalInvoices = localInvoices.filter(
    (invoice) => !remoteKeys.has(`${invoice.invoiceId}:${invoice.token}`),
  );

  return [...remoteInvoices, ...uniqueLocalInvoices].sort(
    (left, right) => right.createdAt - left.createdAt,
  );
}

export default function DashboardPage() {
  const [invoice, setInvoice] =
    useState<TemporaryInvoiceData>(defaultTemporaryInvoiceData);
  const [financialSummary, setFinancialSummary] =
    useState<TemporaryFinancialSummary>(emptySummary);
  const [invoiceViewed, setInvoiceViewed] = useState(false);
  const [hasInvoice, setHasInvoice] = useState(false);
  const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([]);
  const [usesLocalInvoiceFallback, setUsesLocalInvoiceFallback] = useState(false);

  const loadDashboardData = useCallback(async () => {
    const localInvoices = getStoredConfirmedInvoices();
    const localRecentInvoices = localInvoices.map(mapStoredInvoiceToRecentInvoice);
    const latestLocalInvoice = localInvoices[0] ?? null;

    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      setRecentInvoices(localRecentInvoices);
      setUsesLocalInvoiceFallback(true);
      setHasInvoice(Boolean(latestLocalInvoice));
      setInvoice(latestLocalInvoice ?? defaultTemporaryInvoiceData);
      setFinancialSummary(
        latestLocalInvoice
          ? getStoredFinancialSummary(latestLocalInvoice)
          : emptySummary,
      );
      setInvoiceViewed((latestLocalInvoice?.viewCount ?? 0) > 0);
      return;
    }

    try {
      const response = await fetch("/api/invoices/list", {
        cache: "no-store",
      });

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
          currency: string;
          remainingAmount: number;
          paymentStatus: string;
          dueDate: string | null;
          viewCount: number;
          createdAt: number;
        }>;
      };

      const remoteRecentInvoices: RecentInvoice[] = result.invoices.map(
        (invoiceItem) => ({
          invoiceId: invoiceItem.invoiceId,
          token: invoiceItem.token,
          invoiceNumber: invoiceItem.invoiceNumber,
          clientName: invoiceItem.clientName,
          totalAmount: invoiceItem.totalAmount,
          currency: invoiceItem.currency,
          paymentStatus:
            invoiceItem.paymentStatus as TemporaryInvoiceData["paymentStatus"],
          dueDate: invoiceItem.dueDate,
          viewCount: invoiceItem.viewCount,
          createdAt: invoiceItem.createdAt,
          source: "convex",
        }),
      );

      const mergedRecentInvoices = mergeRecentInvoices(
        remoteRecentInvoices,
        localRecentInvoices,
      );
      const latestRecentInvoice = mergedRecentInvoices[0] ?? null;

      setRecentInvoices(mergedRecentInvoices);
      setUsesLocalInvoiceFallback(
        mergedRecentInvoices.some((invoiceItem) => invoiceItem.source === "local"),
      );

      if (!latestRecentInvoice) {
        setHasInvoice(Boolean(latestLocalInvoice));
        setInvoice(latestLocalInvoice ?? defaultTemporaryInvoiceData);
        setFinancialSummary(
          latestLocalInvoice
            ? getStoredFinancialSummary(latestLocalInvoice)
            : emptySummary,
        );
        setInvoiceViewed((latestLocalInvoice?.viewCount ?? 0) > 0);
        return;
      }

      if (
        latestRecentInvoice.source === "local" ||
        isLocalInvoiceId(latestRecentInvoice.invoiceId)
      ) {
        const latestInvoice =
          localInvoices.find(
            (storedInvoice) => storedInvoice.id === latestRecentInvoice.invoiceId,
          ) ?? latestLocalInvoice;

        setHasInvoice(Boolean(latestInvoice));
        setInvoice(latestInvoice ?? defaultTemporaryInvoiceData);
        setFinancialSummary(
          latestInvoice ? getStoredFinancialSummary(latestInvoice) : emptySummary,
        );
        setInvoiceViewed((latestInvoice?.viewCount ?? 0) > 0);
        return;
      }

      const [invoiceResponse, summaryResponse] = await Promise.all([
        fetch(`/api/invoices/${latestRecentInvoice.invoiceId}`, {
          cache: "no-store",
        }),
        fetch(`/api/invoices/${latestRecentInvoice.invoiceId}/financial-summary`, {
          cache: "no-store",
        }),
      ]);

      if (!invoiceResponse.ok || !summaryResponse.ok) {
        throw new Error("Load invoice dashboard details request failed");
      }

      const invoiceResult = (await invoiceResponse.json()) as {
        invoice: RemoteInvoiceDetails;
      };
      const summaryResult = (await summaryResponse.json()) as {
        summary: TemporaryFinancialSummary;
      };

      const storedInvoiceForMerge =
        localInvoices.find(
          (storedInvoice) => storedInvoice.id === invoiceResult.invoice.invoiceId,
        ) ?? defaultTemporaryInvoiceData;
      const nextInvoice = applyFinancialSummaryToInvoice(
        {
          ...storedInvoiceForMerge,
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
          firstViewedAt: invoiceResult.invoice.firstViewedAt,
          lastViewedAt: invoiceResult.invoice.lastViewedAt,
          invoiceViewStatus: getInvoiceViewStatus(invoiceResult.invoice.viewCount),
          createdAt: invoiceResult.invoice.createdAt,
          updatedAt: invoiceResult.invoice.updatedAt,
          isConfirmed: true,
        },
        summaryResult.summary,
      );

      setInvoice(nextInvoice);
      upsertStoredInvoice(nextInvoice);
      setFinancialSummary(summaryResult.summary);
      setInvoiceViewed(invoiceResult.invoice.viewCount > 0);
      setHasInvoice(true);
    } catch {
      setRecentInvoices(localRecentInvoices);
      setUsesLocalInvoiceFallback(true);
      setHasInvoice(Boolean(latestLocalInvoice));
      setInvoice(latestLocalInvoice ?? defaultTemporaryInvoiceData);
      setFinancialSummary(
        latestLocalInvoice
          ? getStoredFinancialSummary(latestLocalInvoice)
          : emptySummary,
      );
      setInvoiceViewed((latestLocalInvoice?.viewCount ?? 0) > 0);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadDashboardData();
    });
  }, [loadDashboardData]);

  useEffect(() => {
    function handleVisibilityRefresh() {
      if (document.visibilityState === "visible") {
        void loadDashboardData();
      }
    }

    function handleFocusRefresh() {
      void loadDashboardData();
    }

    function handleStorageRefresh(event: StorageEvent) {
      if (
        event.key === getInvoiceViewedBroadcastKey() ||
        event.key === "wasil:invoices"
      ) {
        void loadDashboardData();
      }
    }

    window.addEventListener("focus", handleFocusRefresh);
    document.addEventListener("visibilitychange", handleVisibilityRefresh);
    window.addEventListener("storage", handleStorageRefresh);

    return () => {
      window.removeEventListener("focus", handleFocusRefresh);
      document.removeEventListener("visibilitychange", handleVisibilityRefresh);
      window.removeEventListener("storage", handleStorageRefresh);
    };
  }, [loadDashboardData]);

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
        badge={<StatusBadge status={getInvoiceViewStatus(invoiceViewed ? 1 : 0)} />}
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
          badge={<StatusBadge status={getInvoiceViewStatus(invoiceViewed ? 1 : 0)} />}
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

      <section
        id="recent-invoices"
        className="rounded-[1.85rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,251,249,0.95))] p-5 shadow-[0_20px_56px_-48px_rgba(0,72,54,0.22)] sm:p-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              آخر الفواتير
            </p>
            <h3 className="text-lg font-bold text-foreground">
              قائمة الفواتير الحديثة
            </h3>
          </div>
          {usesLocalInvoiceFallback ? (
            <span className="inline-flex rounded-full border border-primary/12 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
              يتم حفظ الفواتير مؤقتًا على هذا الجهاز
            </span>
          ) : null}
        </div>

        {recentInvoices.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="لا توجد فواتير بعد"
              description="ابدأ بإنشاء أول فاتورة حتى تظهر هنا قائمة الفواتير الحديثة وحالة المشاهدة لكل فاتورة."
              action={
                <Button asChild className="rounded-2xl px-5">
                  <Link href="/app/new">إنشاء فاتورة</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {recentInvoices.map((recentInvoice) => (
              <Link
                key={`${recentInvoice.invoiceId}:${recentInvoice.token}`}
                href={`/app/invoices/${recentInvoice.invoiceId}`}
                className="grid gap-3 rounded-[1.4rem] border border-white/70 bg-background/85 px-4 py-4 shadow-sm transition-colors hover:bg-background md:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1fr_1fr_180px]"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    {recentInvoice.invoiceNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {recentInvoice.clientName}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <RecentInvoiceMeta
                    label="الإجمالي"
                    value={`${recentInvoice.totalAmount.toLocaleString("en-US")} ${recentInvoice.currency}`}
                  />
                  <RecentInvoiceMeta
                    label="موعد الاستحقاق"
                    value={recentInvoice.dueDate ?? "—"}
                  />
                  <RecentInvoiceMeta
                    label="حالة الدفع"
                    value={recentInvoice.paymentStatus}
                  />
                  <RecentInvoiceMeta
                    label="حالة المشاهدة"
                    value={getInvoiceViewStatus(recentInvoice.viewCount)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                  <StatusBadge status={recentInvoice.paymentStatus} />
                  <StatusBadge status={getInvoiceViewStatus(recentInvoice.viewCount)} />
                </div>
              </Link>
            ))}
          </div>
        )}
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

function RecentInvoiceMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
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
