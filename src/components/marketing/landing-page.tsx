"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  BellRing,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  FileText,
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
import { useState } from "react";

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
    <div className="relative mx-auto w-full max-w-[39rem]">
      <div className="absolute inset-x-10 top-6 h-44 rounded-full bg-[#E4F0E7] blur-3xl" />
      <div className="absolute bottom-10 end-8 h-36 w-36 rounded-full bg-white/70 blur-3xl" />
      <div className="relative overflow-hidden rounded-[3rem] border border-[#E1E8DF] bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(243,248,244,0.94))] p-4 shadow-[0_42px_100px_-60px_rgba(20,53,46,0.2)] sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.94),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(15,139,109,0.08),transparent_30%)]" />
        <div className="relative grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2.35rem] border border-[#E1E8DF] bg-[linear-gradient(180deg,#f8fbf8,#eef5f0)] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#6E847B]">المشهد البصري</p>
                <p className="mt-1 text-sm font-extrabold text-[#14352E]">
                  مستقل يدير الاتفاق
                </p>
              </div>
              <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#0F8B6D]">
                واصل AI
              </span>
            </div>

            <div className="mt-4 overflow-hidden rounded-[2rem] border border-white/80 bg-white/70">
              <SaudiFreelancerIllustration />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="lg:-translate-y-2">
              <HeroConversationCard />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="lg:translate-y-3">
                <HeroSummaryCard />
              </div>
              <div className="lg:-translate-y-1">
                <HeroInvoiceCard />
              </div>
            </div>
            <div className="sm:max-w-[18rem] lg:-translate-y-2">
              <HeroFollowUpCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SaudiFreelancerIllustration() {
  return (
    <svg viewBox="0 0 360 420" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="wasil-robe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#F0F4F1" />
        </linearGradient>
        <linearGradient id="wasil-phone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F8B6D" />
          <stop offset="100%" stopColor="#0D6E57" />
        </linearGradient>
      </defs>

      <rect width="360" height="420" fill="#F8FBF8" />
      <circle cx="90" cy="94" r="38" fill="#EAF4EE" />
      <circle cx="286" cy="88" r="48" fill="#EEF5F0" />
      <ellipse cx="180" cy="336" rx="120" ry="22" fill="#DCEAE1" />
      <path
        d="M104 304c7-58 44-98 76-109 32 11 69 51 76 109l-10 58H114l-10-58Z"
        fill="url(#wasil-robe)"
        stroke="#D6E2DA"
        strokeWidth="2"
      />
      <rect x="165" y="204" width="30" height="58" rx="14" fill="#F4E8D5" />
      <path
        d="M128 138c9-33 33-56 52-56s43 23 52 56c-12 12-32 19-52 19s-40-7-52-19Z"
        fill="#F4E8D5"
      />
      <circle cx="180" cy="156" r="40" fill="#D8B392" />
      <path
        d="M133 132c8-31 28-60 47-60s39 29 47 60c-8 7-22 12-47 12s-39-5-47-12Z"
        fill="#F7EFE1"
      />
      <path
        d="M130 137c12 10 30 16 50 16s38-6 50-16"
        fill="none"
        stroke="#DDCEB5"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M150 163c8 7 18 11 30 11s22-4 30-11"
        fill="none"
        stroke="#C09474"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="216"
        y="185"
        width="58"
        height="96"
        rx="16"
        transform="rotate(-12 216 185)"
        fill="url(#wasil-phone)"
      />
      <rect
        x="226"
        y="198"
        width="38"
        height="66"
        rx="10"
        transform="rotate(-12 226 198)"
        fill="#F6FFFB"
      />
      <path
        d="M117 230c17-12 38-16 63-16"
        fill="none"
        stroke="#D8E7DE"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M243 220c-9 11-20 22-35 31"
        fill="none"
        stroke="#D8E7DE"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <rect x="76" y="274" width="82" height="44" rx="18" fill="#FFFFFF" />
      <text
        x="117"
        y="292"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#6E847B"
      >
        رابط جاهز
      </text>
      <text
        x="117"
        y="309"
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill="#14352E"
      >
        wasil.ai/i
      </text>
      <circle cx="283" cy="304" r="28" fill="#FFFFFF" />
      <path
        d="M272 305l7 7 15-16"
        fill="none"
        stroke="#0F8B6D"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroConversationCard() {
  return (
    <div className="rounded-[2rem] border border-[#E1E8DF] bg-white/94 p-4 shadow-[0_18px_42px_-34px_rgba(20,53,46,0.18)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#0F8B6D]">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-[#EEF5F0]">
            <MessageSquareText className="size-4" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-[#14352E]">مقتطف اتفاق</p>
            <p className="text-[11px] text-[#6E847B]">من واتساب</p>
          </div>
        </div>
        <span className="rounded-full border border-[#DDE7DE] bg-[#FBFCF9] px-3 py-1 text-[11px] font-bold text-[#63786F]">
          تمت القراءة
        </span>
      </div>
      <div className="mt-4 space-y-2.5">
        <div className="ms-auto max-w-[88%] rounded-[1.3rem] bg-[#EEF5F0] px-3 py-2.5 text-xs leading-6 text-[#0F8B6D]">
          نحتاج هوية بصرية، العربون 6,000 والباقي قبل التسليم.
        </div>
        <div className="max-w-[92%] rounded-[1.3rem] border border-[#E5ECE4] bg-white px-3 py-2.5 text-xs leading-6 text-[#14352E]">
          ممتاز، التسليم خلال 14 يوم والرابط يرسل بعد اعتماد البداية.
        </div>
      </div>
    </div>
  );
}

function HeroSummaryCard() {
  return (
    <div className="rounded-[1.85rem] border border-[#E1E8DF] bg-[#FBFCF9] p-4 shadow-[0_18px_40px_-34px_rgba(20,53,46,0.16)]">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-[#EEF5F0] text-[#0F8B6D]">
          <FileText className="size-4" />
        </span>
        <div>
          <p className="text-sm font-extrabold text-[#14352E]">ملخص مستخرج</p>
          <p className="text-[11px] text-[#6E847B]">الخدمة + المبلغ + الموعد</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <MiniListRow label="الخدمة" value="هوية بصرية" />
        <MiniListRow label="الإجمالي" value="18,000 ريال" />
        <MiniListRow label="التسليم" value="14 يوم" />
      </div>
    </div>
  );
}

function HeroInvoiceCard() {
  return (
    <div className="rounded-[1.85rem] border border-[#D6E5DD] bg-[linear-gradient(180deg,#ffffff,#f4faf6)] p-4 shadow-[0_18px_40px_-34px_rgba(20,53,46,0.16)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-[#EEF5F0] text-[#0F8B6D]">
            <WalletCards className="size-4" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-[#14352E]">الفاتورة</p>
            <p className="text-[11px] text-[#6E847B]">WA-320145</p>
          </div>
        </div>
        <span className="rounded-full bg-[#14352E] px-2.5 py-1 text-[11px] font-bold text-white">
          15,000 متبقي
        </span>
      </div>
      <div className="mt-4 rounded-[1.4rem] border border-[#E4ECE5] bg-white px-3 py-3">
        <p className="text-[11px] font-bold text-[#6E847B]">رابط الفاتورة</p>
        <p className="mt-1 text-sm font-extrabold text-[#14352E]">wasil.ai/i/wa-320145</p>
      </div>
    </div>
  );
}

function HeroFollowUpCard() {
  return (
    <div className="rounded-[1.85rem] border border-[#DCE7DE] bg-white/94 p-4 shadow-[0_18px_40px_-34px_rgba(20,53,46,0.16)]">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-[#EEF5F0] text-[#0F8B6D]">
          <BellRing className="size-4" />
        </span>
        <div>
          <p className="text-sm font-extrabold text-[#14352E]">حالة المتابعة</p>
          <p className="text-[11px] text-[#6E847B]">رسالة جاهزة للإرسال</p>
        </div>
      </div>
      <div className="mt-4 rounded-[1.35rem] bg-[#EEF5F0] px-3 py-3 text-xs leading-6 text-[#0F8B6D]">
        العميل فتح الرابط. هذا وقت مناسب لمتابعة لطيفة وتأكيد المبلغ المتبقي.
      </div>
    </div>
  );
}

function MiniListRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[1.2rem] bg-white px-3 py-2.5">
      <span className="text-[11px] font-bold text-[#6E847B]">{label}</span>
      <span className="text-xs font-extrabold text-[#14352E]">{value}</span>
    </div>
  );
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
