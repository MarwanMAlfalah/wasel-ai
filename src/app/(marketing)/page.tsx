import Link from "next/link";
import {
  ArrowUpLeft,
  ChartNoAxesCombined,
  FileText,
  MessageSquareMore,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const featureCards = [
  {
    title: "استخراج ذكي من المحادثة",
    description:
      "يفهم تفاصيل الخدمة والمبلغ والدفعات من النص مباشرة، حتى لو كانت متفرقة داخل المحادثة.",
    icon: Sparkles,
  },
  {
    title: "فاتورة إلكترونية برابط قابل للمتابعة",
    description:
      "أنشئ فاتورة احترافية وارسل رابطًا واضحًا للعميل مع حالة مشاهدة تساعدك على المتابعة بثقة.",
    icon: FileText,
  },
  {
    title: "متابعة دفعات بدون إحراج",
    description:
      "جهز رسائل تذكير مناسبة لنبرة الاتفاق، بصياغة عربية مهنية ولطيفة تحفظ علاقتك مع العميل.",
    icon: MessageSquareMore,
  },
  {
    title: "ربح المشروع بعد المصاريف",
    description:
      "شاهد الصورة الحقيقية للمشروع بعد احتساب المصاريف والدفعات حتى تعرف ربحك المتوقع بدقة.",
    icon: ChartNoAxesCombined,
  },
] as const;

const workflowSteps = [
  "انسخ محادثة العميل من واتساب أو تليجرام",
  "راجع التفاصيل المستخرجة قبل اعتماد الفاتورة",
  "أرسل رابط الفاتورة وتابع حالة المشاهدة والدفعات",
] as const;

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col gap-10 py-10 sm:gap-14 sm:py-16">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-primary/15 bg-white/85 px-4 py-1.5 text-sm font-bold text-primary shadow-sm backdrop-blur">
            واصل AI للفريلانسر العربي
          </span>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.2] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              حوّل محادثات العملاء إلى فواتير جاهزة
            </h1>
            <p className="max-w-3xl text-lg leading-9 text-muted-foreground sm:text-xl">
              بدل ما تضيع تفاصيل الاتفاق داخل واتساب أو تليجرام، انسخ المحادثة
              وخلي واصل يستخرج الخدمة، المبلغ، الدفعات، موعد التسليم، ويجهز لك
              فاتورة قابلة للإرسال والمتابعة.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-2xl px-6 text-sm font-bold">
              <Link href="/app/new">ابدأ الآن</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-2xl px-6 text-sm font-bold"
            >
              <Link href="#features">شوف كيف يشتغل</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/70 bg-white/90 p-5 shadow-[0_28px_80px_-48px_rgba(0,72,54,0.35)] backdrop-blur sm:p-6">
          <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(0,122,90,0.98),rgba(0,92,69,0.88))] p-5 text-primary-foreground shadow-[0_24px_60px_-42px_rgba(0,72,54,0.75)]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm text-primary-foreground/80">
                  نموذج تجربة واصل
                </p>
                <h2 className="text-2xl font-extrabold">فاتورة من محادثة واحدة</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <ArrowUpLeft className="size-5" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {workflowSteps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                >
                  <p className="text-sm font-bold text-primary-foreground/85">
                    الخطوة {index + 1}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-primary-foreground">
                    {step}
                  </p>
                </div>
              ))}
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:col-span-2">
                <p className="text-sm font-bold text-primary-foreground/85">
                  نتيجة أوضح وأسرع
                </p>
                <p className="mt-2 text-sm leading-7 text-primary-foreground">
                  بدل الرجوع للمحادثة كل مرة، تكون الفاتورة والدفعات والرابط
                  ورسالة المتابعة جاهزة أمامك في مكان واحد.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        {featureCards.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_20px_60px_-52px_rgba(0,72,54,0.28)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {feature.description}
              </p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
