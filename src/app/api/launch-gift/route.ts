import { NextResponse } from "next/server";
import { getGiftCount } from "@/lib/shopify/admin";

export const dynamic = "force-dynamic";

/** How many opening-day gifts are left. Counts only; holds no customer details. */
export async function GET() {
  const count = await getGiftCount();
  return NextResponse.json(count, {
    status: count.ok ? 200 : 503,
    headers: { "Cache-Control": count.ok ? "public, s-maxage=30, stale-while-revalidate=30" : "no-store" },
  });
}
