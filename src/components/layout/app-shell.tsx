import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(0,122,90,0.05),transparent_22%),linear-gradient(90deg,rgba(0,122,90,0.04),transparent_24%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:flex-row lg:items-start lg:px-8">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Topbar />
          <main className="flex-1 rounded-[2rem] border border-border/70 bg-white/88 p-4 shadow-[0_28px_80px_-48px_rgba(0,72,54,0.28)] backdrop-blur sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
