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
    <div className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,251,249,0.94))] p-5 shadow-[0_18px_54px_-48px_rgba(0,72,54,0.22)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-lg font-bold leading-8 text-foreground">{title}</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
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
