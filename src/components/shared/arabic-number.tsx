import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ArabicNumberOptions = Intl.NumberFormatOptions & {
  locale?: string;
};

const defaultLocale = "ar-SA-u-nu-latn";

export function formatArabicNumber(
  value: number,
  { locale = defaultLocale, ...options }: ArabicNumberOptions = {},
) {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function ArabicNumber({
  value,
  formatOptions,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  value: number;
  formatOptions?: ArabicNumberOptions;
}) {
  return (
    <span
      dir="ltr"
      className={cn("inline-flex font-mono tabular-nums", className)}
      {...props}
    >
      {formatArabicNumber(value, formatOptions)}
    </span>
  );
}
