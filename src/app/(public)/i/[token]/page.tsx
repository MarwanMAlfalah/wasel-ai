"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  CircleDollarSign,
  MessageSquareMore,
} from "lucide-react";

import { ArabicNumber } from "@/components/shared/arabic-number";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  defaultTemporaryInvoiceData,
  getStoredInvoice,
  setInvoiceViewed,
  type TemporaryInvoiceData,
} from "@/lib/client-storage";

export default function PublicInvoicePage() {
  const params = useParams<{ token: string }>();
  const [invoice, setInvoice] = useState<TemporaryInvoiceData>(
    () => getStoredInvoice() ?? defaultTemporaryInvoiceData,
  );

  useEffect(() => {
    const token = params?.token ?? "demo-token";
    let isActive = true;

    async function loadAndTrackInvoice() {
      if (process.env.NEXT_PUBLIC_CONVEX_URL && token !== "demo-token") {
        try {
          const invoiceResponse = await fetch(`/api/public-invoices/${token}`);

          if (invoiceResponse.ok) {
            const invoicePayload = (await invoiceResponse.json()) as {
              invoice: {
                invoiceId: string;
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
                viewCount: number;
                firstViewedAt: number | null;
                lastViewedAt: number | null;
              };
            };

            if (isActive) {
              const nextInvoice: TemporaryInvoiceData = {
                ...invoice,
                id: invoicePayload.invoice.invoiceId,
                token: invoicePayload.invoice.token,
                invoiceNumber: invoicePayload.invoice.invoiceNumber,
                freelancerName: invoicePayload.invoice.freelancerName,
                clientName: invoicePayload.invoice.clientName,
                serviceName: invoicePayload.invoice.service,
                projectValue: invoicePayload.invoice.totalAmount,
                currencyLabel: invoicePayload.invoice.currency,
                currencyShort: invoicePayload.invoice.currency,
                amountPaid: invoicePayload.invoice.paidAmount,
                amountRemaining: invoicePayload.invoice.remainingAmount,
                deliveryDate: invoicePayload.invoice.deliveryDate ?? "",
                dueDate: invoicePayload.invoice.dueDate ?? "",
                paymentStatus:
                  invoicePayload.invoice.paymentStatus as TemporaryInvoiceData["paymentStatus"],
                viewCount: invoicePayload.invoice.viewCount,
                firstViewedAt: invoicePayload.invoice.firstViewedAt,
                lastViewedAt: invoicePayload.invoice.lastViewedAt,
              };

              setInvoice(nextInvoice);
            }
          }

          await fetch("/api/public-invoices/view", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });
        } catch {
          setInvoiceViewed(true);
        }
      } else {
        setInvoiceViewed(true);
      }
    }

    void loadAndTrackInvoice();

    return () => {
      isActive = false;
    };
  }, [invoice, params?.token]);

  return (
    <div className="flex flex-1 items-center justify-center py-8 sm:py-12">
      <section className="w-full max-w-3xl rounded-[2rem] border border-border/70 bg-card p-5 shadow-[0_28px_80px_-48px_rgba(0,72,54,0.32)] sm:p-7">
        <div className="flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              فاتورة من مروان
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              فاتورة من مروان
            </h1>
            <p className="text-sm leading-7 text-muted-foreground">
              هذه معاينة ثابتة للشكل العام للرابط العام الذي يستلمه العميل.
            </p>
          </div>
          <StatusBadge status={invoice.paymentStatus} />
        </div>

        <div className="mt-4 rounded-[1.25rem] border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700">
          تم تسجيل مشاهدة الفاتورة
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <PublicLine label="العميل" value={invoice.clientName} />
          <PublicLine label="الخدمة" value={invoice.serviceName} fullWidth />
          <PublicAmount
            label="الإجمالي"
            value={invoice.projectValue}
            currencyShort={invoice.currencyShort}
          />
          <PublicAmount
            label="المدفوع"
            value={invoice.amountPaid}
            currencyShort={invoice.currencyShort}
          />
          <PublicAmount
            label="المتبقي"
            value={invoice.amountRemaining}
            currencyShort={invoice.currencyShort}
          />
          <PublicLine label="موعد الدفع" value={invoice.dueDate} />
          <div className="sm:col-span-2 rounded-[1.25rem] border border-input bg-muted/40 px-4 py-4">
            <p className="text-sm font-medium text-muted-foreground">الحالة</p>
            <div className="mt-2">
              <StatusBadge status={invoice.paymentStatus} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button className="h-11 flex-1 rounded-2xl">
            <MessageSquareMore className="size-4" />
            تواصل مع المستقل
          </Button>
          <Button variant="outline" className="h-11 flex-1 rounded-2xl">
            <CheckCircle2 className="size-4" />
            تم الدفع
          </Button>
          <Button asChild variant="outline" className="h-11 flex-1 rounded-2xl">
            <Link href="/app">رجوع للوحة المستقل</Link>
          </Button>
        </div>

        <p className="mt-5 text-center text-sm leading-7 text-muted-foreground">
          هذه الفاتورة تم إنشاؤها بواسطة واصل AI بناءً على اتفاق الطرفين.
        </p>
      </section>
    </div>
  );
}

function PublicLine({
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

function PublicAmount({
  label,
  value,
  currencyShort,
}: {
  label: string;
  value: number;
  currencyShort: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-input bg-background px-4 py-4">
      <div className="flex items-center gap-2 text-primary">
        <CircleDollarSign className="size-4" />
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <ArabicNumber value={value} className="text-base font-bold text-foreground" />
        <span className="text-sm text-muted-foreground">{currencyShort}</span>
      </div>
    </div>
  );
}
