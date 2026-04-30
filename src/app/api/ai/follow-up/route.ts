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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = requestSchema.parse(body);
    const result = await generateFollowUpMessage(parsedBody.invoiceData);

    return NextResponse.json(result);
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
