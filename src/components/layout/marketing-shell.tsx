import type { ReactNode } from "react";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#F5F3EC]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(circle_at_top,rgba(238,245,240,0.96),rgba(245,243,236,0.92)_48%,transparent_74%)]" />
      <div className="absolute top-20 start-[-6rem] -z-10 h-[22rem] w-[22rem] rounded-full bg-[#E9F3EC] blur-[110px]" />
      <div className="absolute top-52 end-[-7rem] -z-10 h-[28rem] w-[28rem] rounded-full bg-[#F0EEE4] blur-[120px]" />
      <div className="absolute inset-x-0 top-[34rem] -z-10 h-[44rem] bg-[linear-gradient(180deg,rgba(245,243,236,0),rgba(245,243,236,0.9),rgba(245,243,236,1))]" />
      <main className="relative flex min-h-screen w-full flex-col">
        {children}
      </main>
    </div>
  );
}
