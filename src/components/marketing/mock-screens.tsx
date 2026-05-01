import { CheckCircle2, ChevronLeft, Mic, Paperclip, Search, Send } from "lucide-react";

function ScreenHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-[1.8rem] bg-white/92 px-4 py-3 shadow-[0_18px_32px_-28px_rgba(0,72,54,0.18)]">
      <div className="text-left text-[11px] font-medium text-muted-foreground">
        9:41
      </div>
      <div className="space-y-0.5 text-right">
        <p className="text-sm font-extrabold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "mint";
}) {
  return (
    <div
      className={`rounded-[1.35rem] border px-3 py-3 ${
        tone === "mint"
          ? "border-primary/14 bg-primary/6"
          : "border-border/80 bg-white/86"
      }`}
    >
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-foreground">{value}</p>
    </div>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-primary/14 bg-primary/6 px-3 py-1 text-[11px] font-bold text-primary">
      {children}
    </span>
  );
}

function Bubble({
  tone = "light",
  children,
}: {
  tone?: "light" | "brand";
  children: string;
}) {
  return (
    <div
      className={`max-w-[85%] rounded-[1.4rem] px-3.5 py-3 text-xs leading-6 shadow-sm ${
        tone === "brand"
          ? "self-start bg-[linear-gradient(135deg,rgba(0,122,90,0.96),rgba(11,96,74,0.9))] text-primary-foreground"
          : "self-end border border-border/80 bg-white/92 text-foreground"
      }`}
    >
      {children}
    </div>
  );
}

