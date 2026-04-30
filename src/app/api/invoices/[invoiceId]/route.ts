import { NextResponse } from "next/server";
import { makeFunctionReference } from "convex/server";
import { z } from "zod";

import { getConvexServerClient, isConvexConfigured } from "@/lib/convex/server";

const paramsSchema = z.object({
  invoiceId: z.string(),
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
    const invoice = await client.query(
      makeFunctionReference<"query">("invoices:getInvoiceById"),
      {
        invoiceId,
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
        { error: "معرّف الفاتورة غير صالح" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "تعذر تحميل الفاتورة" },
      { status: 500 },
    );
  }
}
