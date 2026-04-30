"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, PencilLine, WalletCards } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { ToneBadge } from "@/components/shared/tone-badge";
import { useToast } from "@/components/shared/toast-provider";
import { Button } from "@/components/ui/button";
import {
  defaultTemporaryInvoiceData,
  getStoredExtraction,
  getStoredInvoice,
  type TemporaryInvoiceData,
} from "@/lib/client-storage";
import type { FollowUpInput } from "@/lib/ai/types";

export default function FollowUpPage() {
  const [invoice] = useState<TemporaryInvoiceData>(
    () => getStoredInvoice() ?? defaultTemporaryInvoiceData,
  );
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    let isActive = true;

    async function loadFollowUpMessage() {
      const extraction = getStoredExtraction();

      const followUpInput: FollowUpInput = {
        clientName: invoice.clientName ?? null,
        service: invoice.serviceName ?? null,
        remainingAmount: invoice.amountRemaining ?? null,
        currency: invoice.currencyShort ?? null,
        dueDate: invoice.dueDate ?? null,
        paymentStatus: invoice.paymentStatus ?? null,
        agreementTone: extraction?.data.agreementTone ?? null,
        clientUrgency: extraction?.data.clientUrgency ?? null,
        followUpStyle: extraction?.data.followUpStyle ?? null,
      };

      try {
        const response = await fetch("/api/ai/follow-up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoiceData: followUpInput,
          }),
        });

        if (!response.ok) {
          throw new Error("Follow-up request failed");
        }

        const result = (await response.json()) as {
          message: string;
          provider: import("@/lib/ai/types").AIProviderName;
          fallbackUsed: boolean;
        };

        if (!isActive) {
          return;
        }

        setMessage(result.message);
        setFallbackUsed(result.fallbackUsed);
      } catch {
        if (!isActive) {
          return;
        }

        setMessage("");
        setFallbackUsed(false);
        showToast("تعذر توليد رسالة المتابعة حاليًا");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadFollowUpMessage();

    return () => {
      isActive = false;
    };
  }, [invoice, showToast]);

  async function handleCopyMessage() {
    if (!message.trim()) {
      return;
    }

    await navigator.clipboard.writeText(message);
    showToast("تم نسخ رسالة المتابعة");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="رسالة متابعة جاهزة"
        description="واصل كتب لك رسالة مناسبة لنبرة الاتفاق. انسخها وأرسلها للعميل."
        badge={<ToneBadge tone="مهني" />}
      />

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_20px_60px_-52px_rgba(0,72,54,0.28)]">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              الرسالة المقترحة
            </p>
            <h3 className="text-lg font-bold text-foreground">
              صياغة جاهزة للنسخ والإرسال
            </h3>
          </div>

          {fallbackUsed ? (
            <div className="mt-4 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
              تم توليد رسالة افتراضية مؤقتًا بسبب تعذر الاتصال بالذكاء الاصطناعي
            </div>
          ) : null}

          {isLoading ? (
            <div className="mt-4 rounded-[1.5rem] border border-input bg-background px-4 py-5">
              <p className="text-sm leading-8 text-muted-foreground">
                واصل يكتب لك رسالة مناسبة…
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-[1.5rem] border border-input bg-background px-4 py-4">
              <textarea
                ref={textAreaRef}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="min-h-[220px] w-full resize-none bg-transparent text-sm leading-8 text-foreground outline-none"
              />
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              className="h-11 rounded-2xl px-5"
              onClick={handleCopyMessage}
              disabled={isLoading || !message.trim()}
            >
              <Copy className="size-4" />
              نسخ الرسالة
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-2xl px-5"
              onClick={() => textAreaRef.current?.focus()}
              disabled={isLoading}
            >
              <PencilLine className="size-4" />
              تعديل الرسالة
            </Button>
            <Button variant="outline" className="h-11 rounded-2xl px-5">
              <WalletCards className="size-4" />
              تم الدفع
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_20px_60px_-52px_rgba(0,72,54,0.28)]">
            <p className="text-sm font-medium text-muted-foreground">
              سبب هذا الأسلوب
            </p>
            <h3 className="mt-1 text-lg font-bold text-foreground">
              نبرة مهنية وواضحة
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              لأن الرسالة تُبنى على نبرة الاتفاق وحالة الدفع وموعد الاستحقاق،
              فهي تحافظ على الأسلوب المهني وتوضح المطلوب بدون إحراج.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-dashed border-primary/20 bg-primary/5 p-5 shadow-[0_20px_60px_-52px_rgba(0,72,54,0.18)]">
            <p className="text-sm font-bold text-foreground">ملاحظة واصل</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              لاحقًا ستتغير هذه الرسالة تلقائيًا بحسب حالة الفاتورة، موعد
              الاستحقاق، وهل العميل فتح الرابط أم لا.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
