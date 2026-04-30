import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

let convexClient: ConvexHttpClient | null = null;

export function isConvexConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
}

export function getConvexServerClient() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is missing");
  }

  if (!convexClient) {
    convexClient = new ConvexHttpClient(convexUrl);
  }

  return convexClient;
}

export async function ensureDemoWorkspace() {
  const client = getConvexServerClient();
  return client.mutation(
    makeFunctionReference<"mutation">("invoices:ensureDemoWorkspace"),
    {},
  );
}
