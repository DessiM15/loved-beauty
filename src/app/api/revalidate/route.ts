import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/shopify/client";

/**
 * Shopify webhook receiver. Subscribe these topics in Shopify Admin →
 * Settings → Notifications → Webhooks (or via the Admin API) and point them
 * at https://lovedbeautyshop.net/api/revalidate :
 *
 *   products/create, products/update, products/delete
 *   collections/create, collections/update, collections/delete
 *
 * Shopify signs each payload with SHOPIFY_WEBHOOK_SECRET (HMAC SHA-256).
 * When the client edits a product in Shopify, the site updates within seconds.
 */
export async function POST(req: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: false, message: "Webhook secret not configured" }, { status: 503 });

  const topic = req.headers.get("x-shopify-topic") ?? "";
  const hmac = req.headers.get("x-shopify-hmac-sha256") ?? "";
  const raw = await req.text();

  if (!(await verify(raw, hmac, secret))) {
    return NextResponse.json({ ok: false, message: "Invalid signature" }, { status: 401 });
  }

  if (topic.startsWith("products/")) {
    revalidateTag(CACHE_TAGS.products, "max");
    revalidateTag(CACHE_TAGS.collections, "max"); // product membership changes collections
  } else if (topic.startsWith("collections/")) {
    revalidateTag(CACHE_TAGS.collections, "max");
  } else if (topic.startsWith("shop/")) {
    revalidateTag(CACHE_TAGS.shop, "max");
  } else {
    return NextResponse.json({ ok: true, ignored: topic });
  }

  return NextResponse.json({ ok: true, revalidated: topic, at: new Date().toISOString() });
}

async function verify(payload: string, signature: string, secret: string): Promise<boolean> {
  if (!signature) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}
