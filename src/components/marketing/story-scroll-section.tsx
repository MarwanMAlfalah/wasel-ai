"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { DeviceFrame } from "@/components/marketing/device-frame";
import {
  ChatScreenPreview,
  FollowUpScreenPreview,
  InvoiceScreenPreview,
  ReviewScreenPreview,
} from "@/components/marketing/mock-screens";

const storySteps = [
  {
    badge: "الخطوة 1",
    title: "الصق المحادثة",
    description: "انسخ تفاصيل الاتفاق مثل ما هي، بدون إعادة كتابة.",
    screen: <ChatScreenPreview />,
  },
  {
    badge: "الخطوة 2",
    title: "استخرج التفاصيل",
    description: "واصل يحدد الخدمة، المبلغ، الدفعات، ومواعيد الاستحقاق.",
    screen: <ReviewScreenPreview />,
  },
  {
    badge: "الخطوة 3",
    title: "جهّز الفاتورة",
    description: "تطلع لك فاتورة واضحة مع رابط جاهز للإرسال بشكل مرتب.",
    screen: <InvoiceScreenPreview />,
  },
  {
    badge: "الخطوة 4",
    title: "أرسل المتابعة",
    description: "إذا احتجت تذكير، واصل يجهّز لك رسالة مهنية وواضحة.",
    screen: <FollowUpScreenPreview />,
  },
] as const;

export function StoryScrollSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const stageOneOpacity = useTransform(scrollYProgress, [0, 0.17, 0.27], [1, 1, 0]);
  const stageTwoOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.34, 0.48, 0.58],
    [0, 1, 1, 0],
  );
  const stageThreeOpacity = useTransform(
    scrollYProgress,
    [0.52, 0.64, 0.78, 0.86],
    [0, 1, 1, 0],
  );
  const stageFourOpacity = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.34, 0.68, 1], [0.97, 1, 1.02, 1]);

  if (shouldReduceMotion) {
    return (
      <section
        id="journey"
        className="mx-auto w-full max-w-[1280px] px-4 py-24 sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold tracking-[0.24em] text-primary">
            رحلة واصل
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
            رحلة منظمة من أول اتفاق إلى آخر متابعة
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">
            كل خطوة تظهر لك في سياق واضح، من نص المحادثة إلى الفاتورة ثم المتابعة.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {storySteps.map((step) => (
            <div
              key={step.title}
              className="rounded-[2.2rem] border border-[#E1E8DF] bg-white/94 p-5 shadow-[0_24px_60px_-44px_rgba(20,53,46,0.12)]"
            >
              <span className="inline-flex rounded-full border border-primary/12 bg-[#EEF5F0] px-4 py-2 text-sm font-bold text-primary">
                {step.badge}
              </span>
              <h3 className="mt-4 text-2xl font-extrabold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-8 text-muted-foreground sm:text-base">
                {step.description}
              </p>
              <div className="mt-6">
                <DeviceFrame className="max-w-[19rem]" screenClassName="min-h-[30rem]">
                  {step.screen}
                </DeviceFrame>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const animatedSteps = [
    { ...storySteps[0], opacity: stageOneOpacity },
    { ...storySteps[1], opacity: stageTwoOpacity },
    { ...storySteps[2], opacity: stageThreeOpacity },
    { ...storySteps[3], opacity: stageFourOpacity },
  ] as const;

  return (
    <section id="journey" ref={sectionRef} className="relative h-[280vh]">
      <div className="sticky top-0 overflow-hidden">
        <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col justify-center px-4 py-16 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold tracking-[0.24em] text-primary">
              رحلة واصل
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-[3.1rem]">
              رحلة منظمة من أول اتفاق إلى آخر متابعة
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">
              واجهة واحدة مرتبة توضح لك أين بدأت، وماذا أُنجز، وما الذي يحتاج متابعة.
            </p>
          </div>

          <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[17rem] rounded-[2.4rem] border border-[#E1E8DF] bg-white/82 p-6 shadow-[0_30px_72px_-52px_rgba(20,53,46,0.14)] backdrop-blur">
              {animatedSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  style={{ opacity: step.opacity }}
                  className="absolute inset-0 flex flex-col justify-center px-6"
                >
                  <div className="flex items-center gap-3 text-[#697C75]">
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-[#EEF5F0] text-sm font-extrabold text-primary">
                      0{index + 1}
                    </span>
                    <span className="text-sm font-bold">{step.badge}</span>
                  </div>
                  <h3 className="mt-5 max-w-md text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              style={{ scale: phoneScale }}
              className="relative mx-auto w-full max-w-[24rem]"
            >
              <div className="absolute inset-x-6 top-8 h-28 rounded-[2rem] bg-[#E9F3EC] blur-3xl" />
              <DeviceFrame label="واجهة الجوال" className="relative max-w-[24rem]">
                <motion.div
                  style={{ opacity: stageOneOpacity }}
                  className="absolute inset-0 px-4 pb-4 pt-10"
                >
                  <ChatScreenPreview />
                </motion.div>
                <motion.div
                  style={{ opacity: stageTwoOpacity }}
                  className="absolute inset-0 px-4 pb-4 pt-10"
                >
                  <ReviewScreenPreview />
                </motion.div>
                <motion.div
                  style={{ opacity: stageThreeOpacity }}
                  className="absolute inset-0 px-4 pb-4 pt-10"
                >
                  <InvoiceScreenPreview />
                </motion.div>
                <motion.div
                  style={{ opacity: stageFourOpacity }}
                  className="absolute inset-0 px-4 pb-4 pt-10"
                >
                  <FollowUpScreenPreview />
                </motion.div>
              </DeviceFrame>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
