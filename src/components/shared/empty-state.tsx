import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-border bg-card px-6 py-10 text-center shadow-[0_18px_60px_-56px_rgba(0,72,54,0.28)]">
      <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary/10 text-primary">
        {icon ?? <Inbox className="size-7" />}
      </div>
      <div className="mt-5 space-y-2">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="max-w-md text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      </div>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
