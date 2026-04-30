import type { ReactNode } from "react";
import { ArrowUpLeft } from "lucide-react";

export function StatCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_18px_60px_-52px_rgba(0,72,54,0.3)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </div>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon ?? <ArrowUpLeft className="size-5" />}
        </span>
      </div>
      {hint ? (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
