# واصل AI

واجهة MVP عربية RTL لفكرة مساعد مالي ذكي للفريلانسر العربي.

## التشغيل المحلي

```bash
npm install
npm run dev
```

## إعداد مزود الذكاء الاصطناعي

أضف القيم التالية إلى ملف `.env.local`:

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
GROK_API_KEY=
```

- `AI_PROVIDER` يدعم: `openai`, `gemini`, `anthropic`, `grok`, `mock`
- إذا اخترت مزودًا حقيقيًا ولم تضف مفتاحه، سيتم التحويل تلقائيًا إلى `mock`
- إذا فشل المزود الحقيقي أثناء الاستخراج، سيتم استخدام `mock` كـ fallback للحفاظ على تدفق الديمو

## مسار الاستخراج الحالي

- المستخدم يلصق المحادثة في `/app/new`
- الطلب يذهب إلى `POST /api/ai/extract`
- النتيجة تُحفظ مؤقتًا في المتصفح ثم تظهر في `/app/extractions/demo`
- لا توجد قاعدة بيانات أو Convex schema بعد في هذه المرحلة
