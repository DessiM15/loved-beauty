import "server-only";

import type { Cart, CartLine, Collection, Product, ShopPolicy } from "./types";
import { CACHE_TAGS, isShopifyConfigured, shopifyFetch, unwrap } from "./client";
import * as q from "./queries";
import * as mock from "@/lib/mock/commerce";

/**
 * Commerce facade.
 * Every page and component imports from here. When Shopify env vars are
 * present, calls go to the Storefront API; otherwise the local mock catalog
 * is used so the site is fully browsable before the client's store is ready.
 */

const PRODUCT_REVALIDATE = 60; // seconds; webhook revalidation makes this a safety net only.

/* ----------------------------- reshaping ----------------------------- */

type RawMetafield = { value: string } | null;
type RawProduct = Omit<Product, "images" | "variants" | "details"> & {
  images: { edges: { node: Product["images"][number] }[] };
  variants: { edges: { node: Product["variants"][number] }[] };
  benefits?: RawMetafield;
  howToUse?: RawMetafield;
  ingredients?: RawMetafield;
};

function parseList(value?: string | null): string[] | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    /* plain text, split on newlines */
  }
  return value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function reshapeProduct(raw: RawProduct | null): Product | null {
  if (!raw) return null;
  const { images, variants, benefits, howToUse, ingredients, ...rest } = raw;
  return {
    ...rest,
    images: unwrap(images),
    variants: unwrap(variants),
    details: {
      benefits: parseList(benefits?.value),
      howToUse: howToUse?.value ?? undefined,
      ingredients: ingredients?.value ?? undefined,
      badges: ["Vegan", "Cruelty-free", "Clean", "Paraben-free"],
    },
  };
}

function reshapeProducts(list: RawProduct[]): Product[] {
  return list.map((p) => reshapeProduct(p)).filter((p): p is Product => Boolean(p));
}

type RawCart = Omit<Cart, "lines"> & { lines: { edges: { node: CartLine }[] } };
function reshapeCart(raw: RawCart | null): Cart | null {
  if (!raw) return null;
  return { ...raw, lines: unwrap(raw.lines) };
}

/* ------------------------------ catalog ------------------------------ */

export type ProductSort = "featured" | "newest" | "price-asc" | "price-desc" | "best-selling";

function sortArgs(sort: ProductSort): { sortKey: string; reverse: boolean } {
  switch (sort) {
    case "newest":
      return { sortKey: "CREATED_AT", reverse: true };
    case "price-asc":
      return { sortKey: "PRICE", reverse: false };
    case "price-desc":
      return { sortKey: "PRICE", reverse: true };
    case "best-selling":
      return { sortKey: "BEST_SELLING", reverse: false };
    default:
      return { sortKey: "RELEVANCE", reverse: false };
  }
}

export async function getProducts(opts: { sort?: ProductSort; query?: string; first?: number } = {}): Promise<Product[]> {
  if (!isShopifyConfigured()) return mock.getProducts(opts);
  const { sortKey, reverse } = sortArgs(opts.sort ?? "featured");
  const data = await shopifyFetch<{ products: { edges: { node: RawProduct }[] } }>({
    query: q.getProductsQuery,
    variables: { first: opts.first ?? 100, sortKey, reverse, query: opts.query },
    tags: [CACHE_TAGS.products],
    revalidate: PRODUCT_REVALIDATE,
  });
  return reshapeProducts(unwrap(data.products));
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured()) return mock.getProduct(handle);
  const data = await shopifyFetch<{ product: RawProduct | null }>({
    query: q.getProductQuery,
    variables: { handle },
    tags: [CACHE_TAGS.products],
    revalidate: PRODUCT_REVALIDATE,
  });
  return reshapeProduct(data.product);
}

export async function getProductRecommendations(product: Product, limit = 4): Promise<Product[]> {
  if (!isShopifyConfigured()) return mock.getProductRecommendations(product.handle, limit);
  try {
    const data = await shopifyFetch<{ productRecommendations: RawProduct[] | null }>({
      query: q.getProductRecommendationsQuery,
      variables: { productId: product.id },
      tags: [CACHE_TAGS.products],
      revalidate: PRODUCT_REVALIDATE,
    });
    const recs = reshapeProducts(data.productRecommendations ?? []).filter((p) => p.handle !== product.handle);
    if (recs.length >= 2) return recs.slice(0, limit);
  } catch {
    /* fall through to a simple same-type fallback */
  }
  const all = await getProducts();
  return all.filter((p) => p.handle !== product.handle && p.productType === product.productType).slice(0, limit);
}

export async function getCollections(): Promise<Collection[]> {
  if (!isShopifyConfigured()) return mock.getCollections();
  const data = await shopifyFetch<{ collections: { edges: { node: Collection }[] } }>({
    query: q.getCollectionsQuery,
    tags: [CACHE_TAGS.collections],
    revalidate: PRODUCT_REVALIDATE,
  });
  // Shopify auto-creates a hidden "frontpage" collection; skip it.
  return unwrap(data.collections).filter((c) => !c.handle.startsWith("frontpage"));
}

