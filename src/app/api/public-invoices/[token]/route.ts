import { NextResponse } from "next/server";
import { makeFunctionReference } from "convex/server";
import { z } from "zod";

import { getConvexServerClient, isConvexConfigured } from "@/lib/convex/server";

const paramsSchema = z.object({
  token: z.string(),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  if (!isConvexConfigured()) {
    return NextResponse.json(
      { error: "Convex is not configured" },
      { status: 503 },
    );
  }

  try {
    const params = await context.params;
    const { token } = paramsSchema.parse(params);
    const client = getConvexServerClient();
    const invoice = await client.query(
      makeFunctionReference<"query">("invoices:getInvoiceByToken"),
      {
        token,
      },
    );

    if (!invoice) {
      return NextResponse.json(
        { error: "الفاتورة غير موجودة" },
        { status: 404 },
      );
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "رمز الفاتورة غير صالح" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "تعذر تحميل الفاتورة العامة" },
      { status: 500 },
    );
  }
}
