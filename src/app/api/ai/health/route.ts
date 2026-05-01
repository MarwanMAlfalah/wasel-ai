import { NextResponse } from "next/server";

import { getAIHealthSnapshot } from "@/lib/ai/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getAIHealthSnapshot());
}
