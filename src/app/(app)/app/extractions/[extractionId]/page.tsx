"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  CircleDollarSign,
  FileSpreadsheet,
  UserRound,
} from "lucide-react";

import { AIInsightCard } from "@/components/shared/ai-insight-card";
import { PageHeader } from "@/components/shared/page-header";
import { ProcessingChecklist } from "@/components/shared/processing-checklist";
import { StatusBadge } from "@/components/shared/status-badge";
import { ToneBadge } from "@/components/shared/tone-badge";
import { Button } from "@/components/ui/button";
import {
  defaultTemporaryInvoiceData,
  getStoredConversation,
  getStoredInvoice,
  setInvoiceViewed,
  setStoredInvoice,
  type TemporaryInvoiceData,
} from "@/lib/client-storage";

type EditableInvoiceForm = {
  clientName: string;
  freelancerName: string;
  serviceName: string;
  projectValue: string;
  currencyLabel: string;
  amountPaid: string;
  amountRemaining: string;
  deliveryDate: string;
  dueDate: string;
  paymentStatus: TemporaryInvoiceData["paymentStatus"];
};

type ReviewField = {
  key: keyof EditableInvoiceForm;
  label: string;
  icon: typeof UserRound;
  fullWidth?: boolean;
};

const reviewFields: ReviewField[] = [
  { key: "clientName", label: "اسم العميل", icon: UserRound },
  { key: "freelancerName", label: "اسم المستقل", icon: UserRound },
  {
    key: "serviceName",
    label: "الخدمة",
    icon: FileSpreadsheet,
    fullWidth: true,
  },
  { key: "projectValue", label: "قيمة المشروع", icon: CircleDollarSign },
  { key: "currencyLabel", label: "العملة", icon: CircleDollarSign },
  { key: "amountPaid", label: "المبلغ المدفوع", icon: CircleDollarSign },
  { key: "amountRemaining", label: "المبلغ المتبقي", icon: CircleDollarSign },
  { key: "deliveryDate", label: "موعد التسليم", icon: CalendarClock },
  { key: "dueDate", label: "موعد استحقاق الدفع", icon: CalendarClock },
  { key: "paymentStatus", label: "حالة الدفع", icon: FileSpreadsheet },
];

function invoiceToFormData(invoice: TemporaryInvoiceData): EditableInvoiceForm {
  return {
    clientName: invoice.clientName,
    freelancerName: invoice.freelancerName,
    serviceName: invoice.serviceName,
    projectValue: String(invoice.projectValue),
    currencyLabel: invoice.currencyLabel,
    amountPaid: String(invoice.amountPaid),
    amountRemaining: String(invoice.amountRemaining),
    deliveryDate: invoice.deliveryDate,
    dueDate: invoice.dueDate,
    paymentStatus: invoice.paymentStatus,
  };
}

function parseAmount(value: string, fallback: number) {
  const digitsOnly = value.replace(/[^\d]/g, "");
  return digitsOnly ? Number(digitsOnly) : fallback;
}

