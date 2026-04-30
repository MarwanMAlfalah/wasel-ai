import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  badge,
  action,
}: {
  title: string;
  description: string;
  badge?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[1.75rem] border border-border/70 bg-card px-5 py-5 shadow-[0_16px_60px_-50px_rgba(0,72,54,0.28)] sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-3">
        {badge ? <div>{badge}</div> : null}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
