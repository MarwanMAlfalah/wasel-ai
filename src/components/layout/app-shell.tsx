import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(0,122,90,0.06),transparent_24%),radial-gradient(circle_at_top_right,rgba(123,212,165,0.18),transparent_18%),radial-gradient(circle_at_bottom_left,rgba(0,122,90,0.08),transparent_24%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1720px] flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:flex-row lg:items-start lg:gap-6 lg:px-7 xl:px-8">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-5">
          <Topbar />
          <main className="flex-1 rounded-[2.15rem] border border-white/70 bg-white/84 p-4 shadow-[0_36px_90px_-56px_rgba(0,72,54,0.28)] backdrop-blur-xl sm:p-6 lg:p-7">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
