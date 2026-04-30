"use client";

import { useState } from "react";
import { Copy, PencilLine, WalletCards } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { ToneBadge } from "@/components/shared/tone-badge";
import { useToast } from "@/components/shared/toast-provider";
import { Button } from "@/components/ui/button";
import {
  buildFollowUpMessage,
  defaultTemporaryInvoiceData,
  getStoredInvoice,
  type TemporaryInvoiceData,
} from "@/lib/client-storage";

export default function FollowUpPage() {
  const [invoice] = useState<TemporaryInvoiceData>(
    () => getStoredInvoice() ?? defaultTemporaryInvoiceData,
  );
  const { showToast } = useToast();

  const followUpMessage = buildFollowUpMessage(invoice);

  async function handleCopyMessage() {
    await navigator.clipboard.writeText(followUpMessage);
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

          <div className="mt-4 rounded-[1.5rem] border border-input bg-background px-4 py-4">
            <p className="whitespace-pre-line text-sm leading-8 text-foreground">
              {followUpMessage}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button className="h-11 rounded-2xl px-5" onClick={handleCopyMessage}>
              <Copy className="size-4" />
              نسخ الرسالة
            </Button>
            <Button variant="outline" className="h-11 rounded-2xl px-5">
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
              لأن الاتفاق الأصلي كان مهنيًا وواضحًا، فهذه الصياغة تذكّر العميل
              بالمبلغ المتبقي وموعد السداد بدون ضغط زائد.
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
