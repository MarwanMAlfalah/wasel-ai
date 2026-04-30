import type { ReactNode } from "react";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,oklch(0.929_0.055_165.76),transparent_65%)]" />
      <div className="absolute inset-y-24 start-0 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute inset-y-40 end-0 -z-10 h-72 w-72 rounded-full bg-accent/50 blur-3xl" />
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
