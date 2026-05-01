"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderKanban,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquareMore,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/app",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    match: (pathname: string) => pathname === "/app",
  },
  {
    href: "/app/invoices/demo",
    label: "الفواتير",
    icon: FileText,
    match: (pathname: string) => pathname.startsWith("/app/invoices"),
  },
  {
    href: "/app",
    label: "المشاريع",
    icon: FolderKanban,
    match: () => false,
  },
  {
    href: "/app/invoices/demo/follow-up",
    label: "رسائل المتابعة",
    icon: MessageSquareMore,
    match: (pathname: string) => pathname.includes("/follow-up"),
  },
  {
    href: "/app#clients",
    label: "العملاء",
    icon: Users,
    match: (pathname: string) => pathname.startsWith("/app/clients"),
  },
  {
    href: "/app#assistant",
    label: "المساعدة الذكية",
    icon: Sparkles,
    match: (pathname: string) => pathname.startsWith("/app/assistant"),
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 lg:sticky lg:top-7 lg:w-[308px] xl:w-[320px]">
      <div className="overflow-hidden rounded-[2.15rem] border border-white/70 bg-sidebar/88 shadow-[0_28px_90px_-58px_rgba(0,72,54,0.42)] backdrop-blur-xl">
        <div className="border-b border-sidebar-border/70 px-5 py-5">
          <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(0,122,90,0.12),rgba(255,255,255,0.86))] px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-base font-extrabold text-sidebar-foreground">
                  مساحة العمل
                </p>
                <p className="text-sm text-muted-foreground">
                  نسخة تجريبية للفريلانسر السعودي
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                <Sparkles className="size-5" />
              </div>
            </div>
          </div>
        </div>

        <nav className="space-y-1.5 px-3 py-4">
          {navItems.map((item) => {
            const isActive = item.match(pathname);
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-[1.4rem] px-3 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "border border-primary/12 bg-[linear-gradient(135deg,rgba(0,122,90,0.16),rgba(255,255,255,0.96))] text-sidebar-foreground shadow-[0_18px_36px_-28px_rgba(0,122,90,0.65)]"
                    : "border border-transparent text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground",
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-2xl border transition-colors",
                      isActive
                        ? "border-primary/10 bg-white text-primary shadow-sm"
                        : "border-border/70 bg-white/78 text-primary",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span>{item.label}</span>
                </span>
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-opacity",
                    isActive
                      ? "bg-primary opacity-100"
                      : "bg-primary/25 opacity-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border/80 px-4 py-4">
          <div className="space-y-2">
            <Button
              asChild
              className="h-11 w-full justify-between rounded-2xl px-4 text-sm font-bold shadow-[0_18px_34px_-24px_rgba(0,122,90,0.7)]"
            >
              <Link href="/app/new">
                <span>إنشاء فاتورة</span>
                <Plus className="size-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="h-11 w-full justify-between rounded-2xl px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <span>تسجيل الخروج</span>
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="rounded-[1.6rem] border border-dashed border-primary/16 bg-[linear-gradient(180deg,rgba(0,122,90,0.06),rgba(255,255,255,0.84))] px-4 py-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                <HelpCircle className="size-4" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">
                  مساحة هادئة للمتابعة
                </p>
                <p className="text-sm leading-7 text-muted-foreground">
                  صممنا الواجهة لتكون خفيفة وواضحة حتى تركز على الاتفاقات
                  والفواتير بدون تشتيت.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
