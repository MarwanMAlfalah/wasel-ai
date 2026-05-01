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
  broadcastInvoiceViewed,
  defaultTemporaryInvoiceData,
  getInvoiceViewStatus,
  getStoredInvoiceByToken,
  isLocalInvoiceToken,
  markStoredInvoiceViewed,
  upsertStoredInvoice,
  type TemporaryInvoiceData,
} from "@/lib/client-storage";

export default function PublicInvoicePage() {
  const params = useParams<{ token: string }>();
  const [invoice, setInvoice] =
    useState<TemporaryInvoiceData>(defaultTemporaryInvoiceData);
  const [viewRegistered, setViewRegistered] = useState(false);

  useEffect(() => {
    const token = params?.token ?? "demo-token";
    const storedInvoice =
      getStoredInvoiceByToken(token) ?? defaultTemporaryInvoiceData;
    let isActive = true;

    async function loadAndTrackInvoice() {
      queueMicrotask(() => {
        if (isActive) {
          setInvoice(storedInvoice);
        }
      });

      if (
        process.env.NEXT_PUBLIC_CONVEX_URL &&
        !isLocalInvoiceToken(token)
      ) {
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
                ...storedInvoice,
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
                invoiceViewStatus: getInvoiceViewStatus(
                  invoicePayload.invoice.viewCount,
                ),
                viewCount: invoicePayload.invoice.viewCount,
                firstViewedAt: invoicePayload.invoice.firstViewedAt,
                lastViewedAt: invoicePayload.invoice.lastViewedAt,
              };

              setInvoice(nextInvoice);
              upsertStoredInvoice(nextInvoice, { setLatest: false });
            }
          }

          const viewedInvoiceSessionKey = `viewed-invoice-token-${token}`;
          const alreadyViewedInSession =
            typeof window !== "undefined" &&
            window.sessionStorage.getItem(viewedInvoiceSessionKey) === "true";

          if (!alreadyViewedInSession) {
            if (typeof window !== "undefined") {
              window.sessionStorage.setItem(viewedInvoiceSessionKey, "pending");
            }

            const viewResponse = await fetch("/api/public-invoices/view", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token }),
            });

            if (!viewResponse.ok) {
              throw new Error("Track invoice view request failed");
            }

            const viewResult = (await viewResponse.json()) as {
              result: {
                invoiceId: string;
                viewCount: number;
                firstViewedAt: number | null;
                lastViewedAt: number;
              };
            };

            if (typeof window !== "undefined") {
              window.sessionStorage.setItem(viewedInvoiceSessionKey, "true");
            }

            if (isActive) {
              const baseInvoice = getStoredInvoiceByToken(token) ?? storedInvoice;
              const nextInvoice = {
                ...baseInvoice,
                id: viewResult.result.invoiceId,
                token,
                invoiceViewStatus: getInvoiceViewStatus(viewResult.result.viewCount),
                viewCount: viewResult.result.viewCount,
                firstViewedAt: viewResult.result.firstViewedAt,
                lastViewedAt: viewResult.result.lastViewedAt,
                updatedAt: viewResult.result.lastViewedAt,
              } satisfies TemporaryInvoiceData;

              upsertStoredInvoice(nextInvoice, { setLatest: false });
              broadcastInvoiceViewed(token);
              setViewRegistered(true);
              setInvoice((currentInvoice) => ({
                ...currentInvoice,
                ...nextInvoice,
              }));
            }
          }
        } catch {
          if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(`viewed-invoice-token-${token}`);
          }

          const localViewedInvoice = markStoredInvoiceViewed(token);

          if (isActive && localViewedInvoice) {
            broadcastInvoiceViewed(token);
            setInvoice(localViewedInvoice);
            setViewRegistered(true);
          }
        }
      } else {
        const viewedInvoiceSessionKey = `viewed-invoice-token-${token}`;
        const alreadyViewedInSession =
          typeof window !== "undefined" &&
          window.sessionStorage.getItem(viewedInvoiceSessionKey) === "true";

        if (!alreadyViewedInSession) {
          if (typeof window !== "undefined") {
            window.sessionStorage.setItem(viewedInvoiceSessionKey, "pending");
          }

          const localViewedInvoice = markStoredInvoiceViewed(token);

          if (isActive && localViewedInvoice) {
            if (typeof window !== "undefined") {
              window.sessionStorage.setItem(viewedInvoiceSessionKey, "true");
            }
            broadcastInvoiceViewed(token);
            setInvoice(localViewedInvoice);
            setViewRegistered(true);
          } else if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(viewedInvoiceSessionKey);
          }
        }
      }
    }

    void loadAndTrackInvoice();

    return () => {
      isActive = false;
    };
  }, [params?.token]);

  return (
    <div className="flex flex-1 items-center justify-center py-8 sm:py-12">
      <section className="w-full max-w-4xl rounded-[2.15rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,250,247,0.95))] p-5 shadow-[0_32px_82px_-54px_rgba(0,72,54,0.3)] sm:p-7">
        <div className="rounded-[1.9rem] bg-[linear-gradient(135deg,rgba(0,122,90,0.96),rgba(11,96,74,0.92))] px-5 py-6 text-primary-foreground shadow-[0_28px_64px_-42px_rgba(0,72,54,0.6)] sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary-foreground/76">
                فاتورة من {invoice.freelancerName}
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground">
                طلب دفع منظم وواضح
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-primary-foreground/84">
                هذه صفحة الفاتورة التي يستلمها العميل للاطلاع على تفاصيل الخدمة
                والمبلغ وحالة السداد بشكل بسيط ومهني.
              </p>
            </div>
            <StatusBadge
              status={invoice.paymentStatus}
              className="border-white/15 bg-white/12 text-primary-foreground"
            />
          </div>
        </div>

        {viewRegistered ? (
          <div className="mt-5 rounded-[1.35rem] border border-teal-200/80 bg-teal-50/90 px-4 py-3 text-sm font-medium text-teal-700">
            تم تسجيل مشاهدة الفاتورة
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[1.75rem] border border-white/70 bg-white/88 p-5 shadow-[0_18px_48px_-42px_rgba(0,72,54,0.16)]">
            <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  ملخص الفاتورة
                </p>
                <p className="mt-1 text-xl font-extrabold text-foreground">
                  {invoice.invoiceNumber}
                </p>
              </div>
              <StatusBadge status={invoice.paymentStatus} />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-white/70 bg-white/88 p-5 shadow-[0_18px_48px_-42px_rgba(0,72,54,0.16)]">
              <p className="text-sm font-medium text-muted-foreground">الحالة</p>
              <div className="mt-3 flex items-center justify-between gap-4 rounded-[1.3rem] border border-border/70 bg-background/90 px-4 py-4">
                <div className="space-y-1">
                  <p className="text-lg font-bold text-foreground">
                    {invoice.paymentStatus}
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    راجع المبلغ المتبقي وموعد الاستحقاق قبل تأكيد السداد.
                  </p>
                </div>
                <MessageSquareMore className="size-5 text-primary" />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-dashed border-primary/18 bg-[linear-gradient(180deg,rgba(0,122,90,0.06),rgba(255,255,255,0.84))] p-5 shadow-[0_18px_44px_-40px_rgba(0,72,54,0.14)]">
              <p className="text-sm font-bold text-foreground">
                ملاحظة مهمة للعميل
              </p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                إذا تم التحويل بالفعل، يكفي إرسال تأكيد للمستقل حتى يتم تحديث
                حالة الفاتورة والمتابعة بشكل أسرع.
              </p>
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

        <p className="mt-6 text-center text-sm leading-7 text-muted-foreground">
          هذه الفاتورة تم إنشاؤها بواسطة واصل AI لتقديم تفاصيل الاتفاق بشكل واضح
          ومرتب للطرفين.
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
      className={`rounded-[1.25rem] border border-input bg-background/90 px-4 py-4 ${
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
    <div className="rounded-[1.25rem] border border-input bg-background/90 px-4 py-4">
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
