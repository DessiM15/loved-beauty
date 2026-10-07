import { getCollectionProducts, getProducts } from "@/lib/shopify";
import { bestsellers as copy } from "@/content/site";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { Bestsellers } from "@/components/home/bestsellers";

export const revalidate = 60;

/** Home, option 1G: the photo hero, the trust strip, four bestsellers. Everything else is one click away. */
export default async function HomePage() {
  let products = await getCollectionProducts("bestsellers").catch(() => []);
  if (products.length === 0) products = (await getProducts().catch(() => [])).filter((p) => p.tags.includes("bestseller"));
  return (
    <>
      <Hero />
      <TrustStrip />
      <Bestsellers products={products.slice(0, copy.count)} />
    </>
  );
}
