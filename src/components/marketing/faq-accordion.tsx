"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqItems = [
  {
    question: "هل لازم أكتب تفاصيل الاتفاق بشكل مرتب؟",
    answer:
      "لا. انسخ المحادثة مثل ما هي، وواصل يحاول يفهم الخدمة والمبلغ والدفعات والمواعيد من النص نفسه.",
  },
  {
    question: "هل واصل يولد الفاتورة تلقائيًا؟",
    answer:
      "نعم، بعد استخراج التفاصيل ومراجعتها تقدر تعتمد الفاتورة ويطلع لك رابط مرتب وجاهز للإرسال.",
  },
  {
    question: "هل أقدر أرسل رابط الفاتورة للعميل؟",
    answer:
      "أكيد. كل فاتورة لها رابط عام واضح تقدر تنسخه وترسله للعميل مباشرة.",
  },
  {
    question: "هل أقدر أتابع إذا العميل فتح الرابط؟",
    answer:
      "نعم، واصل يوضح لك حالة المشاهدة حتى تعرف متى تكون المتابعة مناسبة.",
  },
  {
    question: "هل الذكاء الاصطناعي فعلي أو مجرد ديمو؟",
    answer:
      "واصل مبني ليتكامل مع مزودات ذكاء اصطناعي فعلية، مع بقاء تجربة الديمو واضحة وسريعة.",
  },
  {
    question: "هل أقدر أضيف مصاريف المشروع؟",
    answer:
      "نعم، تقدر تضيف المصاريف داخل الفاتورة وتشوف أثرها مباشرة على الربح المتوقع.",
  },
] as const;

export function FaqAccordion() {
  const [openItem, setOpenItem] = useState<number>(0);

  return (
    <div className="space-y-3">
      {faqItems.map((item, index) => {
        const isOpen = openItem === index;

        return (
          <motion.div
            key={item.question}
            layout
            className="overflow-hidden rounded-[1.95rem] border border-[#E1E8DF] bg-white/94 shadow-[0_20px_50px_-42px_rgba(20,53,46,0.12)]"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-right"
              aria-expanded={isOpen}
              onClick={() =>
                setOpenItem((current) => (current === index ? -1 : index))
              }
            >
              <span className="text-base font-extrabold text-foreground sm:text-lg">
                {item.question}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.24 }}
                className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#EEF5F0] text-primary"
              >
                <ChevronDown className="size-4" />
              </motion.span>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5">
                <p className="text-sm leading-8 text-muted-foreground sm:text-base">
                  {item.answer}
                </p>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
