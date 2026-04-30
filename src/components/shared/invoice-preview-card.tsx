import { FileText } from "lucide-react";

export function InvoicePreviewCard() {
  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_18px_60px_-54px_rgba(0,72,54,0.28)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            معاينة الفاتورة
          </p>
          <h3 className="mt-1 text-lg font-bold text-foreground">
            بطاقة شكلية مؤقتة
          </h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileText className="size-5" />
        </div>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-border bg-muted/40 p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded-full bg-primary/12" />
            <div className="h-2.5 w-32 rounded-full bg-border" />
          </div>
          <div className="h-10 w-10 rounded-2xl bg-primary/12" />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 rounded-2xl bg-white p-3 shadow-sm">
            <div className="h-2.5 w-20 rounded-full bg-border" />
            <div className="h-4 w-24 rounded-full bg-primary/15" />
          </div>
          <div className="space-y-2 rounded-2xl bg-white p-3 shadow-sm">
            <div className="h-2.5 w-16 rounded-full bg-border" />
            <div className="h-4 w-28 rounded-full bg-primary/15" />
          </div>
          <div className="sm:col-span-2 space-y-2 rounded-2xl bg-white p-3 shadow-sm">
            <div className="h-2.5 w-20 rounded-full bg-border" />
            <div className="h-2.5 w-full rounded-full bg-border" />
            <div className="h-2.5 w-5/6 rounded-full bg-border" />
          </div>
        </div>
      </div>
    </div>
  );
}
