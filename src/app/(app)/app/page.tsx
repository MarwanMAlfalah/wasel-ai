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
  defaultTemporaryInvoiceData,
  getInvoiceViewed,
  getStoredInvoice,
  type TemporaryInvoiceData,
} from "@/lib/client-storage";

export default function DashboardPage() {
  const [invoice, setInvoice] =
    useState<TemporaryInvoiceData>(defaultTemporaryInvoiceData);
  const [invoiceViewed, setInvoiceViewed] = useState(false);

  useEffect(() => {
    let isActive = true;

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      setInvoice(getStoredInvoice() ?? defaultTemporaryInvoiceData);
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

        if (!isActive || result.invoices.length === 0) {
          return;
        }

        const latestInvoice = result.invoices[0];
        const viewed = result.invoices.some((listedInvoice) => listedInvoice.viewCount > 0);

        setInvoice((current) => ({
          ...current,
          id: latestInvoice.invoiceId,
          token: latestInvoice.token,
          invoiceNumber: latestInvoice.invoiceNumber,
          clientName: latestInvoice.clientName,
          serviceName: latestInvoice.service,
          projectValue: latestInvoice.totalAmount,
          amountRemaining: latestInvoice.remainingAmount,
          dueDate: latestInvoice.dueDate ?? "",
          paymentStatus: latestInvoice.paymentStatus as TemporaryInvoiceData["paymentStatus"],
          viewCount: latestInvoice.viewCount,
        }));
        setInvoiceViewed(viewed);
      } catch {
        // keep local fallback
      }
    }

    void loadInvoices();

    return () => {
      isActive = false;
    };
  }, []);

  const invoiceStatusText = invoiceViewed
    ? "العميل شاهد الفاتورة اليوم"
    : "العميل لم يشاهد الفاتورة بعد";

  return (
    <div className="space-y-6">
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="قيمة المشروع"
          value={
            <span className="inline-flex items-center gap-1.5">
              <ArabicNumber value={invoice.projectValue} />
              <span className="text-base font-bold text-muted-foreground">
                ريال
              </span>
            </span>
          }
          hint="إجمالي الاتفاق قبل احتساب المصاريف."
          icon={<ReceiptText className="size-5" />}
        />
        <StatCard
          title="المدفوع"
          value={
            <span className="inline-flex items-center gap-1.5">
              <ArabicNumber value={invoice.amountPaid} />
              <span className="text-base font-bold text-muted-foreground">
                ريال
              </span>
            </span>
          }
          hint="دفعة مسجلة يدويًا حتى الآن."
          icon={<CircleDollarSign className="size-5" />}
        />
        <StatCard
          title="المتبقي"
          value={
            <span className="inline-flex items-center gap-1.5">
              <ArabicNumber value={invoice.amountRemaining} />
              <span className="text-base font-bold text-muted-foreground">
                ريال
              </span>
            </span>
          }
          hint="المبلغ المتوقع متابعته مع العميل."
          icon={<WalletCards className="size-5" />}
        />
        <StatCard
          title="مصاريف المشروع"
          value={
            <span className="inline-flex items-center gap-1.5">
              <ArabicNumber value={invoice.projectExpenses} />
              <span className="text-base font-bold text-muted-foreground">
                ريال
              </span>
            </span>
          }
          hint="مصروفات تجريبية مرتبطة بالمشروع."
          icon={<ChartNoAxesColumnIncreasing className="size-5" />}
        />
        <StatCard
          title="الربح المتوقع"
          value={
            <span className="inline-flex items-center gap-1.5">
              <ArabicNumber value={invoice.expectedProfit} />
              <span className="text-base font-bold text-muted-foreground">
                ريال
              </span>
            </span>
          }
          hint="الربح بعد خصم المصاريف."
          icon={<ChartNoAxesColumnIncreasing className="size-5" />}
        />
        <StatCard
          title="حالة الفاتورة"
          value={invoiceStatusText}
          hint="تتحدث هذه البطاقة حسب فتح الرابط العام من صفحة العميل."
          icon={<Eye className="size-5" />}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <AIInsightCard
          label="تنبيه واصل"
          title="قراءة سريعة لوضع المشروع"
          description="بعد احتساب المصاريف، ربحك المتوقع من هذا المشروع هو 23,500 ريال. يمكنك إرسال تذكير قبل موعد الاستحقاق."
          badge={<StatusBadge status={invoiceViewed ? "تمت المشاهدة" : "لم تُشاهد بعد"} />}
          footer={
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href="/app/invoices/demo">فتح الفاتورة</Link>
              </Button>
              <Button asChild className="rounded-2xl">
                <Link href="/app/invoices/demo/follow-up">رسالة المتابعة</Link>
              </Button>
            </div>
          }
        />

        <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_20px_60px_-52px_rgba(0,72,54,0.28)]">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                ملخص الاتفاق الحالي
              </p>
              <h3 className="text-lg font-bold text-foreground">
                {invoice.clientName}
              </h3>
            </div>
            <StatusBadge status={invoice.paymentStatus} />
          </div>

          <dl className="mt-5 space-y-4 text-sm">
            <SummaryRow label="الخدمة" value={invoice.serviceName} />
            <SummaryRow label="موعد التسليم" value={invoice.deliveryDate} />
            <SummaryRow label="موعد الاستحقاق" value={invoice.dueDate} />
            <SummaryRow label="الرابط العام" value={invoiceStatusText} />
          </dl>
        </div>
      </section>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/40 px-4 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-bold text-foreground">{value}</dd>
    </div>
  );
}
