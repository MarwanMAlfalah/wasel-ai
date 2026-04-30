import type { Metadata } from "next";
import { Geist_Mono, Tajawal } from "next/font/google";

import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ToastProvider } from "@/components/shared/toast-provider";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "واصل AI",
  description: "مساعد مالي ذكي للفريلانسر العربي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <ConvexClientProvider>
          <ToastProvider>{children}</ToastProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
