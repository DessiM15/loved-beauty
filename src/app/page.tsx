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
import { SectionIntro } from "@/components/ui/section-intro";

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
        <SectionIntro id="bestsellers-heading" eyebrow="Most loved" title="Bestsellers" text="The glosses, oils and glow sprays our community keeps coming back for." link={{ label: "Shop everything", href: "/shop" }} />
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
