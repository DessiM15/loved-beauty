import Link from "next/link";
import { getCollectionProducts, getCollections } from "@/lib/shopify";
import { Hero } from "@/components/home/hero";
import { CategoryPanels } from "@/components/home/category-panels";
import { Statement } from "@/components/home/statement";
import { Ritual } from "@/components/home/ritual";
import { SetsFeature } from "@/components/home/sets-feature";
import { ShadeFinderBanner } from "@/components/home/shade-finder-banner";
import { InstagramGrid } from "@/components/home/instagram-grid";
import { NewsletterSection } from "@/components/marketing/newsletter-section";
import { ProductGrid } from "@/components/product/product-grid";
import { ArrowRightIcon } from "@/components/ui/icons";

export const revalidate = 60;

/**
 * Home flow: hero → categories → bestsellers → promise → ritual → sets →
 * shade finder → Instagram → email. Every section leads to a product.
 */
export default async function HomePage() {
  const [collections, bestsellers, sets] = await Promise.all([
    getCollections(),
    getCollectionProducts("bestsellers", "best-selling"),
    getCollectionProducts("sets"),
  ]);

  return (
    <>
      <Hero />
      <CategoryPanels collections={collections} />

      <section aria-labelledby="bestsellers-heading">
        <div className="container-lb flex flex-col gap-4 py-14 md:flex-row md:items-end md:justify-between md:py-20">
          <div>
            <p className="eyebrow" data-reveal>
              Most loved
            </p>
            <h2 id="bestsellers-heading" className="h-display mt-3 text-5xl md:text-6xl" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
              Bestsellers
            </h2>
          </div>
          <Link href="/shop" className="link-underline inline-flex items-center gap-2 self-start text-[0.68rem] tracking-luxe uppercase text-ink md:self-auto" data-reveal>
            Shop everything <ArrowRightIcon width={12} height={12} />
          </Link>
        </div>
        <div className="hairline-t hairline-b">
          <ProductGrid products={bestsellers.slice(0, 4)} />
        </div>
      </section>

      <Statement />
      <Ritual />
      <SetsFeature sets={sets} />
      <ShadeFinderBanner />
      <InstagramGrid />
      <NewsletterSection />
    </>
  );
}
