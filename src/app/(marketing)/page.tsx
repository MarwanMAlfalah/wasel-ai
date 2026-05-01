import Link from "next/link";
import {
  ArrowUpLeft,
  ChartNoAxesCombined,
  CheckCircle2,
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
    title: "فاتورة إلكترونية برابط واضح",
    description:
      "ينظم الاتفاق داخل فاتورة جاهزة للإرسال مع تصميم هادئ يناسب عرضها على العميل بثقة.",
    icon: FileText,
  },
  {
    title: "متابعة محترمة بدون إحراج",
    description:
      "يجهز رسالة متابعة مناسبة للنبرة والموعد والمبلغ المتبقي بصياغة عربية طبيعية.",
    icon: MessageSquareMore,
  },
  {
    title: "صورة مالية أوضح",
    description:
      "يعرض لك المدفوع والمتبقي وربح المشروع بعد المصاريف حتى تتخذ قرارك بسرعة.",
    icon: ChartNoAxesCombined,
  },
] as const;

const workflowSteps = [
  {
    title: "انسخ المحادثة",
    description:
      "خذ نص الاتفاق من واتساب أو تليجرام كما هو، بدون ترتيب يدوي ولا نقل التفاصيل سطرًا بسطر.",
  },
  {
    title: "راجع التفاصيل",
    description:
      "واصل يستخرج العميل والخدمة والمبلغ والدفعات والمواعيد داخل شاشة مراجعة واضحة وقابلة للتعديل.",
  },
  {
    title: "أرسل وتابع",
    description:
      "اعتمد الفاتورة، شارك الرابط الذكي، ثم استخدم رسالة متابعة جاهزة إذا بقي مبلغ غير مسدد.",
  },
] as const;

