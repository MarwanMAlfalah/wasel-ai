"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  BellRing,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  FolderKanban,
  Languages,
  LayoutDashboard,
  Link2,
  MessageSquareText,
  Sparkles,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import type { Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { DeviceFrame } from "@/components/marketing/device-frame";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { DashboardScreenPreview } from "@/components/marketing/mock-screens";
import { StoryScrollSection } from "@/components/marketing/story-scroll-section";
import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const heroHighlights = [
  "استخراج أوضح",
  "فاتورة أهدأ",
  "متابعة أسرع",
] as const;

const navigationLinks = [
  { href: "#journey", label: "الرحلة" },
  { href: "#features", label: "المميزات" },
  { href: "#app-experience", label: "تجربة التطبيق" },
  { href: "#pricing", label: "الأسعار" },
  { href: "#faq", label: "الأسئلة" },
] as const;

const trustStripCards: ReadonlyArray<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "AI حقيقي",
    description: "استخراج فعلي للتفاصيل من صياغة العميل اليومية.",
    icon: Bot,
  },
  {
    title: "واجهة عربية RTL",
    description: "تجربة عربية هادئة ومسارات أوضح للمستقل.",
    icon: Languages,
  },
  {
    title: "بنية حديثة",
    description: "بنية حديثة تحفظ السرعة والتنظيم خلف الكواليس.",
    icon: LayoutDashboard,
  },
  {
    title: "رابط فاتورة قابل للتتبع",
    description: "حالة مشاهدة أوضح قبل أن ترسل المتابعة التالية.",
    icon: Link2,
  },
] as const;

const featureCards: ReadonlyArray<{
  title: string;
  description: string;
  icon: LucideIcon;
  visual: ReactNode;
  wide?: boolean;
}> = [
  {
    title: "استخراج ذكي من المحادثة",
    description: "يفهم تفاصيل الاتفاق حتى لو كانت مكتوبة بأسلوب يومي ومختصر.",
    icon: MessageSquareText,
    visual: <MiniChatVisual />,
  },
  {
    title: "رابط فاتورة قابل للتتبع",
    description: "شارك رابطًا أوضح من ملف PDF وتابع هل تمت المشاهدة أم لا.",
    icon: Link2,
    visual: <MiniInvoiceVisual />,
  },
  {
    title: "رسالة متابعة مناسبة",
    description: "صياغة مهنية جاهزة للنسخ والإرسال بنبرة عربية مرتبة.",
    icon: BellRing,
    visual: <MiniFollowUpVisual />,
  },
  {
    title: "مصاريف وربح متوقع",
    description: "أضف المصاريف وخذ صورة أسرع عن الربح المتوقع في نفس المسار.",
    icon: CircleDollarSign,
    visual: <MiniProfitVisual />,
    wide: true,
  },
  {
    title: "تنظيم العملاء والمشاريع",
    description: "المحادثة، الاستخراج، الفاتورة، والمتابعة في رحلة واضحة ومترابطة.",
    icon: FolderKanban,
    visual: <MiniJourneyVisual />,
    wide: true,
  },
] as const;

const appFeatureBullets: ReadonlyArray<{
  label: string;
  icon: LucideIcon;
}> = [
  { label: "واجهة عربية واضحة", icon: Languages },
  { label: "روابط فواتير ذكية", icon: Link2 },
  { label: "متابعة أوضح للدفعات", icon: BellRing },
  { label: "رسائل متابعة جاهزة", icon: MessageSquareText },
  { label: "ملخص مالي سريع", icon: WalletCards },
  { label: "تنظيم العملاء والمشاريع", icon: FolderKanban },
] as const;

