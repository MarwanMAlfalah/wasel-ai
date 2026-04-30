"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
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
  buildPublicInvoiceUrl,
  defaultTemporaryInvoiceData,
  getInvoiceViewed,
  getStoredInvoice,
  type TemporaryInvoiceData,
} from "@/lib/client-storage";

export default function InvoiceDetailPage() {
  const [invoice] = useState<TemporaryInvoiceData>(
    () => getStoredInvoice() ?? defaultTemporaryInvoiceData,
  );
  const [invoiceViewed] = useState(() => getInvoiceViewed());
  const { showToast } = useToast();
  const publicInvoiceUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/i/demo-token`
    : "/i/demo-token";

  async function handleCopyInvoiceLink() {
    const publicUrl = buildPublicInvoiceUrl();
    await navigator.clipboard.writeText(publicUrl);
    showToast("تم نسخ رابط الفاتورة");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="الفاتورة جاهزة"
        description="هذه صفحة ثابتة لعرض شكل الفاتورة الداخلية والرابط الذكي والملخص المالي قبل ربطها بالبيانات الفعلية."
        badge={<StatusBadge status={invoice.paymentStatus} />}
      />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_20px_60px_-52px_rgba(0,72,54,0.28)]">
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
              value={invoice.projectValue}
              currencyShort={invoice.currencyShort}
              emphasis
            />
            <InvoiceAmount
              label="المدفوع"
              value={invoice.amountPaid}
              currencyShort={invoice.currencyShort}
            />
            <InvoiceAmount
              label="المتبقي"
              value={invoice.amountRemaining}
              currencyShort={invoice.currencyShort}
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
          <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_20px_60px_-52px_rgba(0,72,54,0.28)]">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">
                رابط الفاتورة الذكي
              </h3>
              <p className="text-sm leading-7 text-muted-foreground">
                أرسل الرابط للعميل. إذا فتحه، بنوضح لك أن الفاتورة تمت مشاهدتها.
              </p>
            </div>

            <div className="mt-4 rounded-[1.25rem] border border-dashed border-primary/20 bg-primary/5 px-4 py-4">
              <p className="text-sm font-bold text-foreground">
                {publicInvoiceUrl}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {invoiceViewed ? "تمت مشاهدة الفاتورة" : "لم يشاهدها العميل بعد"}
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                className="h-11 rounded-2xl"
                onClick={handleCopyInvoiceLink}
              >
                <Copy className="size-4" />
                انسخ رابط الفاتورة
              </Button>
              <Button asChild className="h-11 rounded-2xl">
                <Link href="/i/demo-token">
                  <ExternalLink className="size-4" />
                  فتح رابط الفاتورة
                </Link>
              </Button>
              <Button variant="outline" className="h-11 rounded-2xl">
                <Download className="size-4" />
                تحميل PDF
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-2xl">
                <Link href="/app/invoices/demo/follow-up">
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
            badge={<StatusBadge status={invoiceViewed ? "تمت المشاهدة" : "لم تُشاهد بعد"} />}
          />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <InfoCard
          icon={<WalletCards className="size-5" />}
          title="الدفعات المسجلة"
          lines={[
            `دفعة أولى: ${invoice.amountPaid.toLocaleString("en-US")} ${invoice.currencyShort}`,
            "تاريخ التسجيل: 1 ديسمبر 2026",
            "الوصف: عربون بدء المشروع",
          ]}
        />
        <InfoCard
          icon={<FileText className="size-5" />}
          title="مصاريف المشروع"
          lines={[
            "اشتراك أدوات التصميم: 500 ريال",
            "شراء أصول واجهة: 1,000 ريال",
            `الإجمالي: ${invoice.projectExpenses.toLocaleString("en-US")} ${invoice.currencyShort}`,
          ]}
        />
        <InfoCard
          icon={<CalendarClock className="size-5" />}
          title="النشاط الأخير"
          lines={[
            "تم تجهيز الفاتورة الداخلية",
            invoiceViewed ? "تم تسجيل مشاهدة الرابط العام" : "بانتظار فتح الرابط من العميل",
            "رسالة المتابعة الجاهزة متاحة للإرسال",
          ]}
        />
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
      className={`rounded-[1.25rem] border border-input bg-background px-4 py-4 ${
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
    <div className="rounded-[1.25rem] border border-input bg-background px-4 py-4">
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
    <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_20px_60px_-52px_rgba(0,72,54,0.28)]">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </span>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
