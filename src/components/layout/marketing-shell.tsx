import type { ReactNode } from "react";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top,rgba(120,214,165,0.28),transparent_62%)]" />
      <div className="absolute inset-y-20 start-0 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute top-44 end-0 -z-10 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />
      <main className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