export function ChatScreenPreview() {
  return (
    <div className="space-y-4">
      <ScreenHeader title="محادثة العميل" subtitle="تحويل الاتفاق إلى بيانات" />
      <div className="space-y-2.5 rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(242,251,246,0.94))] p-3.5">
        <Bubble>
          نحتاج تصميم واجهات التطبيق، العربون 10,000 ريال والباقي عند التسليم.
        </Bubble>
        <Bubble tone="brand">
          تم. مدة التنفيذ 12 يومًا، وموعد الدفعة الأخيرة يوم 28.
        </Bubble>
        <Bubble>ارسل الفاتورة بعد مراجعة النسخة النهائية.</Bubble>
      </div>
      <div className="rounded-[2rem] border border-border/80 bg-white/90 p-3 shadow-[0_18px_32px_-28px_rgba(0,72,54,0.18)]">
        <div className="mb-3 flex flex-wrap gap-2">
          <Chip>واتساب</Chip>
          <Chip>استخراج عربي</Chip>
          <Chip>فهم الدفعات</Chip>
        </div>
        <div className="flex items-center gap-2 rounded-[1.5rem] border border-border/80 bg-background px-3 py-2.5">
          <Paperclip className="size-4 text-muted-foreground" />
          <p className="flex-1 text-sm text-muted-foreground">
            الصق المحادثة هنا...
          </p>
          <Mic className="size-4 text-muted-foreground" />
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Send className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

export function ReviewScreenPreview() {
  return (
    <div className="space-y-4">
      <ScreenHeader title="مراجعة التفاصيل" subtitle="كل شيء واضح قبل الإصدار" />
      <div className="grid gap-2.5">
        <MiniMetric label="اسم العميل" value="متجر نور" />
        <MiniMetric label="الخدمة" value="تصميم تجربة التطبيق" tone="mint" />
        <div className="grid grid-cols-2 gap-2.5">
          <MiniMetric label="الإجمالي" value="25,000 ريال" />
          <MiniMetric label="المدفوع" value="10,000 ريال" />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <MiniMetric label="المتبقي" value="15,000 ريال" tone="mint" />
          <MiniMetric label="موعد الاستحقاق" value="28 يونيو" />
        </div>
      </div>
      <div className="rounded-[1.7rem] border border-dashed border-primary/16 bg-primary/6 px-4 py-3">
        <p className="text-xs font-bold text-primary">تم استخراج الاتفاق</p>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">
          واصل ربط العميل بالخدمة والدفعة المتبقية وموعد السداد تلقائيًا.
        </p>
      </div>
    </div>
  );
}

export function InvoiceScreenPreview() {
  return (
    <div className="space-y-4">
      <ScreenHeader title="الفاتورة الذكية" subtitle="رابط عام وجاهزية مشاركة" />
      <div className="rounded-[2rem] border border-border/80 bg-white/92 p-4 shadow-[0_22px_38px_-28px_rgba(0,72,54,0.2)]">
        <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-3">
          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">رقم الفاتورة</p>
            <p className="text-base font-extrabold text-foreground">WA-320145</p>
          </div>
          <Chip>مدفوع جزئيًا</Chip>
        </div>
        <div className="mt-3 grid gap-2.5">
          <MiniMetric label="الخدمة" value="تصميم واجهات التطبيق" />
          <div className="grid grid-cols-2 gap-2.5">
            <MiniMetric label="الإجمالي" value="25,000" />
            <MiniMetric label="المتبقي" value="15,000" tone="mint" />
          </div>
          <MiniMetric label="رابط الفاتورة" value="wasil.ai/i/wa..." tone="mint" />
        </div>
      </div>
      <div className="flex items-center justify-between rounded-[1.7rem] bg-[linear-gradient(135deg,rgba(0,122,90,0.96),rgba(11,96,74,0.9))] px-4 py-3 text-primary-foreground">
        <div>
          <p className="text-xs text-primary-foreground/70">الحالة الذكية</p>
          <p className="mt-1 text-sm font-bold">تمت مشاهدة الفاتورة</p>
        </div>
        <CheckCircle2 className="size-5" />
      </div>
    </div>
  );
}

export function SummaryScreenPreview() {
  return (
    <div className="space-y-4">
      <ScreenHeader title="ملخص المشروع" subtitle="أرقام واضحة قبل المتابعة" />
      <div className="grid gap-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <MiniMetric label="قيمة المشروع" value="25,000 ريال" tone="mint" />
          <MiniMetric label="المدفوع" value="10,000 ريال" />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <MiniMetric label="المتبقي" value="15,000 ريال" />
          <MiniMetric label="المصاريف" value="2,300 ريال" />
        </div>
        <MiniMetric label="الربح المتوقع" value="22,700 ريال" tone="mint" />
      </div>
      <div className="rounded-[1.7rem] border border-border/80 bg-white/90 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold text-foreground">وضع المشروع</p>
          <Chip>اليوم</Chip>
        </div>
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-muted">
            <div className="h-2 w-[72%] rounded-full bg-primary" />
          </div>
          <p className="text-xs leading-6 text-muted-foreground">
            العميل فتح الفاتورة، والمبلغ المتبقي ما زال يحتاج متابعة لطيفة.
          </p>
        </div>
      </div>
    </div>
  );
}

export function DashboardScreenPreview() {
  return (
    <div className="space-y-4">
      <ScreenHeader title="لوحة التحكم" subtitle="آخر الفواتير والربح المتوقع" />
      <div className="grid grid-cols-2 gap-2.5">
        <MiniMetric label="المتبقي" value="15,000" tone="mint" />
        <MiniMetric label="الربح" value="22,700" />
      </div>
      <div className="space-y-2.5 rounded-[1.8rem] bg-white/92 p-3.5">
        {[
          ["WA-320145", "متجر نور", "تمت المشاهدة"],
          ["WA-320101", "عيادة لامعة", "لم يشاهد بعد"],
          ["WA-319980", "مقهى هدوء", "مدفوع جزئيًا"],
        ].map(([number, client, status]) => (
          <div
            key={number}
            className="flex items-center justify-between rounded-[1.35rem] border border-border/80 px-3 py-2.5"
          >
            <ChevronLeft className="size-4 text-muted-foreground" />
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{number}</p>
              <p className="text-[11px] text-muted-foreground">{client}</p>
            </div>
            <span className="text-[11px] font-bold text-primary">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PublicInvoiceScreenPreview() {
  return (
    <div className="space-y-4">
      <ScreenHeader title="الرابط العام" subtitle="تجربة واضحة للعميل" />
      <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(0,122,90,0.95),rgba(11,96,74,0.9))] p-4 text-primary-foreground">
        <p className="text-xs text-primary-foreground/72">فاتورة من واصل AI</p>
        <p className="mt-2 text-lg font-extrabold">طلب دفع منظم وواضح</p>
        <p className="mt-2 text-xs leading-6 text-primary-foreground/80">
          العميل يرى الخدمة والمبلغ المتبقي والرابط في تجربة هادئة ومقنعة.
        </p>
      </div>
      <div className="grid gap-2.5">
        <MiniMetric label="الخدمة" value="تصميم واجهات التطبيق" />
        <MiniMetric label="المبلغ المتبقي" value="15,000 ريال" tone="mint" />
        <MiniMetric label="المشاهدة" value="تم تسجيل مشاهدة الفاتورة" />
      </div>
    </div>
  );
}

export function FollowUpScreenPreview() {
  return (
    <div className="space-y-4">
      <ScreenHeader title="رسالة متابعة" subtitle="نبرة عربية مناسبة" />
      <div className="rounded-[2rem] border border-border/80 bg-white/92 p-4">
        <p className="text-sm font-extrabold text-foreground">رسالة واتساب جاهزة</p>
        <p className="mt-3 text-xs leading-7 text-muted-foreground">
          هلا، يعطيكم العافية. حبيت أذكركم بالمبلغ المتبقي 15,000 ريال لمشروع
          تصميم واجهات التطبيق، وإذا تم التحويل يسعدني تأكيد الاستلام مباشرة.
        </p>
      </div>
      <div className="flex items-center justify-between rounded-[1.6rem] border border-primary/14 bg-primary/6 px-4 py-3">
        <div className="text-right">
          <p className="text-xs font-bold text-primary">نبرة مناسبة</p>
          <p className="mt-1 text-xs text-muted-foreground">
            واضحة، لطيفة، وتحافظ على العلاقة المهنية.
          </p>
        </div>
        <Search className="size-4 text-primary" />
      </div>
    </div>
  );
}
