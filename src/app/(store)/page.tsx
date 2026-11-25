import { getCollectionProducts, getProduct, getProducts } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";
import { bestsellers as copy } from "@/content/site";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { Bestsellers } from "@/components/home/bestsellers";

export const revalidate = 60;

/** Home, option 1G: the photo hero, the trust strip, the client's three featured products. Everything else is one click away. */
export default async function HomePage() {
  const picked = await Promise.all(copy.handles.map((handle) => getProduct(handle).catch(() => null)));
  let products = picked.filter((p): p is Product => p !== null);
  if (products.length === 0) products = await getCollectionProducts("bestsellers").catch(() => []);
  if (products.length === 0) products = (await getProducts().catch(() => [])).filter((p) => p.tags.includes("bestseller"));
  return (
    <>
      <Hero />
      <TrustStrip />
      <Bestsellers products={products.slice(0, copy.count)} />
    </>
  );
}
