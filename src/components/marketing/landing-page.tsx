"use client";

import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import type { Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useState } from "react";

import { DeviceFrame } from "@/components/marketing/device-frame";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import {
  DashboardScreenPreview,
  SummaryScreenPreview,
} from "@/components/marketing/mock-screens";
import { BrandMark } from "@/components/shared/brand-mark";
import { StoryScrollSection } from "@/components/marketing/story-scroll-section";
import { Button } from "@/components/ui/button";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const heroHighlights = [
  ["استخراج أوضح", "يفهم الاتفاق كما كُتب"],
  ["فاتورة أهدأ", "رابط منظم للعميل"],
  ["متابعة أسرع", "رسالة جاهزة عند الحاجة"],
] as const;

const trustStripCards = [
  {
    title: "واجهة عربية من البداية",
    description: "تجربة RTL هادئة ومفهومة للمستقل العربي.",
  },
  {
    title: "روابط فواتير ذكية",
    description: "اعرف إذا العميل فتح الفاتورة بدون تخمين.",
  },
  {
    title: "متابعة تحافظ على الأسلوب",
    description: "رسائل جاهزة بنبرة مهنية تناسب الاتفاق.",
  },
  {
    title: "ملخص مالي أوضح",
    description: "مصروف، متبقٍ، وربح متوقع في مشهد واحد.",
  },
] as const;

const appFeatureBullets = [
  "واجهة عربية واضحة",
  "روابط فواتير ذكية",
  "متابعة أوضح للدفعات",
  "رسائل متابعة جاهزة",
  "ملخص مالي سريع",
] as const;

const pricingPlans = [
  {
    name: "المجانية",
    monthlyPrice: "مجانية",
    yearlyPrice: "مجانية",
    description: "للتجربة السريعة",
    cta: "ابدأ مجانًا",
    features: [
      "5 فواتير شهريًا",
      "10 عمليات استخراج AI",
      "10 رسائل متابعة",
      "رابط فاتورة قابل للمشاركة",
      "علامة واصل على الفاتورة",
    ],
  },
  {
    name: "البداية",
    monthlyPrice: "29 ريال / شهريًا",
    yearlyPrice: "25 ريال / شهريًا",
    description: "للمستقلين في بداية الطريق",
    cta: "ابدأ بخطة البداية",
    features: [
      "30 فاتورة شهريًا",
      "100 عملية AI",
      "روابط بدون علامة مائية",
      "تتبع مشاهدة الفاتورة",
      "تحميل PDF",
    ],
  },
  {
    name: "المحترف",
    monthlyPrice: "79 ريال / شهريًا",
    yearlyPrice: "67 ريال / شهريًا",
    description: "الأفضل للمستقل النشط",
    badge: "الأكثر مناسبة",
    featured: true,
    cta: "ابدأ كمحترف",
    features: [
      "150 فاتورة شهريًا",
      "500 عملية AI",
      "مصاريف وربح متوقع",
      "رسائل متابعة حسب نبرة الاتفاق",
      "قوالب واتساب جاهزة",
      "تصدير PDF احترافي",
    ],
  },
  {
    name: "الفريق",
    monthlyPrice: "199 ريال / شهريًا",
    yearlyPrice: "169 ريال / شهريًا",
    description: "للفرق الصغيرة والاستوديوهات",
    cta: "ابدأ مع فريقك",
    features: [
      "3 أعضاء فريق",
      "500 فاتورة شهريًا",
      "2000 عملية AI",
      "مساحات عمل متعددة",
      "صلاحيات وأدوار",
      "تقارير شهرية",
    ],
  },
] as const;

const enterprisePlan = {
  name: "الأعمال",
  monthlyPrice: "حسب الطلب",
  yearlyPrice: "حسب الطلب",
  description: "للوكالات والمنشآت",
  cta: "تواصل معنا",
  features: [
    "عدد فواتير مخصص",
    "API",
    "ربط محاسبي",
    "هوية مخصصة للفواتير",
    "دعم مخصص",
  ],
} as const;