export default function ExtractionReviewPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [conversation] = useState(() => getStoredConversation() ?? "");
  const [formData, setFormData] = useState<EditableInvoiceForm>(() => {
    const storedInvoice = getStoredInvoice();
    return invoiceToFormData(storedInvoice ?? defaultTemporaryInvoiceData);
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsProcessing(false);
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  function updateField<Key extends keyof EditableInvoiceForm>(
    key: Key,
    value: EditableInvoiceForm[Key],
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleCreateInvoice() {
    const nextInvoice: TemporaryInvoiceData = {
      ...defaultTemporaryInvoiceData,
      invoiceViewStatus: "لم تُشاهد بعد",
      clientName: formData.clientName,
      freelancerName: formData.freelancerName,
      serviceName: formData.serviceName,
      projectValue: parseAmount(
        formData.projectValue,
        defaultTemporaryInvoiceData.projectValue,
      ),
      currencyLabel: formData.currencyLabel,
      currencyShort: formData.currencyLabel.includes("سعودي")
        ? "ريال"
        : defaultTemporaryInvoiceData.currencyShort,
      amountPaid: parseAmount(
        formData.amountPaid,
        defaultTemporaryInvoiceData.amountPaid,
      ),
      amountRemaining: parseAmount(
        formData.amountRemaining,
        defaultTemporaryInvoiceData.amountRemaining,
      ),
      deliveryDate: formData.deliveryDate,
      dueDate: formData.dueDate,
      paymentStatus: formData.paymentStatus,
    };

    nextInvoice.expectedProfit = nextInvoice.projectValue - nextInvoice.projectExpenses;

    setStoredInvoice(nextInvoice);
    setInvoiceViewed(false);
    router.push("/app/invoices/demo");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="مراجعة التفاصيل المستخرجة"
        description="هذه معاينة لرحلة المعالجة والمراجعة قبل إنشاء الفاتورة."
        badge={<ToneBadge tone="مهني" />}
        action={
          !isProcessing ? (
            <Button
              className="h-11 rounded-2xl px-5 text-sm font-bold"
              onClick={handleCreateInvoice}
            >
              تأكيد وإنشاء الفاتورة
            </Button>
          ) : null
        }
      />

      <section className="rounded-[1.75rem] border border-dashed border-primary/20 bg-primary/5 px-5 py-4 text-sm leading-7 text-muted-foreground shadow-[0_20px_60px_-52px_rgba(0,72,54,0.18)]">
        سيتم ربط هذه الخطوة بالذكاء الاصطناعي الحقيقي في المرحلة التالية.
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <ProcessingChecklist completedCount={isProcessing ? 3 : 7} activeIndex={isProcessing ? 3 : 6} />
        <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_20px_60px_-52px_rgba(0,72,54,0.28)]">
          <p className="text-sm font-medium text-muted-foreground">
            نص المحادثة الحالي
          </p>
          <p className="mt-3 whitespace-pre-line text-sm leading-8 text-foreground">
            {conversation || "لم يتم العثور على نص محفوظ، لذلك نعرض بيانات تجريبية فقط."}
          </p>
        </div>
      </section>

      {isProcessing ? null : (
        <>
          <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <AIInsightCard
              label="نبرة الاتفاق"
              title="التعاون مهني وإيجابي، والعميل واضح في مواعيد الدفع."
              description="الأسلوب العام مطمئن ويعكس اتفاقًا منظمًا، لذلك يمكن تجهيز فاتورة ورسالة متابعة بصياغة مهنية مباشرة."
              badge={<ToneBadge tone="مهني" />}
            />
            <AIInsightCard
              label="مستوى الاستعجال"
              title="متوسط"
              description="لا يوجد توتر ظاهر في المحادثة، لكن وجود دفعة متبقية يجعل المتابعة قبل موعد الاستحقاق خطوة مناسبة."
              badge={<ToneBadge tone="مستعجل" />}
            />
            <AIInsightCard
              label="أسلوب المتابعة المقترح"
              title="رسالة لطيفة ومباشرة"
              description="الأفضل تذكير العميل باحترام ووضوح مع ذكر المبلغ المتبقي وموعد الاستحقاق بدون لهجة ضاغطة."
              badge={<ToneBadge tone="ودي" />}
            />
            <AIInsightCard
              label="تنبيه واصل"
              title="المبلغ المتبقي يمثل جزءًا مهمًا من قيمة المشروع، يفضّل تذكير العميل قبل موعد الاستحقاق."
              description="هذه البطاقة ستتحول لاحقًا إلى تنبيه ديناميكي مبني على التفاصيل الحقيقية المستخرجة من المحادثة."
            />
          </section>

          <section className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_20px_60px_-52px_rgba(0,72,54,0.28)]">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  حقول المراجعة والتعديل
                </p>
                <h3 className="text-lg font-bold text-foreground">
                  راجع البيانات قبل إنشاء الفاتورة
                </h3>
              </div>
              <StatusBadge status={formData.paymentStatus} />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {reviewFields.map((field) => {
                const Icon = field.icon;
                const value = formData[field.key];

                return (
                  <label
                    key={field.label}
                    className={`space-y-2 ${field.fullWidth ? "md:col-span-2" : ""}`}
                  >
                    <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <Icon className="size-4 text-primary" />
                      {field.label}
                    </span>

                    <div className="rounded-[1.25rem] border border-input bg-background px-4 py-3 shadow-sm">
                      {field.key === "paymentStatus" ? (
                        <select
                          value={formData.paymentStatus}
                          onChange={(event) =>
                            updateField(
                              "paymentStatus",
                              event.target.value as EditableInvoiceForm["paymentStatus"],
                            )
                          }
                          className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
                        >
                          <option value="مدفوع جزئيًا">مدفوع جزئيًا</option>
                          <option value="غير مدفوعة">غير مدفوعة</option>
                          <option value="مدفوعة">مدفوعة</option>
                          <option value="متأخرة">متأخرة</option>
                        </select>
                      ) : (
                        <input
                          value={value}
                          onChange={(event) =>
                            updateField(field.key, event.target.value as EditableInvoiceForm[typeof field.key])
                          }
                          className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
                        />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
