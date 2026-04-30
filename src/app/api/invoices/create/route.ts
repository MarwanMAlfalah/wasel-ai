import { NextResponse } from "next/server";
import { makeFunctionReference } from "convex/server";
import { z } from "zod";

import { ensureDemoWorkspace, getConvexServerClient, isConvexConfigured } from "@/lib/convex/server";

const requestSchema = z.object({
  freelancerName: z.string(),
  clientName: z.string(),
  service: z.string(),
  totalAmount: z.number(),
  currency: z.string(),
  paidAmount: z.number(),
  remainingAmount: z.number(),
  deliveryDate: z.string().nullable(),
  dueDate: z.string().nullable(),
  paymentStatus: z.string(),
  agreementTone: z.string(),
  clientUrgency: z.string(),
  followUpStyle: z.string(),
  smartInsight: z.string(),
  confidence: z.number(),
});

export async function POST(request: Request) {
  if (!isConvexConfigured()) {
    return NextResponse.json(
      { error: "Convex is not configured" },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const args = requestSchema.parse(body);
    const client = getConvexServerClient();
    const workspaceId = await ensureDemoWorkspace();
    const result = await client.mutation(
      makeFunctionReference<"mutation">("invoices:createInvoice"),
      {
        workspaceId,
        ...args,
      },
    );

    return NextResponse.json({
      ...result,
      workspaceId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "بيانات الفاتورة غير صالحة" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "تعذر إنشاء الفاتورة في Convex" },
      { status: 500 },
    );
  }
}
