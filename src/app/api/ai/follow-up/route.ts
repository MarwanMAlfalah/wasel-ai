import { NextResponse } from "next/server";
import { z } from "zod";

import { generateFollowUpMessage } from "@/lib/ai/generate-follow-up";

const requestSchema = z.object({
  invoiceData: z.object({
    clientName: z.string().nullable(),
    service: z.string().nullable(),
    remainingAmount: z.number().nullable(),
    currency: z.string().nullable(),
    dueDate: z.string().nullable(),
    paymentStatus: z.string().nullable(),
    agreementTone: z.string().nullable(),
    clientUrgency: z.string().nullable(),
    followUpStyle: z.string().nullable(),
  }),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = requestSchema.parse(body);
    const result = await generateFollowUpMessage(parsedBody.invoiceData);

    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(result);
    }

    const publicResult = {
      message: result.message,
      provider: result.provider,
      fallbackUsed: result.fallbackUsed,
    };

    return NextResponse.json(publicResult);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "بيانات الطلب غير صالحة" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "تعذر توليد رسالة المتابعة" },
      { status: 500 },
    );
  }
}
