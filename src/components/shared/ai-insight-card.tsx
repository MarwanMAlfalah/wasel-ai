import type { ReactNode } from "react";
import { BrainCircuit } from "lucide-react";

export function AIInsightCard({
  label,
  title,
  description,
  badge,
  footer,
}: {
  label: string;
  title: string;
  description: string;
  badge?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_18px_60px_-54px_rgba(0,72,54,0.28)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BrainCircuit className="size-5" />
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        {description}
      </p>

      {badge ? <div className="mt-4">{badge}</div> : null}
      {footer ? (
        <div className="mt-4 border-t border-border/70 pt-4 text-sm text-foreground">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