const pricingPlans = [
  {
    name: "التجريبية",
    monthlyPrice: "مجانا",
    yearlyPrice: "مجانا",
    description: "للتجربة الأولى واكتشاف طريقة عمل واصل.",
    cta: "ابدأ مجانًا",
    features: [
      "5 عمليات استخراج شهريًا",
      "3 فواتير قابلة للمشاركة",
      "رسالة متابعة واحدة لكل فاتورة",
      "واجهة عربية كاملة",
    ],
  },
  {
    name: "المستقل",
    monthlyPrice: "49 ريال / شهريًا",
    yearlyPrice: "42 ريال / شهريًا",
    description: "للمستقلين اللي يديرون مشاريعهم بشكل يومي.",
    cta: "ابدأ باقة المستقل",
    badge: "الأكثر اختيارًا",
    featured: true,
    features: [
      "100 عملية استخراج شهريًا",
      "فواتير غير محدودة",
      "رسائل متابعة جاهزة",
      "تتبع مشاهدة رابط الفاتورة",
      "ملخص مالي بسيط",
    ],
  },
  {
    name: "الاحترافية",
    monthlyPrice: "99 ريال / شهريًا",
    yearlyPrice: "84 ريال / شهريًا",
    description: "للمستقل النشط أو الفريق الصغير.",
    cta: "ابدأ الباقة الاحترافية",
    features: [
      "300 عملية استخراج شهريًا",
      "نبرات متابعة متعددة",
      "تقارير ومؤشرات أوسع",
      "إدارة عدة عملاء ومشاريع",
      "أولوية في الدعم",
    ],
  },
  {
    name: "الأعمال",
    monthlyPrice: "299 ريال / شهريًا",
    yearlyPrice: "254 ريال / شهريًا",
    description: "للأعمال الصغيرة والفرق التي تحتاج استخدامًا أعلى.",
    cta: "تواصل معنا",
    features: [
      "عمليات استخراج أعلى أو غير محدودة حسب السياسة",
      "عدة مستخدمين",
      "صلاحيات وإدارة فريق",
      "تخصيص أكبر للنبرة والقوالب",
      "دعم مميز",
    ],
  },
] as const;

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
    <div className="relative text-[#14352E]">
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
          className="pointer-events-none fixed bottom-6 left-6 hidden rounded-full border border-[#DDE7DE] bg-white/94 px-4 py-2 text-xs font-bold text-[#0F8B6D] shadow-[0_18px_42px_-30px_rgba(20,53,46,0.18)] backdrop-blur md:block"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: isScrolled ? 1 : 0, y: isScrolled ? 0 : 18 }}
        >
          واصل يرتب المحادثة والفاتورة والمتابعة في مشهد واحد
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
          ? "rgba(245,243,236,0.96)"
          : "rgba(245,243,236,0.8)",
        borderColor: isScrolled
          ? "rgba(220,228,221,1)"
          : "rgba(220,228,221,0.56)",
        boxShadow: isScrolled
          ? "0 18px 44px -40px rgba(20,53,46,0.22)"
          : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-10">
        <BrandMark variant="header" />

        <nav className="hidden items-center gap-1 rounded-full border border-[#DFE6DD] bg-white/82 p-1 text-sm font-bold text-[#5D7068] shadow-[0_16px_36px_-30px_rgba(20,53,46,0.16)] lg:flex">
          {navigationLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 transition-all hover:bg-[#F6FAF7] hover:text-[#14352E]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            variant="outline"
            className="hidden h-11 rounded-full border-[#DFE6DD] bg-white/94 px-5 text-sm font-bold text-[#14352E] shadow-[0_14px_28px_-24px_rgba(20,53,46,0.16)] hover:bg-white lg:inline-flex"
          >
            <Link href="/app">تسجيل الدخول</Link>
          </Button>
          <Button
            asChild
            className="h-11 rounded-full bg-[#0F8B6D] px-5 text-sm font-bold text-white shadow-[0_18px_34px_-22px_rgba(15,139,109,0.34)] hover:bg-[#0B755B]"
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
    <section className="overflow-hidden pt-6 sm:pt-8 lg:pt-10">
      <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:px-10 lg:pb-24">
        <Reveal className="space-y-7 lg:space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE7DE] bg-white/94 px-4 py-2 text-sm font-bold text-[#0F8B6D] shadow-[0_18px_36px_-30px_rgba(20,53,46,0.14)]">
            <Sparkles className="size-4" />
            واصل AI للمستقل العربي
          </div>

          <div className="max-w-[39rem] space-y-5">
            <h1 className="max-w-[35rem] text-4xl font-extrabold leading-[1.08] tracking-tight text-[#14352E] sm:text-[3.3rem] lg:text-[4.05rem]">
              حوّل اتفاق العميل إلى فاتورة واضحة ومتابعة أذكى
            </h1>
            <p className="max-w-[36rem] text-base leading-8 text-[#63786F] sm:text-lg">
              واصل يرتّب لك تفاصيل الاتفاق من المحادثة إلى الفاتورة والمتابعة في
              مشهد واحد واضح. انسخ الاتفاق كما هو، ودع واصل يستخرج التفاصيل
              ويجهّز لك رابط فاتورة ورسالة متابعة مناسبة.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              className="h-12 rounded-full bg-[#0F8B6D] px-6 text-sm font-bold text-white shadow-[0_18px_34px_-20px_rgba(15,139,109,0.34)] hover:bg-[#0B755B] sm:min-w-[9.5rem]"
            >
              <Link href="/app/new">ابدأ الآن</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-[#DDE7DE] bg-white/94 px-6 text-sm font-bold text-[#14352E] hover:bg-[#FBFCF9] sm:min-w-[11rem]"
            >
              <Link href="#features">استكشف المميزات</Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            {heroHighlights.map((item) => (
              <div
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-[#DFE8DF] bg-white/90 px-4 py-2.5 text-sm font-bold text-[#14352E] shadow-[0_16px_28px_-26px_rgba(20,53,46,0.12)]"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-[#EEF5F0] text-[#0F8B6D]">
                  <BadgeCheck className="size-3.5" />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="lg:justify-self-start">
          <HeroVisualComposition />
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
            {trustStripCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-[#E1E8DF] bg-white/88 px-5 py-5 shadow-[0_22px_56px_-44px_rgba(20,53,46,0.12)] backdrop-blur"
                >
                  <span className="flex size-11 items-center justify-center rounded-[1.1rem] border border-[#D8E7DE] bg-[#EEF5F0] text-[#0F8B6D]">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-5 text-base font-extrabold text-[#14352E]">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#63786F]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-[1280px] px-4 py-24 sm:px-6 lg:px-10"
    >
      <div className="rounded-[3rem] border border-[#E1E8DF] bg-[linear-gradient(180deg,rgba(238,245,240,0.72),rgba(255,255,255,0.58))] p-6 shadow-[0_34px_80px_-62px_rgba(20,53,46,0.14)] sm:p-8 lg:p-10">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold tracking-[0.24em] text-[#0F8B6D]">
            المميزات
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#14352E] sm:text-4xl">
            مميزات تسهّل شغلك اليومي
          </h2>
          <p className="mt-4 text-base leading-8 text-[#63786F] sm:text-lg">
            كل بطاقة هنا تمثل شيء فعلي تحتاجه كمستقل: استخراج، فاتورة، متابعة،
            ووضوح مالي أفضل.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {featureCards.slice(0, 3).map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.04}>
              <FeatureCard {...feature} />
            </Reveal>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {featureCards.slice(3).map((feature, index) => (
            <Reveal key={feature.title} delay={0.12 + index * 0.04}>
              <FeatureCard {...feature} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppExperienceSection() {
  return (
    <section id="app-experience" className="py-24">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
        <div className="overflow-hidden rounded-[3rem] border border-[#E1E8DF] bg-white/86 p-6 shadow-[0_40px_90px_-62px_rgba(20,53,46,0.16)] backdrop-blur sm:p-8 lg:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <Reveal>
              <div className="mx-auto w-full max-w-[23rem]">
                <DeviceFrame label="تجربة التطبيق" className="max-w-[23rem]">
                  <DashboardScreenPreview />
                </DeviceFrame>
              </div>
            </Reveal>

            <Reveal className="space-y-7">
              <div className="space-y-4">
                <p className="text-sm font-bold tracking-[0.24em] text-[#0F8B6D]">
                  تجربة التطبيق
                </p>
                <h2 className="max-w-xl text-3xl font-extrabold leading-tight text-[#14352E] sm:text-4xl">
                  تجربة أقرب لتطبيق جوال مرتب
                </h2>
                <p className="max-w-2xl text-base leading-8 text-[#63786F] sm:text-lg">
                  صممنا واصل عشان يكون خفيف، واضح، ومريح للمستقل. كل شيء قدامك:
                  الاتفاق، الفاتورة، حالة الدفع، والمتابعة.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {appFeatureBullets.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-[1.55rem] border border-[#E1E8DF] bg-[#FBFCF9] px-4 py-3.5"
                    >
                      <span className="flex size-9 items-center justify-center rounded-full bg-[#EEF5F0] text-[#0F8B6D]">
                        <Icon className="size-4" />
                      </span>
                      <span className="text-sm font-bold text-[#14352E]">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-[2rem] border border-[#E1E8DF] bg-[linear-gradient(180deg,#ffffff,#f8fbf8)] p-5 shadow-[0_20px_50px_-42px_rgba(20,53,46,0.12)]">
                <div className="flex items-center justify-between gap-3 border-b border-[#E6ECE3] pb-4">
                  <div>
                    <p className="text-sm font-extrabold text-[#14352E]">
                      لقطة سريعة للمشروع
                    </p>
                    <p className="mt-1 text-sm leading-7 text-[#63786F]">
                      قبل أن ترسل متابعة جديدة، تشوف الوضع كامل بسرعة.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#EEF5F0] px-3 py-1 text-xs font-bold text-[#0F8B6D]">
                    اليوم
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <SupportMetric label="المتبقي" value="15,000 ريال" />
                  <SupportMetric label="المصاريف" value="2,300 ريال" />
                  <SupportMetric label="الربح المتوقع" value="22,700 ريال" tone="mint" />
                </div>

                <div className="mt-4 rounded-[1.6rem] border border-[#E1E8DF] bg-white px-4 py-4">
                  <p className="text-sm font-bold text-[#14352E]">
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
        <div className="rounded-[3rem] border border-[#DDE7DE] bg-[linear-gradient(180deg,rgba(238,245,240,0.8),rgba(255,255,255,0.78))] p-6 shadow-[0_38px_90px_-64px_rgba(20,53,46,0.16)] sm:p-8 lg:p-10">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold tracking-[0.24em] text-[#0F8B6D]">
              الأسعار والباقات
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#14352E] sm:text-4xl">
              الأسعار والباقات
            </h2>
            <p className="mt-4 text-base leading-8 text-[#63786F] sm:text-lg">
              ابدأ مجانًا، ووسع استخدامك لما يكبر شغلك.
            </p>
          </Reveal>

          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-full border border-[#DDE7DE] bg-white/92 p-1 shadow-[0_12px_26px_-24px_rgba(20,53,46,0.16)]">
              <button
                type="button"
                onClick={() => onToggle(false)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                  !isYearly ? "bg-[#0F8B6D] text-white" : "text-[#63786F]"
                }`}
              >
                شهري
              </button>
              <button
                type="button"
                onClick={() => onToggle(true)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                  isYearly ? "bg-[#0F8B6D] text-white" : "text-[#63786F]"
                }`}
              >
                سنوي
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {pricingPlans.map((plan, index) => (
              <Reveal key={plan.name} delay={index * 0.04}>
                <PricingCard plan={plan} isYearly={isYearly} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="mx-auto w-full max-w-[1100px] px-4 py-24 sm:px-6 lg:px-10">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold tracking-[0.24em] text-[#0F8B6D]">
          الأسئلة الشائعة
        </p>
        <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#14352E] sm:text-4xl">
          أسئلة شائعة
        </h2>
        <p className="mt-4 text-base leading-8 text-[#63786F] sm:text-lg">
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
          <div className="overflow-hidden rounded-[3rem] border border-[#D8E6DE] bg-[linear-gradient(135deg,#0F8B6D,#0D7159)] px-6 py-10 text-white shadow-[0_44px_100px_-60px_rgba(15,139,109,0.3)] sm:px-10 sm:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-sm font-bold tracking-[0.24em] text-white/74">
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
                  className="h-12 rounded-full bg-white px-6 text-sm font-bold text-[#0F8B6D] hover:bg-white/92"
                >
                  <Link href="/app/new">ابدأ الآن</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-white/20 bg-white/10 px-6 text-sm font-bold text-white hover:bg-white/14 hover:text-white"
                >
                  <Link href="#pricing" className="inline-flex items-center gap-2">
                    شوف الباقات
                    <ArrowLeft className="size-4" />
                  </Link>
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
    <footer className="border-t border-[#E1E8DF] py-8">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <BrandMark variant="header" subtitle={false} />

        <div className="flex flex-col gap-2 text-sm text-[#63786F] sm:flex-row sm:items-center sm:gap-5">
          {navigationLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[#0F8B6D]"
            >
              {item.href === "#faq" ? "الأسئلة الشائعة" : item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-4 w-full max-w-[1280px] px-4 text-sm text-[#63786F] sm:px-6 lg:px-10">
        © 2026 واصل AI — تجربة عربية أوضح للمستقلين
      </div>
    </footer>
  );
}

function HeroVisualComposition() {
  return (
    <div className="relative mx-auto w-full max-w-[42rem] px-2 sm:px-0">
      <div className="absolute inset-x-12 top-8 h-48 rounded-full bg-[#DDF2E7] opacity-90 blur-3xl" />
      <div className="absolute -top-6 end-8 h-28 w-28 rounded-full bg-[#FFF7EA] opacity-90 blur-3xl" />
      <div className="absolute bottom-6 start-6 h-32 w-32 rounded-full bg-white/80 blur-3xl" />

      <div className="relative rounded-[2.5rem] border border-[#DCE8DF] bg-[linear-gradient(145deg,rgba(255,251,244,0.95),rgba(241,248,243,0.98))] p-3 shadow-[0_40px_100px_-56px_rgba(20,53,46,0.24)] sm:p-4">
        <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(15,139,109,0.1),transparent_32%)]" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,251,248,0.95))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-3">
          <div className="mb-2.5 flex items-center justify-between px-2 sm:px-3">
            <div>
              <p className="mt-1 text-sm font-extrabold text-[#14352E]">
                من المحادثة إلى الفاتورة والمتابعة
              </p>
            </div>
            <span className="rounded-full border border-[#DCE8DF] bg-white/88 px-3 py-1 text-[11px] font-bold text-[#0F8B6D]">
              واصل AI
            </span>
          </div>

          <div className="overflow-hidden rounded-[1.6rem] border border-[#E7EEE8] bg-white shadow-[0_22px_56px_-40px_rgba(20,53,46,0.18)]">
            <Image
              src="/images/wasil-hero-workflow.png"
              alt="مخطط واصل لتحويل المحادثة إلى فاتورة ومتابعة"
              width={1427}
              height={1102}
              priority
              sizes="(min-width: 1024px) 42rem, (min-width: 640px) 82vw, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>

        <FloatingTag
          label="تم استخراج الاتفاق"
          className="absolute -top-3 end-8 rounded-full border border-white/80 bg-white/92 px-3 py-1.5 text-xs font-bold text-[#14352E] shadow-[0_16px_30px_-24px_rgba(20,53,46,0.18)] backdrop-blur"
          xRange={[0, 2.5, 0]}
          yRange={[0, -7, 0]}
          duration={6.4}
          delay={0.2}
        />
        <FloatingTag
          label="رابط الفاتورة جاهز"
          className="absolute -bottom-4 end-12 rounded-full border border-[#DDE8DF] bg-[#F6FBF8]/95 px-3 py-1.5 text-xs font-bold text-[#0F8B6D] shadow-[0_18px_34px_-26px_rgba(20,53,46,0.18)] backdrop-blur sm:end-16"
          xRange={[0, -3, 0]}
          yRange={[0, 6, 0]}
          duration={7.3}
          delay={0.8}
        />
        <FloatingTag
          label="متابعة أذكى"
          className="absolute top-1/2 -start-3 hidden -translate-y-1/2 rounded-full border border-[#E6E3D9] bg-[#FFF9F0]/95 px-3 py-1.5 text-xs font-bold text-[#6F6554] shadow-[0_18px_34px_-26px_rgba(20,53,46,0.16)] backdrop-blur sm:block"
          xRange={[0, 2, 0]}
          yRange={[0, -5.5, 0]}
          duration={5.8}
          delay={1.3}
        />
      </div>
    </div>
  );
}

function FloatingTag({
  label,
  className,
  xRange,
  yRange,
  duration,
  delay,
}: {
  label: string;
  className: string;
  xRange: [number, number, number];
  yRange: [number, number, number];
  duration: number;
  delay: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobileHeroTag();
  const amplitude = isMobile ? 0.55 : 1;
  const animatedX = xRange.map((value) => value * amplitude) as [number, number, number];
  const animatedY = yRange.map((value) => value * amplitude) as [number, number, number];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`pointer-events-none ${className}`}
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: animatedX,
                y: animatedY,
                opacity: [0.92, 1, 0.92],
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration,
                delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }
        }
      >
        {label}
      </motion.div>
    </motion.div>
  );
}

function useIsMobileHeroTag() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  return isMobile;
}

function FeatureCard({
  title,
  description,
  icon,
  visual,
  wide = false,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  visual: ReactNode;
  wide?: boolean;
}) {
  const Icon = icon;

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.24 }}
      className={`overflow-hidden rounded-[2.35rem] border border-[#E1E8DF] bg-white/92 p-6 shadow-[0_26px_60px_-46px_rgba(20,53,46,0.14)] ${
        wide ? "min-h-[22rem]" : "min-h-[20rem]"
      }`}
    >
      <div className="flex h-full flex-col justify-between gap-8">
        <div className="space-y-4">
          <span className="flex size-12 items-center justify-center rounded-[1.2rem] border border-[#D7E4DB] bg-[#EEF5F0] text-[#0F8B6D]">
            <Icon className="size-5" />
          </span>
          <div className="space-y-3">
            <h3 className="text-2xl font-extrabold text-[#14352E]">{title}</h3>
            <p className="max-w-xl text-sm leading-7 text-[#63786F] sm:text-base">
              {description}
            </p>
          </div>
        </div>
        {visual}
      </div>
    </motion.article>
  );
}

function MiniChatVisual() {
  return (
    <div className="rounded-[1.85rem] border border-[#E1E8DF] bg-[#FBFCF9] p-4">
      <div className="space-y-2.5">
        <div className="ms-auto max-w-[82%] rounded-[1.3rem] bg-white px-3 py-2.5 text-xs leading-6 text-[#14352E] shadow-sm">
          نحتاج تصميم واجهات التطبيق، العربون 10,000 والباقي عند التسليم.
        </div>
        <div className="me-auto max-w-[68%] rounded-[1.3rem] bg-[#EEF5F0] px-3 py-2.5 text-xs leading-6 text-[#0F8B6D]">
          تمام. الدفعة الأخيرة يوم 28.
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["الخدمة", "المبلغ", "الموعد"].map((item) => (
          <span
            key={item}
            className="rounded-full border border-[#D8E4DB] bg-white px-3 py-1 text-[11px] font-bold text-[#0F8B6D]"
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
    <div className="rounded-[1.85rem] border border-[#E1E8DF] bg-[#FBFCF9] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-[#14352E]">WA-320145</p>
        <span className="rounded-full bg-[#EEF5F0] px-2.5 py-1 text-[11px] font-bold text-[#0F8B6D]">
          تمت المشاهدة
        </span>
      </div>
      <div className="mt-4 rounded-[1.2rem] border border-[#E1E8DF] bg-white p-3">
        <div className="flex items-center justify-between text-xs text-[#63786F]">
          <span>رابط الفاتورة</span>
          <span className="font-bold text-[#14352E]">wasil.ai/i/wa...</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-[#E8EEE8]">
          <div className="h-2 w-[72%] rounded-full bg-[#0F8B6D]" />
        </div>
      </div>
      <p className="mt-3 text-xs leading-6 text-[#63786F]">
        رابط مرتب مع حالة مشاهدة تساعدك تختار توقيت المتابعة.
      </p>
    </div>
  );
}

function MiniFollowUpVisual() {
  return (
    <div className="rounded-[1.85rem] border border-[#E1E8DF] bg-[#FBFCF9] p-4">
      <div className="rounded-[1.35rem] border border-[#E1E8DF] bg-white px-3 py-3 text-xs leading-7 text-[#14352E]">
        هلا، حبيت أذكركم بالمبلغ المتبقي 15,000 ريال، وإذا تم التحويل يسعدني
        تأكيد الاستلام مباشرة.
      </div>
      <div className="mt-4 flex items-center justify-between rounded-[1.25rem] bg-[#EEF5F0] px-3 py-3">
        <p className="text-xs font-bold text-[#0F8B6D]">نبرة مهنية جاهزة للإرسال</p>
        <span className="text-[11px] text-[#63786F]">واتساب</span>
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
              ? "border-[#D8E4DB] bg-[#EEF5F0]"
              : "border-[#E1E8DF] bg-[#FBFCF9]"
          }`}
        >
          <p className="text-xs font-medium text-[#63786F]">{label}</p>
          <p className="mt-2 text-lg font-extrabold text-[#14352E]">{value}</p>
        </div>
      ))}
    </div>
  );
}

function MiniJourneyVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {["المحادثة", "الاستخراج", "الفاتورة", "المتابعة"].map((item, index) => (
        <div
          key={item}
          className="relative rounded-[1.6rem] border border-[#E1E8DF] bg-[#FBFCF9] px-4 py-5"
        >
          <span className="text-[11px] font-bold text-[#63786F]">0{index + 1}</span>
          <p className="mt-2 text-sm font-extrabold text-[#14352E]">{item}</p>
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
          ? "border-[#D8E4DB] bg-[#EEF5F0]"
          : "border-[#E1E8DF] bg-white"
      }`}
    >
      <p className="text-xs font-medium text-[#63786F]">{label}</p>
      <p className="mt-2 text-sm font-extrabold text-[#14352E]">{value}</p>
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.24 }}
      className={`flex h-full flex-col rounded-[2.5rem] border p-6 shadow-[0_26px_60px_-46px_rgba(20,53,46,0.14)] ${
        isFeatured
          ? "border-[#0F8B6D] bg-white ring-1 ring-[#CFE2D8]"
          : "border-[#E1E8DF] bg-white/94"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-extrabold text-[#14352E]">{plan.name}</p>
          <p className="mt-2 text-sm leading-7 text-[#63786F]">{plan.description}</p>
        </div>
        {badge ? (
          <span className="rounded-full bg-[#0F8B6D] px-3 py-1 text-[11px] font-bold text-white">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-8 border-b border-[#E7ECE6] pb-6">
        <p className="text-3xl font-extrabold text-[#14352E]">{price}</p>
        <p className="mt-2 text-xs font-bold text-[#63786F]">
          {isYearly && plan.monthlyPrice !== "مجانا"
            ? "السعر الشهري عند الدفع السنوي"
            : "وضوح كافٍ للمستقل من أول يوم"}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-start gap-3">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#EEF5F0] text-[#0F8B6D]">
              <CheckCircle2 className="size-4" />
            </span>
            <span className="text-sm leading-7 text-[#14352E]">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        asChild
        className={`mt-8 h-11 rounded-full text-sm font-bold ${
          isFeatured
            ? "bg-[#0F8B6D] text-white hover:bg-[#0B755B]"
            : "bg-[#14352E] text-white hover:bg-[#1A453C]"
        }`}
      >
        <Link href="/app/new">{plan.cta}</Link>
      </Button>
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
