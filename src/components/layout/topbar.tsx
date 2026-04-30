import type { ReactNode } from "react";
import { Bell, Settings2 } from "lucide-react";

export function Topbar() {
  return (
    <header className="rounded-[2rem] border border-border/70 bg-white/85 px-4 py-4 shadow-[0_18px_60px_-42px_rgba(0,72,54,0.25)] backdrop-blur sm:px-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">
            واصل AI
          </h1>
          <p className="text-sm text-muted-foreground">
            مساعدك المالي الذكي
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <div className="flex items-center gap-2">
            <TopbarIcon label="التنبيهات">
              <Bell className="size-4" />
            </TopbarIcon>
            <TopbarIcon label="الإعدادات">
              <Settings2 className="size-4" />
            </TopbarIcon>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/90 px-3 py-2 shadow-sm">
            <div className="space-y-0.5 text-right">
              <p className="text-sm font-bold text-foreground">مستخدم تجريبي</p>
              <p className="text-xs text-muted-foreground">حساب مؤقت</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-extrabold text-primary-foreground">
              و
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function TopbarIcon({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-background/90 text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </button>
  );
}
