"use server";

import { getProducts } from "@/lib/shopify";

export type UpsellItem = {
  handle: string;
  title: string;
  price: string;
  image: string | null;
  variantId: string;
};

/**
 * Cheapest in-stock single-variant products that aren't already in the bag.
 * Small, impulse-friendly add-ons lift average order value without friction.
 */
export async function getUpsellsAction(excludeHandles: string[]): Promise<UpsellItem[]> {
  const exclude = new Set(excludeHandles);
  const products = await getProducts();
  return products
    .filter((p) => p.availableForSale && !exclude.has(p.handle) && p.variants.length === 1 && p.productType !== "Set")
    .sort((a, b) => Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount))
    .slice(0, 4)
    .map((p) => ({
      handle: p.handle,
      title: p.title,
      price: p.priceRange.minVariantPrice.amount,
      image: p.featuredImage?.url ?? null,
      variantId: p.variants[0].id,
    }));
}