export async function getCollection(handle: string): Promise<Collection | null> {
  if (!isShopifyConfigured()) return mock.getCollection(handle);
  const data = await shopifyFetch<{ collection: Collection | null }>({
    query: q.getCollectionQuery,
    variables: { handle },
    tags: [CACHE_TAGS.collections],
    revalidate: PRODUCT_REVALIDATE,
  });
  return data.collection;
}

export async function getCollectionProducts(handle: string, sort: ProductSort = "featured"): Promise<Product[]> {
  if (!isShopifyConfigured()) return mock.getCollectionProducts(handle, sort);
  const map: Record<ProductSort, { sortKey: string; reverse: boolean }> = {
    featured: { sortKey: "COLLECTION_DEFAULT", reverse: false },
    newest: { sortKey: "CREATED", reverse: true },
    "price-asc": { sortKey: "PRICE", reverse: false },
    "price-desc": { sortKey: "PRICE", reverse: true },
    "best-selling": { sortKey: "BEST_SELLING", reverse: false },
  };
  const data = await shopifyFetch<{ collection: { products: { edges: { node: RawProduct }[] } } | null }>({
    query: q.getCollectionProductsQuery,
    variables: { handle, ...map[sort] },
    tags: [CACHE_TAGS.collections, CACHE_TAGS.products],
    revalidate: PRODUCT_REVALIDATE,
  });
  return reshapeProducts(unwrap(data.collection?.products));
}

export async function getShopPolicies(): Promise<ShopPolicy[]> {
  if (!isShopifyConfigured()) return mock.getShopPolicies();
  const data = await shopifyFetch<{
    shop: Record<"privacyPolicy" | "refundPolicy" | "shippingPolicy" | "termsOfService", ShopPolicy | null>;
  }>({ query: q.getShopPoliciesQuery, tags: [CACHE_TAGS.shop], revalidate: 3600 });
  return Object.values(data.shop).filter((p): p is ShopPolicy => Boolean(p));
}

/* ------------------------------- cart -------------------------------- */

export async function getCart(cartId: string): Promise<Cart | null> {
  if (!isShopifyConfigured()) return mock.getCart(cartId);
  const data = await shopifyFetch<{ cart: RawCart | null }>({
    query: q.getCartQuery,
    variables: { cartId },
    cache: "no-store",
  });
  return reshapeCart(data.cart);
}

export async function createCart(lines: { merchandiseId: string; quantity: number }[] = []): Promise<Cart> {
  if (!isShopifyConfigured()) return mock.createCart(lines);
  const data = await shopifyFetch<{ cartCreate: { cart: RawCart; userErrors: { message: string }[] } }>({
    query: q.createCartMutation,
    variables: { lines },
    cache: "no-store",
  });
  const cart = reshapeCart(data.cartCreate.cart);
  if (!cart) throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(", ") || "Could not create cart");
  return cart;
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  if (!isShopifyConfigured()) return mock.addToCart(cartId, lines);
  const data = await shopifyFetch<{ cartLinesAdd: { cart: RawCart; userErrors: { message: string }[] } }>({
    query: q.addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  const cart = reshapeCart(data.cartLinesAdd.cart);
  if (!cart) throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join(", ") || "Could not add to cart");
  return cart;
}

export async function updateCart(cartId: string, lines: { id: string; merchandiseId: string; quantity: number }[]): Promise<Cart> {
  if (!isShopifyConfigured()) return mock.updateCart(cartId, lines);
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: RawCart; userErrors: { message: string }[] } }>({
    query: q.updateCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  const cart = reshapeCart(data.cartLinesUpdate.cart);
  if (!cart) throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join(", ") || "Could not update cart");
  return cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  if (!isShopifyConfigured()) return mock.removeFromCart(cartId, lineIds);
  const data = await shopifyFetch<{ cartLinesRemove: { cart: RawCart; userErrors: { message: string }[] } }>({
    query: q.removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });
  const cart = reshapeCart(data.cartLinesRemove.cart);
  if (!cart) throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join(", ") || "Could not update cart");
  return cart;
}

/* ---------------------------- marketing ------------------------------ */

/**
 * Newsletter signup. With Shopify connected this creates a customer record with
 * marketing consent, which Shopify Email (or Klaviyo) picks up automatically.
 */
export async function subscribeEmail(email: string): Promise<{ ok: boolean; message?: string }> {
  if (!isShopifyConfigured()) return mock.subscribeEmail(email);
  const data = await shopifyFetch<{
    customerCreate: { customer: { id: string } | null; customerUserErrors: { code: string; message: string }[] };
  }>({
    query: q.customerCreateMutation,
    variables: { input: { email, acceptsMarketing: true, password: cryptoRandomPassword() } },
    cache: "no-store",
  });
  const errors = data.customerCreate.customerUserErrors;
  if (data.customerCreate.customer) return { ok: true };
  // "TAKEN" means they already have an account: treat as success for UX.
  if (errors.some((e) => e.code === "TAKEN")) return { ok: true };
  return { ok: false, message: errors[0]?.message ?? "Could not subscribe" };
}

function cryptoRandomPassword(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export { isShopifyConfigured };
