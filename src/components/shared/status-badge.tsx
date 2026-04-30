import { cn } from "@/lib/utils";

const statusStyles = {
  "مدفوعة": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "مدفوعة جزئيًا": "border-sky-200 bg-sky-50 text-sky-700",
  "مدفوع جزئيًا": "border-sky-200 bg-sky-50 text-sky-700",
  "غير مدفوعة": "border-slate-200 bg-slate-50 text-slate-700",
  "متأخرة": "border-amber-200 bg-amber-50 text-amber-700",
  "تمت المشاهدة": "border-teal-200 bg-teal-50 text-teal-700",
  "لم تُشاهد بعد": "border-rose-200 bg-rose-50 text-rose-700",
} as const;

export type StatusBadgeValue = keyof typeof statusStyles;

export function StatusBadge({
  status,
  className,
}: {
  status: StatusBadgeValue;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold",
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
