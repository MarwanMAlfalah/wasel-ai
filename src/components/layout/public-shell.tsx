import type { ReactNode } from "react";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(0,122,90,0.06),transparent_18%),radial-gradient(circle_at_top_right,rgba(132,209,171,0.2),transparent_20%)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[1080px] flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
    </div>
  );
}
