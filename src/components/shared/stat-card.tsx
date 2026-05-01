import type { ReactNode } from "react";
import { ArrowUpLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  hint,
  icon,
  className,
}: {
  title: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,252,250,0.96))] p-5 shadow-[0_18px_54px_-46px_rgba(0,72,54,0.24)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="text-2xl font-extrabold tracking-tight text-foreground sm:text-[1.9rem]">
            {value}
          </div>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
          {icon ?? <ArrowUpLeft className="size-5" />}
        </span>
      </div>
      {hint ? (
        <p className="mt-4 text-sm leading-7 text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
