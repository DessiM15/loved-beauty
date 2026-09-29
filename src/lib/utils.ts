import type { Image, Money, Product } from "@/lib/shopify/types";
import { site } from "@/content/site";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function formatMoney(money: Money | null | undefined): string {
  if (!money) return "";
  const n = Number(money.amount);
  if (money.currencyCode === "USD") return usd.format(n);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: money.currencyCode }).format(n);
}

export function productHasRange(product: Product): boolean {
  return product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;
}

export function isOnSale(product: Product): boolean {
  const cmp = product.compareAtPriceRange?.minVariantPrice?.amount;
  return Boolean(cmp && Number(cmp) > Number(product.priceRange.minVariantPrice.amount));
}

export function hasRealOptions(product: Product): boolean {
  return product.options.some((o) => !(o.name === "Title" && o.values.length === 1 && o.values[0] === "Default Title"));
}

export function truncate(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).trimEnd() + "…";
}

export function absoluteUrl(path: string): string {
  const base = site.url;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Alt text for a product photo. Uses what was typed in Shopify, unless that is
 * empty or just the file name ("IMG_6285.jpg", "lip-gloss-2"), in which case
 * the product name (and shade) is read instead.
 */
export function imageAlt(image: Pick<Image, "altText"> | null | undefined, fallback: string): string {
  const alt = image?.altText?.trim();
  if (!alt) return fallback;
  const looksLikeFile = /\.(jpe?g|png|webp|gif|avif|heic)$/i.test(alt) || (!/\s/.test(alt) && /[_\-\d]/.test(alt));
  return looksLikeFile ? fallback : alt;
}

/** Deterministic placeholder tint for products with no photo yet. */
export function placeholderTint(seed: string): string {
  const tints = ["#fbe9ec", "#f7dde3", "#fdf1ea", "#f4e6ea", "#fbeee6"];
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return tints[h % tints.length];
}
