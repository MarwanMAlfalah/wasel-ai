import type { ReactNode } from "react";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#F7F6ED]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(circle_at_top,rgba(238,248,241,0.95),transparent_62%)]" />
      <div className="absolute top-24 start-[-7rem] -z-10 h-[22rem] w-[22rem] rounded-full bg-[#EEF8F1] blur-3xl" />
      <div className="absolute top-56 end-[-8rem] -z-10 h-[30rem] w-[30rem] rounded-full bg-[#F0EEE0] blur-3xl" />
      <div className="absolute inset-x-0 top-[34rem] -z-10 h-[44rem] bg-[linear-gradient(180deg,rgba(247,246,237,0),rgba(247,246,237,0.9),rgba(247,246,237,1))]" />
      <main className="relative flex min-h-screen w-full flex-col">
        {children}
      </main>
    </div>
  );
}
