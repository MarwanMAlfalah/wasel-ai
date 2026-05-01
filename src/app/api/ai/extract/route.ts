import { NextResponse } from "next/server";
import { z } from "zod";

import { extractAgreement } from "@/lib/ai/extract-agreement";

const requestSchema = z.object({
  conversationText: z.string().min(1),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = requestSchema.parse(body);
    const result = await extractAgreement(parsedBody.conversationText);

    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(result);
    }

    const publicResult = {
      data: result.data,
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
      { error: "تعذر تنفيذ تحليل المحادثة" },
      { status: 500 },
    );
  }
}
