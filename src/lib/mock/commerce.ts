import "server-only";

import { cookies } from "next/headers";
import type { Cart, CartLine, Collection, Product, ShopPolicy } from "@/lib/shopify/types";
import type { ProductSort } from "@/lib/shopify";
import { mockCollectionMembership, mockCollections, mockProducts, mockRecommendations } from "./catalog";
import { policies } from "@/content/policies";

/**
 * Mock commerce adapter. Mirrors the Shopify facade one-to-one.
 * The cart is stored in a cookie so it survives navigation and refreshes
 * without any backend. Replaced entirely once Shopify is connected.
 */

const CART_COOKIE = "lb_mock_cart";

/* ------------------------------ catalog ------------------------------ */

function sortProducts(list: Product[], sort: ProductSort): Product[] {
  const copy = [...list];
  const price = (p: Product) => Number(p.priceRange.minVariantPrice.amount);
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => price(a) - price(b));
    case "price-desc":
      return copy.sort((a, b) => price(b) - price(a));
    case "newest":
      return copy.reverse();
    case "best-selling":
      return copy.sort((a, b) => Number(b.tags.includes("bestseller")) - Number(a.tags.includes("bestseller")));
    default:
      return copy;
  }
}

export async function getProducts(opts: { sort?: ProductSort; query?: string; first?: number } = {}): Promise<Product[]> {
  let list = mockProducts;
  if (opts.query) {
    const needle = opts.query.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.productType.toLowerCase().includes(needle) ||
        p.tags.some((t) => t.includes(needle)),
    );
  }
  return sortProducts(list, opts.sort ?? "featured").slice(0, opts.first ?? 100);
}

export async function getProduct(handle: string): Promise<Product | null> {
  return mockProducts.find((p) => p.handle === handle) ?? null;
}

export async function getProductRecommendations(handle: string, limit = 4): Promise<Product[]> {
  const handles = mockRecommendations[handle] ?? [];
  return handles
    .map((h) => mockProducts.find((p) => p.handle === h))
    .filter((p): p is Product => Boolean(p))
    .slice(0, limit);
}

export async function getCollections(): Promise<Collection[]> {
  return mockCollections;
}

export async function getCollection(handle: string): Promise<Collection | null> {
  return mockCollections.find((c) => c.handle === handle) ?? null;
}

export async function getCollectionProducts(handle: string, sort: ProductSort = "featured"): Promise<Product[]> {
  const handles = mockCollectionMembership[handle] ?? [];
  const list = handles.map((h) => mockProducts.find((p) => p.handle === h)).filter((p): p is Product => Boolean(p));
  return sortProducts(list, sort);
}

export async function getShopPolicies(): Promise<ShopPolicy[]> {
  return policies;
}

/* ------------------------------- cart -------------------------------- */

type StoredLine = { v: string; q: number }; // variant id, quantity

function findVariant(variantId: string) {
  for (const product of mockProducts) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}

function buildCart(id: string, stored: StoredLine[]): Cart {
  const lines: CartLine[] = [];
  for (const s of stored) {
    const hit = findVariant(s.v);
    if (!hit) continue;
    const { product, variant } = hit;
    const total = Number(variant.price.amount) * s.q;
    lines.push({
      id: `line:${variant.id}`,
      quantity: s.q,
      cost: { totalAmount: { amount: total.toFixed(2), currencyCode: "USD" } },
      merchandise: {
        id: variant.id,
        title: variant.title,
        selectedOptions: variant.selectedOptions,
        price: variant.price,
        image: variant.image ?? product.featuredImage,
        product: { id: product.id, handle: product.handle, title: product.title },
      },
    });
  }
  const subtotal = lines.reduce((sum, l) => sum + Number(l.cost.totalAmount.amount), 0);
  return {
    id,
    checkoutUrl: "/checkout-preview",
    totalQuantity: lines.reduce((n, l) => n + l.quantity, 0),
    cost: {
      subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: "USD" },
      totalAmount: { amount: subtotal.toFixed(2), currencyCode: "USD" },
      totalTaxAmount: null,
    },
    lines,
  };
}

async function readStored(): Promise<StoredLine[]> {
  const raw = (await cookies()).get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeStored(lines: StoredLine[]) {
  const jar = await cookies();
  jar.set(CART_COOKIE, JSON.stringify(lines), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getCart(cartId: string): Promise<Cart | null> {
  return buildCart(cartId, await readStored());
}

export async function createCart(lines: { merchandiseId: string; quantity: number }[] = []): Promise<Cart> {
  const stored = lines.map((l) => ({ v: l.merchandiseId, q: l.quantity }));
  await writeStored(stored);
  return buildCart("mock-cart", stored);
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const stored = await readStored();
  for (const l of lines) {
    const existing = stored.find((s) => s.v === l.merchandiseId);
    if (existing) existing.q += l.quantity;
    else stored.push({ v: l.merchandiseId, q: l.quantity });
  }
  await writeStored(stored);
  return buildCart(cartId, stored);
}

export async function updateCart(cartId: string, lines: { id: string; merchandiseId: string; quantity: number }[]): Promise<Cart> {
  let stored = await readStored();
  for (const l of lines) {
    const existing = stored.find((s) => s.v === l.merchandiseId);
    if (existing) existing.q = l.quantity;
  }
  stored = stored.filter((s) => s.q > 0);
  await writeStored(stored);
  return buildCart(cartId, stored);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const ids = new Set(lineIds.map((id) => id.replace(/^line:/, "")));
  const stored = (await readStored()).filter((s) => !ids.has(s.v));
  await writeStored(stored);
  return buildCart(cartId, stored);
}

/* ---------------------------- marketing ------------------------------ */

export async function subscribeEmail(email: string): Promise<{ ok: boolean; message?: string }> {
  console.info(`[mock] newsletter signup: ${email}`);
  return { ok: true };
}
