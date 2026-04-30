import { NextResponse } from "next/server";
import { z } from "zod";

import { extractAgreement } from "@/lib/ai/extract-agreement";

const requestSchema = z.object({
  conversationText: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = requestSchema.parse(body);
    const result = await extractAgreement(parsedBody.conversationText);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "بيانات الطلب غير صالحة" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "تعذر تنفيذ تحليل المحادثة" },
      { status: 500 },
    );
  }
}
