import type { ReactNode } from "react";
import { Bell, Settings2 } from "lucide-react";

export function Topbar() {
  return (
    <header className="rounded-[2.05rem] border border-white/70 bg-white/84 px-4 py-4 shadow-[0_22px_64px_-46px_rgba(0,72,54,0.24)] backdrop-blur-xl sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-[1.45rem]">
              واصل AI
            </h1>
            <p className="text-sm text-muted-foreground">
              مساعدك المالي الذكي
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            جاهز لتحويل المحادثة إلى فاتورة
          </div>
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

          <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/70 bg-background/85 px-3 py-2 shadow-[0_14px_28px_-22px_rgba(0,72,54,0.22)]">
            <div className="space-y-0.5 text-right">
              <p className="text-sm font-bold text-foreground">مستخدم تجريبي</p>
              <p className="text-xs text-muted-foreground">حساب مؤقت</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-extrabold text-primary-foreground shadow-[0_12px_22px_-14px_rgba(0,122,90,0.7)]">
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
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-background/85 text-muted-foreground shadow-[0_12px_24px_-20px_rgba(0,72,54,0.22)] transition-colors hover:text-foreground"
    >
      {children}
    </button>
  );
}
