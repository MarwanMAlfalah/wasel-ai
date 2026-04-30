import { NextResponse } from "next/server";
import { makeFunctionReference } from "convex/server";
import { z } from "zod";

import { getConvexServerClient, isConvexConfigured } from "@/lib/convex/server";

const requestSchema = z.object({
  token: z.string().min(1),
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
    const { token } = requestSchema.parse(body);
    const client = getConvexServerClient();
    const result = await client.mutation(
      makeFunctionReference<"mutation">("invoices:markInvoiceViewed"),
      {
        token,
        userAgent: request.headers.get("user-agent"),
      },
    );

    if (!result) {
      return NextResponse.json(
        { error: "الفاتورة غير موجودة" },
        { status: 404 },
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "بيانات المشاهدة غير صالحة" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "تعذر تسجيل مشاهدة الفاتورة" },
      { status: 500 },
    );
  }
}
