import "server-only";

/**
 * Low-level Shopify Storefront API client.
 *
 * Required env (see .env.example):
 *   SHOPIFY_STORE_DOMAIN               e.g. loved-beauty.myshopify.com
 *   SHOPIFY_STOREFRONT_ACCESS_TOKEN    public Storefront API token (Headless channel or custom app)
 *   SHOPIFY_API_VERSION                optional, defaults below
 */

export const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-10";

export const CACHE_TAGS = {
  products: "products",
  collections: "collections",
  cart: "cart",
  shop: "shop",
} as const;

/**
 * True when the site should talk to Shopify. Set COMMERCE_SOURCE=mock to force
 * the built-in placeholder catalog even when Shopify credentials are present
 * (useful while the client's store is still empty). Remove the var to go live.
 */
export function isShopifyConfigured(): boolean {
  if (process.env.COMMERCE_SOURCE === "mock") return false;
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);
}

function endpoint(): string {
  const domain = (process.env.SHOPIFY_STORE_DOMAIN ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`;
}

export class ShopifyError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly errors?: unknown,
  ) {
    super(message);
    this.name = "ShopifyError";
  }
}

type FetchOptions = {
  /** Cache tags for on-demand revalidation via the Shopify webhook. */
  tags?: string[];
  /** Seconds. Omit for uncached (cart mutations). */
  revalidate?: number | false;
  cache?: RequestCache;
};

export async function shopifyFetch<T>({
  query,
  variables,
  tags,
  revalidate,
  cache,
}: FetchOptions & { query: string; variables?: Record<string, unknown> }): Promise<T> {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!token) throw new ShopifyError("Shopify is not configured");

  const res = await fetch(endpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    next: {
      tags,
      revalidate: revalidate === undefined ? undefined : revalidate,
    },
  });

  const body = (await res.json().catch(() => null)) as { data?: T; errors?: unknown } | null;

  if (!res.ok || !body) {
    throw new ShopifyError(`Shopify request failed (${res.status})`, res.status, body?.errors);
  }
  if (body.errors) {
    throw new ShopifyError("Shopify GraphQL error", res.status, body.errors);
  }
  return body.data as T;
}

/** Flatten a Relay-style `{ edges: [{ node }] }` connection. */
export function unwrap<T>(connection: { edges: { node: T }[] } | null | undefined): T[] {
  return connection?.edges.map((e) => e.node) ?? [];
}