const heroTags = ["مدفوع جزئيًا", "15,000 ريال متبقي", "رابط ذكي"] as const;

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col pb-10 pt-6 sm:pb-14 sm:pt-8">
      <header className="flex items-center justify-between gap-4 py-4 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1.4rem] bg-primary text-lg font-extrabold text-primary-foreground shadow-[0_16px_26px_-16px_rgba(0,122,90,0.75)]">
            و
          </div>
          <div className="space-y-0.5">
            <p className="text-lg font-extrabold text-foreground">واصل AI</p>
            <p className="text-sm text-muted-foreground">
              منصة فواتير ومتابعة للفريلانسر العربي
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          className="hidden h-11 rounded-2xl px-5 text-sm font-bold sm:inline-flex"
        >
          <Link href="/app">فتح النسخة التجريبية</Link>
        </Button>
      </header>

      <section className="grid gap-8 py-8 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:gap-10 lg:py-14">
        <div className="order-2 lg:order-1">
          <HeroVisual />
        </div>

        <div className="order-1 space-y-6 lg:order-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/12 bg-white/88 px-4 py-2 text-sm font-bold text-primary shadow-sm backdrop-blur">
            <Sparkles className="size-4" />
            واصل AI للفريلانسر السعودي
          </span>

          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.2] tracking-tight text-foreground sm:text-5xl lg:text-[3.7rem]">
              حوّل محادثات العملاء إلى فواتير جاهزة
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
              بدل ما تضيع تفاصيل الاتفاق داخل واتساب أو تليجرام، انسخ المحادثة
              وخلي واصل يستخرج الخدمة، المبلغ، الدفعات، موعد التسليم، ويجهز لك
              فاتورة قابلة للإرسال والمتابعة.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-2xl px-6 text-sm font-bold shadow-[0_20px_34px_-20px_rgba(0,122,90,0.72)]"
            >
              <Link href="/app/new">ابدأ الآن</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-2xl px-6 text-sm font-bold"
            >
              <Link href="#how-it-works">شوف كيف يشتغل</Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {heroTags.map((tag) => (
              <div
                key={tag}
                className="rounded-[1.35rem] border border-white/70 bg-white/82 px-4 py-3 text-sm font-bold text-foreground shadow-[0_18px_32px_-24px_rgba(0,72,54,0.18)] backdrop-blur"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="grid gap-4 py-6 md:grid-cols-2 xl:grid-cols-4"
      >
        {featureCards.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,252,250,0.95))] p-5 shadow-[0_20px_54px_-48px_rgba(0,72,54,0.22)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                <Icon className="size-5" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-foreground">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {feature.description}
              </p>
            </article>
          );
        })}
      </section>

      <section
        id="how-it-works"
        className="grid gap-6 py-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start"
      >
        <div className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(0,122,90,0.96),rgba(11,96,74,0.92))] p-6 text-primary-foreground shadow-[0_34px_84px_-58px_rgba(0,72,54,0.75)] sm:p-7">
          <p className="text-sm font-bold text-primary-foreground/75">
            كيف يعمل واصل؟
          </p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight">
            رحلة قصيرة من المحادثة إلى الفاتورة والمتابعة
          </h2>
          <p className="mt-4 text-sm leading-8 text-primary-foreground/84 sm:text-base">
            واصل مصمم ليقلل الفوضى اليومية في إدارة الاتفاقات. كل شيء يبدأ من
            النص الذي تتفق فيه مع العميل، ثم يتحول إلى شاشة مراجعة واضحة وفاتورة
            أنيقة ورابط قابل للمشاركة.
          </p>

          <div className="mt-6 rounded-[1.5rem] border border-white/12 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-primary-foreground/75">
                  مناسب للتسجيل السريع
                </p>
                <p className="mt-1 text-xl font-extrabold">مشهد واضح للديمو</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                <ArrowUpLeft className="size-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {workflowSteps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-[1.8rem] border border-white/70 bg-white/92 p-5 shadow-[0_20px_54px_-46px_rgba(0,72,54,0.2)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-extrabold text-primary">
                {index + 1}
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="rounded-[2.15rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,250,247,0.94))] px-6 py-8 shadow-[0_28px_72px_-54px_rgba(0,72,54,0.22)] sm:px-8 sm:py-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <p className="text-sm font-bold text-primary">جاهز للتجربة؟</p>
              <h2 className="text-3xl font-extrabold leading-tight text-foreground">
                انسخ محادثة واحدة وخل واصل يرتبها لك خلال دقائق
              </h2>
              <p className="max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
                الواجهة الحالية مصممة لتخدم ديمو سريع وواضح: محادثة، استخراج،
                مراجعة، فاتورة، ثم متابعة. بدون تعقيد وبدون ازدحام.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button
                asChild
                className="h-12 rounded-2xl px-6 text-sm font-bold shadow-[0_20px_34px_-20px_rgba(0,122,90,0.72)]"
              >
                <Link href="/app/new">ابدأ الآن</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-2xl px-6 text-sm font-bold"
              >
                <Link href="/app">شوف النسخة التجريبية</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/70 py-6 text-sm text-muted-foreground">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>واصل AI، تجربة عربية هادئة لتنظيم الاتفاقات والفواتير.</p>
          <div className="flex items-center gap-2 text-foreground">
            <CheckCircle2 className="size-4 text-primary" />
            <span className="font-medium">جاهز لتسجيل ديمو الهاكاثون</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative min-h-[420px] rounded-[2.3rem] border border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.84),rgba(231,248,239,0.92))] p-5 shadow-[0_34px_84px_-58px_rgba(0,72,54,0.34)] sm:min-h-[500px] sm:p-6">
      <FloatingTag className="right-6 top-7">مدفوع جزئيًا</FloatingTag>
      <FloatingTag className="left-8 top-16">15,000 ريال متبقي</FloatingTag>
      <FloatingTag className="left-12 bottom-8">رابط ذكي</FloatingTag>

      <div className="absolute inset-x-10 top-16 rounded-[1.8rem] border border-white/70 bg-white/92 p-4 shadow-[0_20px_44px_-28px_rgba(0,72,54,0.2)] backdrop-blur sm:inset-x-12">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">بطاقة الاتفاق</p>
            <p className="text-xs text-muted-foreground">
              محادثة مختصرة تتحول إلى بيانات منظمة
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            واتساب
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <ChatBubble align="end">
            يا هلا، الاتفاق على تصميم الهوية بـ 25,000 ريال
          </ChatBubble>
          <ChatBubble align="start">
            ممتاز، دفعنا 10,000 والباقي عند التسليم يوم 2026-05-12
          </ChatBubble>
          <ChatBubble align="end">تم، وبرسل لكم الفاتورة والرابط اليوم</ChatBubble>
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-8 rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,250,247,0.96))] p-5 shadow-[0_28px_60px_-34px_rgba(0,72,54,0.2)] sm:inset-x-12 sm:bottom-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-foreground">معاينة الفاتورة</p>
            <p className="text-xs text-muted-foreground">
              تم استخراج العميل والخدمة والدفعات والمواعيد
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText className="size-5" />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <VisualMetric label="العميل" value="شركة المدار" />
          <VisualMetric label="الخدمة" value="تصميم هوية" />
          <VisualMetric label="الإجمالي" value="25,000 ريال" />
          <VisualMetric label="المتبقي" value="15,000 ريال" />
        </div>
      </div>
    </div>
  );
}

function FloatingTag({
  children,
  className,
}: {
  children: string;
  className: string;
}) {
  return (
    <div
      className={`absolute z-10 rounded-full border border-white/80 bg-white/92 px-4 py-2 text-sm font-bold text-foreground shadow-[0_18px_34px_-22px_rgba(0,72,54,0.2)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

function ChatBubble({
  children,
  align,
}: {
  children: string;
  align: "start" | "end";
}) {
  return (
    <div
      className={`max-w-[88%] rounded-[1.35rem] px-4 py-3 text-sm leading-7 shadow-sm ${
        align === "end"
          ? "mr-auto bg-primary text-primary-foreground"
          : "ml-auto border border-border/70 bg-background text-foreground"
      }`}
    >
      {children}
    </div>
  );
}

function VisualMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-border/70 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
