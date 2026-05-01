import { CheckCircle2, CircleDashed, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const checklistItems = [
  "جاري قراءة المحادثة",
  "استخراج اسم العميل والخدمة",
  "تحديد المبلغ والعملة",
  "فهم الدفعات والمتبقي",
  "تحليل نبرة الاتفاق",
  "تجهيز بيانات الفاتورة",
  "اقتراح رسالة متابعة مناسبة",
] as const;

export function ProcessingChecklist({
  completedCount = 2,
  activeIndex = 2,
}: {
  completedCount?: number;
  activeIndex?: number;
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,251,249,0.95))] p-5 shadow-[0_18px_54px_-48px_rgba(0,72,54,0.22)]">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">
          مراحل المعالجة
        </p>
        <h3 className="text-lg font-bold text-foreground">
          قائمة متابعة تجهيز الفاتورة
        </h3>
      </div>

      <div className="mt-5 space-y-3">
        {checklistItems.map((item, index) => {
          const isCompleted = index < completedCount;
          const isActive = index === activeIndex;

          return (
            <div
              key={item}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors",
                isCompleted
                  ? "border-emerald-100 bg-emerald-50/75"
                  : isActive
                    ? "border-primary/20 bg-primary/6"
                    : "border-border/80 bg-white/70",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-2xl",
                  isCompleted
                    ? "bg-emerald-100 text-emerald-700"
                    : isActive
                      ? "bg-primary/12 text-primary"
                      : "bg-white text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="size-4" />
                ) : isActive ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <CircleDashed className="size-4" />
                )}
              </span>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">{item}</p>
                <p className="text-xs text-muted-foreground">
                  {isCompleted
                    ? "تمت هذه الخطوة بنجاح"
                    : isActive
                      ? "هذه الخطوة قيد التنفيذ حاليًا"
                      : "بانتظار الوصول إلى هذه المرحلة"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
