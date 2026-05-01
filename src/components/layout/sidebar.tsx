"use client";

import { useEffect, useState } from "react";
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

import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";
import {
  getStoredConfirmedInvoices,
  getStoredInvoice,
  isLocalInvoiceId,
} from "@/lib/client-storage";
import { cn } from "@/lib/utils";

type SidebarItemId =
  | "dashboard"
  | "invoices"
  | "projects"
  | "follow-up"
  | "customers"
  | "assistant";

function getActiveSidebarItem(pathname: string): SidebarItemId | null {
  if (pathname === "/app") {
    return "dashboard";
  }

  const segments = pathname.split("/").filter(Boolean);
  const isAppRoute = segments[0] === "app";

  if (!isAppRoute) {
    return null;
  }

  if (pathname === "/app/new") {
    return null;
  }

  const isFollowUpRoute =
    segments[1] === "invoices" && segments[3] === "follow-up";

  if (isFollowUpRoute) {
    return "follow-up";
  }

  if (segments[1] === "invoices") {
    return "invoices";
  }

  if (segments[1] === "projects") {
    return "projects";
  }

  if (segments[1] === "customers" || segments[1] === "clients") {
    return "customers";
  }

  if (segments[1] === "assistant") {
    return "assistant";
  }

  return null;
}

export function Sidebar() {
  const pathname = usePathname();
  const [latestInvoiceHref, setLatestInvoiceHref] = useState("/app#recent-invoices");
  const [latestFollowUpHref, setLatestFollowUpHref] = useState("/app/new");
  const activeItem = getActiveSidebarItem(pathname);
  const isCreateInvoicePage = pathname === "/app/new";

  useEffect(() => {
    function syncInvoiceLinks() {
      const latestInvoice = getStoredConfirmedInvoices()[0] ?? getStoredInvoice();
      const invoiceId =
        latestInvoice?.id && !isLocalInvoiceId(latestInvoice.id)
          ? latestInvoice.id
          : latestInvoice?.id;

      if (!invoiceId) {
        setLatestInvoiceHref("/app#recent-invoices");
        setLatestFollowUpHref("/app/new");
        return;
      }

      setLatestInvoiceHref(`/app/invoices/${invoiceId}`);
      setLatestFollowUpHref(`/app/invoices/${invoiceId}/follow-up`);
    }

    syncInvoiceLinks();
    window.addEventListener("storage", syncInvoiceLinks);

    return () => {
      window.removeEventListener("storage", syncInvoiceLinks);
    };
  }, [pathname]);

  const navItems = [
    {
      id: "dashboard",
      href: "/app",
      label: "لوحة التحكم",
      icon: LayoutDashboard,
    },
    {
      id: "invoices",
      href: latestInvoiceHref,
      label: "الفواتير",
      icon: FileText,
    },
    {
      id: "projects",
      href: "/app",
      label: "المشاريع",
      icon: FolderKanban,
    },
    {
      id: "follow-up",
      href: latestFollowUpHref,
      label: "رسائل المتابعة",
      icon: MessageSquareMore,
    },
    {
      id: "customers",
      href: "/app#clients",
      label: "العملاء",
      icon: Users,
    },
    {
      id: "assistant",
      href: "/app#assistant",
      label: "المساعدة الذكية",
      icon: Sparkles,
    },
  ] as const;

  return (
    <aside className="w-full shrink-0 lg:sticky lg:top-7 lg:w-[308px] xl:w-[320px]">
      <div className="overflow-hidden rounded-[2.15rem] border border-white/70 bg-sidebar/88 shadow-[0_28px_90px_-58px_rgba(0,72,54,0.42)] backdrop-blur-xl">
        <div className="border-b border-sidebar-border/70 px-5 py-5">
          <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(0,122,90,0.12),rgba(255,255,255,0.86))] px-4 py-4">
            <BrandMark variant="header" subtitle={false} className="sm:hidden" />

            <div className="hidden sm:block">
              <BrandMark
                variant="app"
                subtitle="مساعدك المالي الذكي"
                className="justify-start"
              />
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                مساحة عمل للفريلانسر العربي بواجهة مرتبة وواضحة.
              </p>
            </div>
          </div>
        </div>

        <nav className="space-y-1.5 px-3 py-4">
          {navItems.map((item) => {
            const isActive = activeItem === item.id;
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
                        : "border-border/70 bg-white/78 text-primary group-hover:border-primary/10 group-hover:bg-white group-hover:text-primary",
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
              className={cn(
                "h-11 w-full justify-between rounded-2xl px-4 text-sm font-bold shadow-[0_18px_34px_-24px_rgba(0,122,90,0.7)]",
                isCreateInvoicePage &&
                  "bg-[#0B6C55] shadow-[0_18px_34px_-24px_rgba(11,108,85,0.78)] hover:bg-[#0B6C55]",
              )}
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