export function LandingPage() {
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const nextScrolled = latest > 28;
    setIsScrolled((current) => (current === nextScrolled ? current : nextScrolled));
  });

  return (
    <div className="relative text-[#0B2D26]">
      <Header isScrolled={isScrolled} />

      <HeroSection />
      <TrustStripSection />
      <StoryScrollSection />
      <FeaturesSection />
      <AppExperienceSection />
      <PricingSection isYearly={isYearly} onToggle={setIsYearly} />
      <FaqSection />
      <FinalCtaSection />
      <FooterSection />

      {!shouldReduceMotion ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-6 left-6 hidden rounded-full border border-[#E8E3D6] bg-white/94 px-4 py-2 text-xs font-bold text-[#007A5A] shadow-[0_18px_38px_-30px_rgba(11,45,38,0.18)] backdrop-blur md:block"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: isScrolled ? 1 : 0, y: isScrolled ? 0 : 18 }}
        >
          واصل يرتب المحادثة والفاتورة والمتابعة في مكان واحد
        </motion.div>
      ) : null}
    </div>
  );
}

function Header({ isScrolled }: { isScrolled: boolean }) {
  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: isScrolled
          ? "rgba(247,246,237,0.96)"
          : "rgba(247,246,237,0.78)",
        borderColor: isScrolled
          ? "rgba(232,227,214,1)"
          : "rgba(232,227,214,0.42)",
        boxShadow: isScrolled
          ? "0 18px 44px -40px rgba(11,45,38,0.24)"
          : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <BrandMark variant="header" />

        <nav className="hidden items-center gap-8 text-sm font-bold text-[#0B2D26] lg:flex">
          <Link href="#journey" className="transition-colors hover:text-[#007A5A]">
            الرحلة
          </Link>
          <Link href="#features" className="transition-colors hover:text-[#007A5A]">
            المميزات
          </Link>
          <Link href="#app-experience" className="transition-colors hover:text-[#007A5A]">
            تجربة التطبيق
          </Link>
          <Link href="#pricing" className="transition-colors hover:text-[#007A5A]">
            الأسعار
          </Link>
          <Link href="#faq" className="transition-colors hover:text-[#007A5A]">
            الأسئلة
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="hidden h-11 rounded-full border-[#E8E3D6] bg-white px-5 text-sm font-bold text-[#0B2D26] shadow-none hover:bg-[#FCFBF6] lg:inline-flex"
          >
            <Link href="/app">تسجيل الدخول</Link>
          </Button>
          <Button
            asChild
            className="h-11 rounded-full bg-[#007A5A] px-5 text-sm font-bold text-white shadow-[0_16px_28px_-18px_rgba(0,122,90,0.38)] hover:bg-[#00684C]"
          >
            <Link href="/app/new">ابدأ الآن</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

function HeroSection() {
  return (
    <section className="overflow-hidden pt-8 sm:pt-10 lg:pt-14">
      <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-4 pb-24 sm:px-6 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:px-10 lg:pb-28">
        <Reveal className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E3D6] bg-white/92 px-4 py-2 text-sm font-bold text-[#007A5A] shadow-sm">
            <Sparkles className="size-4" />
            واصل AI للمستقل العربي
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0B2D26] sm:text-5xl lg:text-[4.5rem]">
              حوّل اتفاق العميل إلى فاتورة واضحة ومتابعة أذكى
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#697C75] sm:text-xl sm:leading-9">
              واصل يهدّئ الفوضى المعتادة بين المحادثة والفاتورة والمتابعة. تنسخ
              الاتفاق كما هو، ثم تحصل على تفاصيل مرتبة، رابط فاتورة أوضح، ورسالة
              متابعة جاهزة عندما تحتاجها.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-full bg-[#007A5A] px-6 text-sm font-bold text-white shadow-[0_18px_34px_-20px_rgba(0,122,90,0.36)] hover:bg-[#00684C]"
            >
              <Link href="/app/new">ابدأ الآن</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-[#E8E3D6] bg-white/92 px-6 text-sm font-bold text-[#0B2D26] hover:bg-[#FCFBF6]"
            >
              <Link href="#features">استكشف المميزات</Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {heroHighlights.map(([title, description]) => (
              <div
                key={title}
                className="rounded-[1.75rem] border border-[#E8E3D6] bg-white/90 px-4 py-4 shadow-[0_18px_40px_-34px_rgba(11,45,38,0.12)]"
              >
                <p className="text-sm font-extrabold text-[#0B2D26]">{title}</p>
                <p className="mt-1 text-sm leading-7 text-[#697C75]">{description}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative overflow-hidden rounded-[2.8rem] border border-[#E8E3D6] bg-white/84 p-5 shadow-[0_42px_100px_-62px_rgba(11,45,38,0.2)] sm:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(238,248,241,0.95),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(0,122,90,0.06),transparent_28%)]" />
            <div className="relative grid items-center gap-5 lg:grid-cols-[0.58fr_0.42fr]">
              <div className="space-y-4">
                <div className="rounded-[2rem] border border-[#E8E3D6] bg-[#FDFCF8] p-5">
                  <p className="text-sm font-bold text-[#007A5A]">من المحادثة إلى الفاتورة</p>
                  <h2 className="mt-2 text-2xl font-extrabold leading-tight text-[#0B2D26]">
                    مشهد واحد مرتب بدل تنقل بين أدوات كثيرة
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#697C75]">
                    تفاصيل الاتفاق، حالة الفاتورة، والمتابعة تظهر لك بشكل متماسك
                    ومن غير زحمة.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <HeroMiniCard
                    label="تم استخراج الاتفاق"
                    value="الخدمة، الدفعة، الموعد"
                  />
                  <HeroMiniCard label="آخر حالة" value="تمت مشاهدة الفاتورة" />
                  <HeroMiniCard label="الربح المتوقع" value="22,700 ريال" tone="mint" />
                </div>
              </div>

              <div className="mx-auto w-full max-w-[21rem]">
                <DeviceFrame label="داخل تطبيق واصل" className="max-w-[21rem]">
                  <SummaryScreenPreview />
                </DeviceFrame>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TrustStripSection() {
  return (
    <section className="pb-8">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trustStripCards.map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-[#E8E3D6] bg-white/84 px-5 py-5 shadow-[0_20px_50px_-42px_rgba(11,45,38,0.12)]"
              >
                <p className="text-base font-extrabold text-[#0B2D26]">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-[#697C75]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="mx-auto w-full max-w-[1280px] px-4 py-24 sm:px-6 lg:px-10">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold tracking-[0.24em] text-[#007A5A]">
          المميزات
        </p>
        <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#0B2D26] sm:text-4xl">
          مميزات تسهّل شغلك اليومي
        </h2>
        <p className="mt-4 text-base leading-8 text-[#697C75] sm:text-lg">
          كل بطاقة هنا تمثل شيء فعلي تحتاجه كمستقل: استخراج، فاتورة، متابعة،
          ووضوح مالي أفضل.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        <Reveal>
          <FeatureCard
            title="استخراج ذكي من المحادثة"
            description="يفهم تفاصيل الاتفاق حتى لو كانت مكتوبة بأسلوب يومي."
            visual={<MiniChatVisual />}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <FeatureCard
            title="رابط فاتورة قابل للتتبع"
            description="تابع إذا العميل فتح الفاتورة أو لا."
            visual={<MiniInvoiceVisual />}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <FeatureCard
            title="رسالة متابعة مناسبة"
            description="صياغة مهنية جاهزة للنسخ والإرسال."
            visual={<MiniFollowUpVisual />}
          />
        </Reveal>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Reveal delay={0.12}>
          <FeatureCard
            wide
            title="مصاريف وربح متوقع"
            description="أضف المصاريف وخذ صورة أوضح عن ربح المشروع."
            visual={<MiniProfitVisual />}
          />
        </Reveal>
        <Reveal delay={0.16}>
          <FeatureCard
            wide
            title="رحلة منظمة من أول اتفاق إلى آخر متابعة"
            description="المحادثة، الاستخراج، الفاتورة، المتابعة، والربح في مكان واحد."
            visual={<MiniJourneyVisual />}
          />
        </Reveal>
      </div>
    </section>
  );
}

function AppExperienceSection() {
  return (
    <section id="app-experience" className="py-24">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
        <div className="overflow-hidden rounded-[2.8rem] border border-[#E8E3D6] bg-white/82 p-6 shadow-[0_42px_90px_-62px_rgba(11,45,38,0.16)] sm:p-8 lg:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div className="mx-auto w-full max-w-[23rem]">
                <DeviceFrame label="تجربة التطبيق" className="max-w-[23rem]">
                  <DashboardScreenPreview />
                </DeviceFrame>
              </div>
            </Reveal>

            <Reveal className="space-y-7">
              <div className="space-y-4">
                <p className="text-sm font-bold tracking-[0.24em] text-[#007A5A]">
                  تجربة التطبيق
                </p>
                <h2 className="max-w-xl text-3xl font-extrabold leading-tight text-[#0B2D26] sm:text-4xl">
                  تجربة أقرب لتطبيق جوال
                </h2>
                <p className="max-w-2xl text-base leading-8 text-[#697C75] sm:text-lg">
                  صممنا واصل عشان يكون خفيف، واضح، ومريح للمستقل. كل شيء قدامك:
                  الاتفاق، الفاتورة، حالة الدفع، والمتابعة.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {appFeatureBullets.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-[1.45rem] border border-[#E8E3D6] bg-[#FDFCF8] px-4 py-3.5"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-[#EEF8F1] text-[#007A5A]">
                      <CheckCircle2 className="size-4" />
                    </span>
                    <span className="text-sm font-bold text-[#0B2D26]">{item}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-[2rem] border border-[#E8E3D6] bg-[#FDFCF8] p-5 shadow-[0_20px_50px_-42px_rgba(11,45,38,0.12)]">
                <div className="flex items-center justify-between gap-3 border-b border-[#E8E3D6] pb-4">
                  <div>
                    <p className="text-sm font-extrabold text-[#0B2D26]">
                      لقطة سريعة للمشروع
                    </p>
                    <p className="mt-1 text-sm leading-7 text-[#697C75]">
                      قبل أن ترسل متابعة جديدة، تشوف الوضع كامل بسرعة.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#EEF8F1] px-3 py-1 text-xs font-bold text-[#007A5A]">
                    اليوم
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <SupportMetric label="المتبقي" value="15,000 ريال" />
                  <SupportMetric label="المصاريف" value="2,300 ريال" />
                  <SupportMetric label="الربح المتوقع" value="22,700 ريال" tone="mint" />
                </div>

                <div className="mt-4 rounded-[1.6rem] border border-[#E8E3D6] bg-white px-4 py-4">
                  <p className="text-sm font-bold text-[#0B2D26]">
                    العميل فتح الفاتورة، والوقت الآن مناسب لمتابعة لطيفة وواضحة.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection({
  isYearly,
  onToggle,
}: {
  isYearly: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold tracking-[0.24em] text-[#007A5A]">
            الأسعار
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#0B2D26] sm:text-4xl">
            باقات تناسب طريقة شغلك
          </h2>
          <p className="mt-4 text-base leading-8 text-[#697C75] sm:text-lg">
            ابدأ مجانًا، وإذا كبر شغلك خذ الخطة اللي تعطيك متابعة أوضح ووقت أقل
            على الفواتير.
          </p>
        </Reveal>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full border border-[#E8E3D6] bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => onToggle(false)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                !isYearly ? "bg-[#007A5A] text-white" : "text-[#697C75]"
              }`}
            >
              شهري
            </button>
            <button
              type="button"
              onClick={() => onToggle(true)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                isYearly ? "bg-[#007A5A] text-white" : "text-[#697C75]"
              }`}
            >
              سنوي وفر 15%
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pricingPlans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.04}>
              <PricingCard plan={plan} isYearly={isYearly} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.18} className="mt-5">
          <EnterpriseCard isYearly={isYearly} />
        </Reveal>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="mx-auto w-full max-w-[1100px] px-4 py-24 sm:px-6 lg:px-10">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold tracking-[0.24em] text-[#007A5A]">
          الأسئلة الشائعة
        </p>
        <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#0B2D26] sm:text-4xl">
          أسئلة شائعة
        </h2>
        <p className="mt-4 text-base leading-8 text-[#697C75] sm:text-lg">
          إجابات مختصرة على أكثر الأشياء التي تهم المستقل قبل أن يبدأ.
        </p>
      </Reveal>
      <div className="mt-10">
        <FaqAccordion />
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="pb-20">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="overflow-hidden rounded-[2.8rem] border border-[#D7E9DE] bg-[linear-gradient(135deg,#007A5A,#0B6C55)] px-6 py-10 text-white shadow-[0_44px_100px_-60px_rgba(0,122,90,0.28)] sm:px-10 sm:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-sm font-bold tracking-[0.24em] text-white/72">
                  جاهز للبدء
                </p>
                <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                  ابدأ من أول محادثة وخلك أوضح مع عميلك من البداية
                </h2>
                <p className="max-w-2xl text-sm leading-8 text-white/84 sm:text-base">
                  جرّب واصل على اتفاق حقيقي، وخذ فاتورة جاهزة، رابط متابعة،
                  ورسالة متابعة خلال دقائق.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Button
                  asChild
                  className="h-12 rounded-full bg-white px-6 text-sm font-bold text-[#007A5A] hover:bg-white/92"
                >
                  <Link href="/app/new">ابدأ الآن</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-white/18 bg-white/8 px-6 text-sm font-bold text-white hover:bg-white/14 hover:text-white"
                >
                  <Link href="#pricing">شوف الباقات</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="border-t border-[#E8E3D6] py-8">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <BrandMark variant="header" subtitle={false} />

        <div className="flex flex-col gap-2 text-sm text-[#697C75] sm:flex-row sm:items-center sm:gap-5">
          <Link href="#journey" className="transition-colors hover:text-[#007A5A]">
            الرحلة
          </Link>
          <Link href="#features" className="transition-colors hover:text-[#007A5A]">
            المميزات
          </Link>
          <Link href="#app-experience" className="transition-colors hover:text-[#007A5A]">
            تجربة التطبيق
          </Link>
          <Link href="#pricing" className="transition-colors hover:text-[#007A5A]">
            الأسعار
          </Link>
          <Link href="#faq" className="transition-colors hover:text-[#007A5A]">
            الأسئلة الشائعة
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-4 w-full max-w-[1280px] px-4 text-sm text-[#697C75] sm:px-6 lg:px-10">
        © 2026 واصل AI — تجربة عربية للمستقلين بواجهة أهدأ وأوضح
      </div>
    </footer>
  );
}

function HeroMiniCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "mint";
}) {
  return (
    <div
      className={`rounded-[1.7rem] border px-4 py-4 ${
        tone === "mint"
          ? "border-[#D7E9DE] bg-[#EEF8F1]"
          : "border-[#E8E3D6] bg-white"
      }`}
    >
      <p className="text-xs font-bold text-[#697C75]">{label}</p>
      <p className="mt-2 text-sm font-extrabold text-[#0B2D26]">{value}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  visual,
  wide = false,
}: {
  title: string;
  description: string;
  visual: ReactNode;
  wide?: boolean;
}) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.24 }}
      className={`overflow-hidden rounded-[2.35rem] border border-[#E8E3D6] bg-white/92 p-6 shadow-[0_26px_60px_-46px_rgba(11,45,38,0.14)] ${
        wide ? "min-h-[22rem]" : "min-h-[20rem]"
      }`}
    >
      <div className="flex h-full flex-col justify-between gap-8">
        <div className="space-y-3">
          <h3 className="text-2xl font-extrabold text-[#0B2D26]">{title}</h3>
          <p className="max-w-xl text-sm leading-7 text-[#697C75] sm:text-base">
            {description}
          </p>
        </div>
        {visual}
      </div>
    </motion.article>
  );
}

function MiniChatVisual() {
  return (
    <div className="rounded-[1.85rem] border border-[#E8E3D6] bg-[#FDFCF8] p-4">
      <div className="space-y-2.5">
        <div className="ms-auto max-w-[82%] rounded-[1.3rem] bg-white px-3 py-2.5 text-xs leading-6 text-[#0B2D26] shadow-sm">
          نحتاج تصميم واجهات التطبيق، العربون 10,000 والباقي عند التسليم.
        </div>
        <div className="me-auto max-w-[68%] rounded-[1.3rem] bg-[#EEF8F1] px-3 py-2.5 text-xs leading-6 text-[#007A5A]">
          تمام. الدفعة الأخيرة يوم 28.
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["الخدمة", "المبلغ", "الموعد"].map((item) => (
          <span
            key={item}
            className="rounded-full border border-[#D7E9DE] bg-white px-3 py-1 text-[11px] font-bold text-[#007A5A]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function MiniInvoiceVisual() {
  return (
    <div className="rounded-[1.85rem] border border-[#E8E3D6] bg-[#FDFCF8] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-[#0B2D26]">WA-320145</p>
        <span className="rounded-full bg-[#EEF8F1] px-2.5 py-1 text-[11px] font-bold text-[#007A5A]">
          تمت المشاهدة
        </span>
      </div>
      <div className="mt-4 rounded-[1.2rem] border border-[#E8E3D6] bg-white p-3">
        <div className="flex items-center justify-between text-xs text-[#697C75]">
          <span>رابط الفاتورة</span>
          <span className="font-bold text-[#0B2D26]">wasil.ai/i/wa...</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-[#E8E3D6]">
          <div className="h-2 w-[72%] rounded-full bg-[#007A5A]" />
        </div>
      </div>
      <p className="mt-3 text-xs leading-6 text-[#697C75]">
        رابط مرتب مع حالة مشاهدة تساعدك تختار توقيت المتابعة.
      </p>
    </div>
  );
}

function MiniFollowUpVisual() {
  return (
    <div className="rounded-[1.85rem] border border-[#E8E3D6] bg-[#FDFCF8] p-4">
      <div className="rounded-[1.35rem] border border-[#E8E3D6] bg-white px-3 py-3 text-xs leading-7 text-[#0B2D26]">
        هلا، حبيت أذكركم بالمبلغ المتبقي 15,000 ريال، وإذا تم التحويل يسعدني
        تأكيد الاستلام مباشرة.
      </div>
      <div className="mt-4 flex items-center justify-between rounded-[1.25rem] bg-[#EEF8F1] px-3 py-3">
        <p className="text-xs font-bold text-[#007A5A]">نبرة مهنية جاهزة للإرسال</p>
        <span className="text-[11px] text-[#697C75]">واتساب</span>
      </div>
    </div>
  );
}

function MiniProfitVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        ["المدفوع", "10,000 ريال"],
        ["المصاريف", "2,300 ريال"],
        ["الربح المتوقع", "22,700 ريال"],
      ].map(([label, value], index) => (
        <div
          key={label}
          className={`rounded-[1.7rem] border px-4 py-5 ${
            index === 2
              ? "border-[#D7E9DE] bg-[#EEF8F1]"
              : "border-[#E8E3D6] bg-[#FDFCF8]"
          }`}
        >
          <p className="text-xs font-medium text-[#697C75]">{label}</p>
          <p className="mt-2 text-lg font-extrabold text-[#0B2D26]">{value}</p>
        </div>
      ))}
    </div>
  );
}

function MiniJourneyVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {["المحادثة", "الاستخراج", "الفاتورة", "المتابعة"].map((item, index) => (
        <div key={item} className="relative rounded-[1.6rem] border border-[#E8E3D6] bg-[#FDFCF8] px-4 py-5">
          <span className="text-[11px] font-bold text-[#697C75]">0{index + 1}</span>
          <p className="mt-2 text-sm font-extrabold text-[#0B2D26]">{item}</p>
        </div>
      ))}
    </div>
  );
}

function SupportMetric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "mint";
}) {
  return (
    <div
      className={`rounded-[1.5rem] border px-4 py-4 ${
        tone === "mint"
          ? "border-[#D7E9DE] bg-[#EEF8F1]"
          : "border-[#E8E3D6] bg-white"
      }`}
    >
      <p className="text-xs font-medium text-[#697C75]">{label}</p>
      <p className="mt-2 text-sm font-extrabold text-[#0B2D26]">{value}</p>
    </div>
  );
}

function PricingCard({
  plan,
  isYearly,
}: {
  plan: (typeof pricingPlans)[number];
  isYearly: boolean;
}) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const isFeatured = "featured" in plan && Boolean(plan.featured);
  const badge = "badge" in plan ? plan.badge : undefined;

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.24 }}
      className={`flex h-full flex-col rounded-[2.4rem] border p-6 shadow-[0_26px_60px_-46px_rgba(11,45,38,0.14)] ${
        isFeatured
          ? "border-[#007A5A] bg-[#EEF8F1]"
          : "border-[#E8E3D6] bg-white/92"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-extrabold text-[#0B2D26]">{plan.name}</p>
          <p className="mt-2 text-sm leading-7 text-[#697C75]">{plan.description}</p>
        </div>
        {badge ? (
          <span className="rounded-full bg-[#007A5A] px-3 py-1 text-[11px] font-bold text-white">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-8">
        <p className="text-3xl font-extrabold text-[#0B2D26]">{price}</p>
        <p className="mt-2 text-xs font-bold text-[#697C75]">
          {isYearly && plan.monthlyPrice !== "مجانية"
            ? "السعر الشهري عند الدفع السنوي"
            : "كل ما تحتاجه لتبدأ بثقة"}
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-start gap-3">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#007A5A]">
              <CheckCircle2 className="size-4" />
            </span>
            <span className="text-sm leading-7 text-[#0B2D26]">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        asChild
        className={`mt-8 h-11 rounded-full text-sm font-bold ${
          isFeatured
            ? "bg-[#007A5A] text-white hover:bg-[#00684C]"
            : "bg-[#0B2D26] text-white hover:bg-[#123a32]"
        }`}
      >
        <Link href="/app/new">{plan.cta}</Link>
      </Button>
    </motion.article>
  );
}

function EnterpriseCard({ isYearly }: { isYearly: boolean }) {
  const price = isYearly ? enterprisePlan.yearlyPrice : enterprisePlan.monthlyPrice;

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.24 }}
      className="grid gap-6 rounded-[2.4rem] border border-[#E8E3D6] bg-white/92 p-6 shadow-[0_26px_60px_-46px_rgba(11,45,38,0.14)] lg:grid-cols-[0.42fr_0.58fr]"
    >
      <div>
        <p className="text-lg font-extrabold text-[#0B2D26]">{enterprisePlan.name}</p>
        <p className="mt-2 text-sm leading-7 text-[#697C75]">
          {enterprisePlan.description}
        </p>
        <p className="mt-6 text-3xl font-extrabold text-[#0B2D26]">{price}</p>
        <p className="mt-2 text-xs font-bold text-[#697C75]">
          حل مرن للفرق التي تحتاج تخصيصًا أكبر
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-8 h-11 rounded-full border-[#E8E3D6] bg-white px-6 text-sm font-bold text-[#0B2D26] hover:bg-[#FCFBF6]"
        >
          <Link href="/app/new">{enterprisePlan.cta}</Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {enterprisePlan.features.map((feature) => (
          <div
            key={feature}
            className="rounded-[1.5rem] border border-[#E8E3D6] bg-[#FDFCF8] px-4 py-4 text-sm font-bold text-[#0B2D26]"
          >
            {feature}
          </div>
        ))}
      </div>
    </motion.article>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.28 }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
