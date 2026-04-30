import { cn } from "@/lib/utils";

const toneStyles = {
  "ودي": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "مهني": "border-teal-200 bg-teal-50 text-teal-700",
  "حازم": "border-violet-200 bg-violet-50 text-violet-700",
  "مستعجل": "border-amber-200 bg-amber-50 text-amber-700",
} as const;

export type ToneBadgeValue = keyof typeof toneStyles;

export function ToneBadge({
  tone,
  className,
}: {
  tone: ToneBadgeValue;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold",
        toneStyles[tone],
        className,
      )}
    >
      {tone}
    </span>
  );
}
