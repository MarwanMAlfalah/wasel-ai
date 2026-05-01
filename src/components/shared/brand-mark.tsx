import { cn } from "@/lib/utils";

type BrandMarkVariant = "full" | "compact" | "header" | "app";

const variantStyles: Record<
  BrandMarkVariant,
  {
    container: string;
    icon: string;
    symbol: string;
    title: string;
    subtitle: string;
    showText: boolean;
    showSubtitle: boolean;
  }
> = {
  full: {
    container: "gap-3.5",
    icon: "size-12 rounded-[1.15rem]",
    symbol: "size-8",
    title: "text-xl",
    subtitle: "text-sm",
    showText: true,
    showSubtitle: true,
  },
  compact: {
    container: "gap-0",
    icon: "size-11 rounded-[1.1rem]",
    symbol: "size-7",
    title: "text-lg",
    subtitle: "text-xs",
    showText: false,
    showSubtitle: false,
  },
  header: {
    container: "gap-3",
    icon: "size-11 rounded-[1.1rem]",
    symbol: "size-7",
    title: "text-lg sm:text-[1.15rem]",
    subtitle: "text-xs",
    showText: true,
    showSubtitle: false,
  },
  app: {
    container: "gap-3",
    icon: "size-11 rounded-[1.1rem]",
    symbol: "size-7",
    title: "text-lg",
    subtitle: "text-xs",
    showText: true,
    showSubtitle: true,
  },
};

export function BrandMark({
  variant = "full",
  subtitle,
  className,
}: {
  variant?: BrandMarkVariant;
  subtitle?: string | boolean;
  className?: string;
}) {
  const styles = variantStyles[variant];
  const subtitleText =
    subtitle === false ? null : typeof subtitle === "string" ? subtitle : "مساعدك المالي الذكي";
  const showSubtitle = styles.showSubtitle && Boolean(subtitleText);

  return (
    <div className={cn("flex items-center", styles.container, className)}>
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden bg-[#007A5A] shadow-[0_18px_34px_-22px_rgba(0,122,90,0.42)]",
          styles.icon,
        )}
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.24),transparent_52%)]" />
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          className={cn("relative text-white", styles.symbol)}
          fill="none"
        >
          <path
            d="M15 25.5c0-4.1 3.4-7.5 7.5-7.5h3"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M33 22.5c0 4.1-3.4 7.5-7.5 7.5h-3"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M21 18.5h6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M31.5 10.5l1.1 3.2 3.2 1.1-3.2 1.1-1.1 3.2-1.1-3.2-3.2-1.1 3.2-1.1 1.1-3.2Z"
            fill="currentColor"
          />
        </svg>
      </span>

      {styles.showText ? (
        <div className="space-y-0.5 text-right">
          <p className={cn("font-extrabold tracking-tight text-[#0B2D26]", styles.title)}>
            واصل AI
          </p>
          {showSubtitle ? (
            <p className={cn("text-[#697C75]", styles.subtitle)}>{subtitleText}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
