import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function DeviceFrame({
  children,
  label,
  className,
  screenClassName,
}: {
  children: ReactNode;
  label?: string;
  className?: string;
  screenClassName?: string;
}) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[22rem]", className)}>
      {label ? (
        <div className="mb-3 flex justify-center">
          <span className="rounded-full border border-[#E8E3D6] bg-white/94 px-4 py-1.5 text-xs font-bold text-foreground shadow-[0_18px_38px_-30px_rgba(11,45,38,0.16)]">
            {label}
          </span>
        </div>
      ) : null}
      <div className="relative rounded-[3rem] border border-[#D6D2C3] bg-[#F4F2E8] p-2.5 shadow-[0_40px_84px_-50px_rgba(11,45,38,0.22)]">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f6f4ea)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-2.5">
            <div className="h-6 w-28 rounded-full bg-[#173F36]" />
          </div>
          <div
            className={cn(
              "relative min-h-[38rem] px-4 pb-4 pt-10 text-right",
              screenClassName,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
