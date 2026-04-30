import { NextResponse } from "next/server";
import { makeFunctionReference } from "convex/server";

import { ensureDemoWorkspace, getConvexServerClient, isConvexConfigured } from "@/lib/convex/server";

export async function GET() {
  if (!isConvexConfigured()) {
    return NextResponse.json(
      { error: "Convex is not configured" },
      { status: 503 },
    );
  }

  try {
    const client = getConvexServerClient();
    const workspaceId = await ensureDemoWorkspace();
    const invoices = await client.query(
      makeFunctionReference<"query">("invoices:listInvoices"),
      {
        workspaceId,
      },
    );

    return NextResponse.json({ invoices });
  } catch {
    return NextResponse.json(
      { error: "تعذر تحميل الفواتير" },
      { status: 500 },
    );
  }
}
