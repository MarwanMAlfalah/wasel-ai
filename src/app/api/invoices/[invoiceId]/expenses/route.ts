import { NextResponse } from "next/server";
import { makeFunctionReference } from "convex/server";
import { z } from "zod";

import {
  ensureDemoWorkspace,
  getConvexServerClient,
  isConvexConfigured,
} from "@/lib/convex/server";

const paramsSchema = z.object({
  invoiceId: z.string(),
});

const requestSchema = z.object({
  workspaceId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().min(1),
  category: z.string().min(1),
  note: z.string().nullable().optional(),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ invoiceId: string }> },
) {
  if (!isConvexConfigured()) {
    return NextResponse.json(
      { error: "Convex is not configured" },
      { status: 503 },
    );
  }

  try {
    const params = await context.params;
    const { invoiceId } = paramsSchema.parse(params);
    const client = getConvexServerClient();
    const expenses = await client.query(
      makeFunctionReference<"query">("expenses:listExpensesByInvoice"),
      {
        invoiceId,
      },
    );

    return NextResponse.json({ expenses });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "معرّف الفاتورة غير صالح" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "تعذر تحميل مصاريف الفاتورة" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ invoiceId: string }> },
) {
  if (!isConvexConfigured()) {
    return NextResponse.json(
      { error: "Convex is not configured" },
      { status: 503 },
    );
  }

  try {
    const params = await context.params;
    const { invoiceId } = paramsSchema.parse(params);
    const body = await request.json();
    const payload = requestSchema.parse(body);
    const client = getConvexServerClient();
    const workspaceId = payload.workspaceId ?? (await ensureDemoWorkspace());
    const expense = await client.mutation(
      makeFunctionReference<"mutation">("expenses:addExpense"),
      {
        invoiceId,
        workspaceId,
        amount: payload.amount,
        currency: payload.currency,
        category: payload.category,
        note: payload.note ?? null,
      },
    );

    return NextResponse.json({ expense });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "بيانات المصروف غير صالحة" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "تعذر حفظ المصروف" },
      { status: 500 },
    );
  }
}
