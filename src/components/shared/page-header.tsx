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
    <div className="flex flex-col gap-5 rounded-[1.85rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.88))] px-5 py-5 shadow-[0_18px_60px_-48px_rgba(0,72,54,0.22)] sm:px-6 sm:py-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-3.5">
        {badge ? <div>{badge}</div> : null}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-[1.85rem]">
            {title}
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-[1rem]">
            {description}
          </p>
        </div>
      </div>
      {action ? <div className="shrink-0 self-start">{action}</div> : null}
    </div>
  );
}
