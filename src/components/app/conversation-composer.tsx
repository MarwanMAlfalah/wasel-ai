"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUp, ShieldCheck, Sparkles } from "lucide-react";

import { demoConversation } from "@/lib/demo-data";
import {
  extractionToTemporaryInvoice,
  setInvoiceViewed,
  setStoredConversation,
  setStoredExtraction,
  setStoredInvoice,
} from "@/lib/client-storage";
import { useToast } from "@/components/shared/toast-provider";
import { Button } from "@/components/ui/button";

export function ConversationComposer() {
  const [conversation, setConversation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  async function handleExtract() {
    const trimmedConversation = conversation.trim();

    if (!trimmedConversation) {
      showToast("أضف نص المحادثة أولًا");
      return;
    }

    try {
      setIsSubmitting(true);
      setStoredConversation(trimmedConversation);
      setInvoiceViewed(false);

      const response = await fetch("/api/ai/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationText: trimmedConversation,
        }),
      });

      if (!response.ok) {
        throw new Error("Extraction request failed");
      }

      const extractionResult = (await response.json()) as {
        data: import("@/lib/ai/types").ExtractedAgreement;
        provider: import("@/lib/ai/types").AIProviderName;
        fallbackUsed: boolean;
      };

      setStoredExtraction(extractionResult);
      setStoredInvoice(
        extractionToTemporaryInvoice(
          extractionResult.data,
          extractionResult.provider,
        ),
      );

      router.push("/app/extractions/demo");
    } catch {
      showToast("تعذر تحليل المحادثة حاليًا");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
      <section className="rounded-[1.85rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,251,249,0.95))] p-5 shadow-[0_22px_60px_-48px_rgba(0,72,54,0.24)] sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label htmlFor="conversation" className="text-sm font-bold text-foreground">
            نص المحادثة
          </label>
          <span className="inline-flex items-center rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
            يفضل تضمين السعر والدفعات والموعد
          </span>
        </div>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          الصق المحادثة كما هي، وواصل يرتب التفاصيل المهمة داخل شاشة مراجعة
          واضحة قبل إنشاء الفاتورة.
        </p>

        <label htmlFor="conversation" className="sr-only">
          نص المحادثة
        </label>
        <textarea
          id="conversation"
          value={conversation}
          onChange={(event) => setConversation(event.target.value)}
          placeholder="الصق هنا محادثة العميل كما هي، وسنستخدمها لاحقًا لاستخراج تفاصيل الاتفاق."
          className="mt-4 min-h-[340px] w-full rounded-[1.65rem] border border-input bg-background/90 px-4 py-4 text-sm leading-8 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
        />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-2xl px-5"
            onClick={() => setConversation(demoConversation)}
          >
            استخدم مثال جاهز
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled
            className="h-11 rounded-2xl px-5 disabled:opacity-100"
          >
            <ImageUp className="size-4" />
            <span>رفع صورة</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              قريبًا
            </span>
          </Button>
          <Button
            type="button"
            className="h-11 rounded-2xl px-5 text-sm font-bold"
            onClick={handleExtract}
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري تحليل المحادثة..." : "استخرج تفاصيل الاتفاق"}
          </Button>
        </div>
      </section>

      <div className="space-y-4">
        <aside className="rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,251,249,0.95))] p-5 shadow-[0_22px_54px_-48px_rgba(0,72,54,0.22)]">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">نصائح قبل الإرسال</p>
              <p className="text-sm text-muted-foreground">
                تجهيز أفضل لاستخراج أوضح
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            <li>انسخ النص كامل من واتساب أو تليجرام</li>
            <li>تأكد أن المحادثة تحتوي على السعر والدفعات والمواعيد</li>
            <li>واصل يفهم اللهجات العربية والمصطلحات المالية</li>
          </ul>
        </aside>

        <aside className="rounded-[1.8rem] border border-dashed border-primary/18 bg-[linear-gradient(180deg,rgba(0,122,90,0.06),rgba(255,255,255,0.82))] p-5 shadow-[0_20px_54px_-48px_rgba(0,72,54,0.16)]">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
              <ShieldCheck className="size-5" />
            </span>
            <div className="space-y-2">
              <p className="text-sm font-bold text-foreground">ملاحظة الخصوصية</p>
              <p className="text-sm leading-7 text-muted-foreground">
                ما نحفظ المحادثة الأصلية. نحفظ فقط البيانات اللي تؤكدها بنفسك.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
