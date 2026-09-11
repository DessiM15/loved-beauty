import { getCollectionProducts, getCollections } from "@/lib/shopify";
import { Hero } from "@/components/home/hero";
import { CategoryTiles } from "@/components/home/category-tiles";
import { ValueStrip } from "@/components/home/value-strip";
import { EditorialSplit } from "@/components/home/editorial-split";
import { InstagramGrid } from "@/components/home/instagram-grid";
import { TrustBar } from "@/components/home/trust-bar";
import { NewsletterSection } from "@/components/marketing/newsletter-section";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";

export const revalidate = 60;

const CATEGORY_ORDER = ["lips", "lip-care", "face-and-body-glow", "sets"];

/**
 * Home page flow (hero → category → bestsellers → proof → sets → email):
 * every section is a step toward a product page or the cart.
 */
export default async function HomePage() {
  const [collections, bestsellers, sets] = await Promise.all([
    getCollections(),
    getCollectionProducts("bestsellers", "best-selling"),
    getCollectionProducts("sets"),
  ]);

  const categories = CATEGORY_ORDER.map((h) => collections.find((c) => c.handle === h)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );

  return (
    <>
      <Hero />
      <CategoryTiles collections={categories} />

      <section className="container-lb py-6 md:py-10" aria-labelledby="bestsellers-heading">
        <SectionHeading
          eyebrow="Most loved"
          title="Bestsellers"
          text="The glosses, oils and glow sprays our community keeps coming back for."
          link={{ label: "Shop all", href: "/shop" }}
          align="left"
        />
        <ProductGrid products={bestsellers.slice(0, 8)} />
      </section>

      <div className="mt-12">
        <ValueStrip />
      </div>

      <EditorialSplit />

      {sets.length > 0 && (
        <section className="bg-white py-16 md:py-20" aria-labelledby="sets-heading">
          <div className="container-lb">
            <SectionHeading
              eyebrow="Sets & bundles"
              title="Better together."
              text="Curated pairings that save you a little and give a lot. Perfect for gifting, or for you."
              link={{ label: "Shop sets", href: "/collections/sets" }}
              align="left"
            />
            <ProductGrid products={sets} columns={3} priorityCount={0} />
          </div>
        </section>
      )}

      <TrustBar />
      <InstagramGrid />
      <NewsletterSection />
    </>
  );
}
