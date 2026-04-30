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
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_20px_60px_-52px_rgba(0,72,54,0.28)]">
        <label htmlFor="conversation" className="text-sm font-bold text-foreground">
          نص المحادثة
        </label>
        <textarea
          id="conversation"
          value={conversation}
          onChange={(event) => setConversation(event.target.value)}
          placeholder="الصق هنا محادثة العميل كما هي، وسنستخدمها لاحقًا لاستخراج تفاصيل الاتفاق."
          className="mt-3 min-h-[320px] w-full rounded-[1.5rem] border border-input bg-background px-4 py-4 text-sm leading-8 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
        <aside className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_20px_60px_-52px_rgba(0,72,54,0.28)]">
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

        <aside className="rounded-[1.75rem] border border-dashed border-primary/20 bg-primary/5 p-5 shadow-[0_20px_60px_-52px_rgba(0,72,54,0.18)]">
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
