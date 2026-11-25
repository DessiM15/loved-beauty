import "server-only";
import { SHOPIFY_API_VERSION } from "./client";

/**
 * The opening-day gift count, read from the Shopify Admin API.
 *
 * The first LAUNCH_GIFT.total orders of LAUNCH_GIFT.minSubtotal or more
 * (products after discounts, before shipping and tax) get a free gift, which
 * the owner adds by hand. This only counts; it never changes an order.
 *
 * Required env, from the "Loved Beauty order counter" app in the Shopify Dev
 * Dashboard (scope: read_orders):
 *   SHOPIFY_ADMIN_CLIENT_ID
 *   SHOPIFY_ADMIN_CLIENT_SECRET
 * Optional:
 *   LAUNCH_GIFT_START   ISO time the offer opens; orders before it don't count
 */
export const LAUNCH_GIFT = {
  total: 80,
  minSubtotal: 30,
  start: process.env.LAUNCH_GIFT_START ?? "2026-11-27T11:59:00-06:00",
} as const;

export type GiftCount = { ok: true; total: number; claimed: number; left: number } | { ok: false; reason: "not-configured" | "auth" | "query" };

function domain(): string {
  return (process.env.SHOPIFY_STORE_DOMAIN ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "");
}

let token: { value: string; expires: number } | null = null;

async function adminToken(): Promise<string | null> {
  if (token && token.expires > Date.now()) return token.value;
  const res = await fetch(`https://${domain()}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SHOPIFY_ADMIN_CLIENT_ID ?? "",
      client_secret: process.env.SHOPIFY_ADMIN_CLIENT_SECRET ?? "",
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) return null;
  // Tokens last about a day; renew ten minutes early.
  token = { value: json.access_token, expires: Date.now() + Math.max(60, (json.expires_in ?? 3600) - 600) * 1000 };
  return token.value;
}

const ORDERS = /* GraphQL */ `
  query LaunchGiftOrders($query: String!, $after: String) {
    orders(first: 250, query: $query, after: $after, sortKey: CREATED_AT) {
      nodes {
        test
        cancelledAt
        currentSubtotalPriceSet { shopMoney { amount } }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

type OrdersPage = {
  data?: {
    orders: {
      nodes: { test: boolean; cancelledAt: string | null; currentSubtotalPriceSet: { shopMoney: { amount: string } } }[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  };
  errors?: unknown;
};

let memo: { at: number; value: GiftCount } | null = null;
const FRESH_MS = 45_000;

/** Gifts claimed so far, at most 45 seconds old. Never throws. */
export async function getGiftCount(): Promise<GiftCount> {
  if (memo && Date.now() - memo.at < FRESH_MS) return memo.value;
  const value = await load();
  // A failure is only held briefly so the next visitor tries again.
  memo = { at: value.ok ? Date.now() : Date.now() - FRESH_MS + 5_000, value };
  return value;
}

async function load(): Promise<GiftCount> {
  if (!domain() || !process.env.SHOPIFY_ADMIN_CLIENT_ID || !process.env.SHOPIFY_ADMIN_CLIENT_SECRET) return { ok: false, reason: "not-configured" };
  try {
    const access = await adminToken();
    if (!access) return { ok: false, reason: "auth" };

    let claimed = 0;
    let after: string | null = null;
    // Stop as soon as every gift is spoken for; four pages is 1,000 orders.
    for (let page = 0; page < 4 && claimed < LAUNCH_GIFT.total; page++) {
      const res = await fetch(`https://${domain()}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": access },
        body: JSON.stringify({ query: ORDERS, variables: { query: `created_at:>='${LAUNCH_GIFT.start}'`, after } }),
        cache: "no-store",
      });
      if (res.status === 401) token = null;
      if (!res.ok) return { ok: false, reason: "query" };
      const json = (await res.json()) as OrdersPage;
      if (!json.data || json.errors) return { ok: false, reason: "query" };
      for (const o of json.data.orders.nodes) {
        if (o.test || o.cancelledAt) continue;
        if (Number(o.currentSubtotalPriceSet.shopMoney.amount) >= LAUNCH_GIFT.minSubtotal) claimed++;
      }
      if (!json.data.orders.pageInfo.hasNextPage) break;
      after = json.data.orders.pageInfo.endCursor;
    }
    claimed = Math.min(claimed, LAUNCH_GIFT.total);
    return { ok: true, total: LAUNCH_GIFT.total, claimed, left: LAUNCH_GIFT.total - claimed };
  } catch {
    return { ok: false, reason: "query" };
  }
}
