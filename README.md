# واصل AI — Wasil AI

> حوّل اتفاق العميل إلى فاتورة واضحة ومتابعة أذكى  
> An Arabic-first AI assistant that turns client conversations into invoices, payment tracking, and smart follow-ups.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Convex](https://img.shields.io/badge/Convex-Backend-orange)
![AI Powered](https://img.shields.io/badge/AI-Powered-0F8B6D)
![Arabic RTL](https://img.shields.io/badge/Arabic-RTL-7A8B83)

## Repository

GitHub repository:  
https://github.com/MarwanMAlfalah/wasel-ai

## The Story / Why Wasil AI

Most freelancers do not begin with a formal contract, a finance tool, or a structured CRM. They begin with a message.

Inside that WhatsApp conversation is the real agreement: the service, the amount, the deadline, the payment plan, and the expectations. The work starts there, but the details usually stay trapped inside chat threads.

Wasil AI is built for that moment. It takes the messy, real-world client conversation and turns it into something structured, trackable, and easier to follow up on. Instead of asking freelancers to change how they work, it starts from how they already work.

## Problem

- Agreements are hidden inside chat messages.
- Invoice creation is manual.
- Follow-up messages are repetitive and awkward.
- Payment status is hard to track.
- Freelancers lack a quick financial snapshot per project.
- Expenses and expected profit are often tracked separately or not tracked at all.

## Solution

Wasil AI lets the freelancer paste a client conversation, extract the agreement with AI, review the details, create an invoice, share a public invoice link, track whether the client viewed it, add project expenses, calculate expected profit, and generate a natural Arabic follow-up message.

## Key Features

- Arabic AI agreement extraction
- Invoice creation from chat
- Public invoice links
- Invoice view tracking
- Expense tracking
- Expected profit calculation
- AI-generated Arabic/Saudi-style follow-up messages
- Multi-provider AI support
- Convex-backed persistence
- Local fallback for demo stability
- Arabic RTL interface

## Product Flow

1. Paste client conversation
2. AI extracts agreement details
3. Review and edit fields
4. Generate invoice
5. Share public invoice link
6. Client opens invoice
7. View status is tracked
8. Add project expenses
9. Dashboard updates financial summary
10. Generate follow-up message

## Demo Scenario

1. Open the landing page.
2. Click `ابدأ الآن`.
3. Paste a sample client conversation.
4. Review the extracted agreement fields.
5. Create the invoice.
6. Open the public invoice link.
7. Return to the dashboard and confirm view status.
8. Add a project expense.
9. Check the expected profit.
10. Generate a follow-up message.

Sample Arabic conversation:

```text
السلام عليكم، اتفقنا على تصميم موقع بقيمة 3000 ريال، دفعة أولى 1000 ريال والباقي بعد التسليم يوم 20 ديسمبر.
```

## Screenshots / Demo Preview

![Landing Page](./public/screenshots/landing.png)
![Conversation Input](./public/screenshots/conversation.png)
![Extraction Review](./public/screenshots/extraction.png)
![Invoice Details](./public/screenshots/invoice.png)
![Follow-up Message](./public/screenshots/follow-up.png)

Screenshots can be added under `public/screenshots/`.

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js, React, TypeScript | App UI and routing |
| Styling | Tailwind CSS, shadcn/ui, Tajawal | Arabic RTL design system |
| Backend | Convex | Database and server functions |
| API | Next.js API Routes | AI and invoice server bridge |
| AI | Gemini, OpenAI, Claude, Grok | Agreement extraction and follow-up |
| Fallback | Mock provider/local fallback | Demo stability |
| Deployment | Vercel + Convex Cloud | Hosting target |

## Architecture

```text
Client UI
   ↓
Next.js Pages / App Router
   ↓
Next.js API Routes
   ↓
AI Provider Layer ─── Gemini / OpenAI / Claude / Grok / Mock
   ↓
Convex Backend
   ↓
Invoices / Links / Views / Expenses / Financial Summary
```

The frontend handles the Arabic RTL user experience, including conversation input, extraction review, invoice details, and follow-up generation. The product is designed around an Arabic-first freelancer workflow rather than a generic billing UI.

Next.js API routes act as the secure server-side bridge for AI and backend operations. They receive extraction and follow-up requests, call the selected provider layer, and coordinate invoice-related operations without exposing provider secrets to the browser.

The AI provider layer keeps the app flexible across Gemini, OpenAI, Claude, Grok, and a local mock fallback. Convex stores structured invoices, public links, view events, expenses, and financial summaries so the MVP is not just static screens, but a working end-to-end flow.

## Backend and Data Model

The Convex schema currently includes these main tables:

- `workspaces`: stores workspace and demo workspace context.
- `invoices`: stores structured invoice and agreement data.
- `invoiceLinks`: stores public invoice tokens and aggregated view state.
- `invoiceViewEvents`: stores public invoice view events.
- `expenses`: stores project expenses linked to invoices.

Convex is the main persistence layer for the real app flow. Local fallback storage exists only to keep the demo stable when backend or provider conditions are unavailable.

## AI Provider System

- `AI_PROVIDER` selects the active provider.
- Real AI is attempted first.
- Mock fallback is used only if the provider fails, the key is missing, quota is exhausted, billing is unavailable, or JSON validation fails.
- Gemini is the practical working provider when configured correctly.
- OpenAI and Claude are supported, but may fallback if quota or billing is unavailable.
- The abstraction prevents vendor lock-in and keeps the app flexible.

The AI is used for:

- extracting invoice data from Arabic conversations
- detecting amounts, currency, dates, and payment status
- analyzing tone and urgency
- generating Arabic/Saudi-friendly follow-up messages

## Getting Started

```bash
git clone https://github.com/MarwanMAlfalah/wasel-ai.git
cd wasel-ai
npm install
npx convex dev
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Environment Setup

Create `.env.local` with placeholder values only:

```bash
AI_PROVIDER=gemini

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-3-5-sonnet-latest

GROK_API_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=
CONVEX_DEPLOYMENT=
```

Security note:  
Never commit `.env.local` or real API keys to GitHub. Keep all provider keys and deployment secrets local or inside the deployment platform environment variables.

## Test the AI Endpoint

```bash
curl -s -X POST http://localhost:3000/api/ai/extract \
  -H "Content-Type: application/json" \
  --data-binary @- <<'JSON'
{"conversationText":"السلام عليكم، اتفقنا على تصميم موقع بقيمة 3000 ريال، دفعة أولى 1000 ريال والباقي بعد التسليم يوم 20 ديسمبر."}
JSON
```

Expected response:

- structured agreement data
- selected provider
- `fallbackUsed: false` when the real provider succeeds

You can check provider health with:

```bash
curl http://localhost:3000/api/ai/health
```

## Available Scripts

- `npm run dev`: starts the Next.js app.
- `npm run build`: creates a production build.
- `npm run lint`: checks code quality.
- `npx convex dev`: starts Convex development backend.

## Business Model

Wasil AI follows a freemium SaaS model.

Plans:

- Free: limited trial for first-time users.
- Freelancer: 49 SAR/month for active freelancers.
- Professional: 99 SAR/month for advanced usage.
- Business: 299 SAR/month for small teams and studios.

The free plan helps users understand the workflow, while paid tiers support more invoices, follow-ups, expense tracking, and financial visibility.

## Roadmap

- Payment gateway integration
- WhatsApp sharing improvements
- Mobile app experience
- More invoice templates
- Team workspaces
- More Arabic tone customization
- Client CRM features
- Analytics dashboard
- PDF invoice export
- Multi-currency support

## Hackathon Context

This MVP was built for SalamHack 2026.

The goal is to demonstrate a working AI-powered workflow for freelancers, not just static screens.

It focuses on a practical Arabic-first use case: turning messy client agreements into structured invoices, smart follow-ups, and clearer project finances.

## Team

Wasil AI Team

Roles:

- Product and pitch
- UX/UI
- Frontend
- Backend / Convex
- AI integration
- Demo and presentation

## License

For hackathon evaluation purposes.
