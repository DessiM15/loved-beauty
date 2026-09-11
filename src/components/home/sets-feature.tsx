import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { Price } from "@/components/product/price";
import { SectionIntro } from "@/components/ui/section-intro";

const CUTOUTS: Record<string, string[]> = {
  "the-lip-ritual-set": ["/cutouts/sugar-lip-scrub.webp", "/cutouts/lustre-lip-gloss.webp"],
  "the-glow-duo": ["/cutouts/shimmer-glow-oil-spray.webp"],
};

/**
 * Sets as two large editorial tiles: product cut-outs floating over silk,
 * hairline-separated, price and save badge, whole tile is the link.
 */
export function SetsFeature({ sets }: { sets: Product[] }) {
  if (sets.length === 0) return null;
  return (
    <section className="hairline-t" aria-labelledby="sets-heading">
      <SectionIntro id="sets-heading" eyebrow="Sets & bundles" title="Better" italic="together." text="Curated pairings that save you a little and give a lot. Perfect for gifting, or for you." link={{ label: "All sets", href: "/collections/sets" }} />
      <ul className="grid hairline-t md:grid-cols-2">
        {sets.slice(0, 2).map((set, i) => {
          const cutouts = CUTOUTS[set.handle] ?? [];
          return (
            <li key={set.id} className="group relative border-b border-line md:border-b-0 md:[&:first-child]:border-r" data-reveal style={{ "--d": `${i * 120}ms` } as React.CSSProperties}>
              <Link href={`/products/${set.handle}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/4]">
                  <Image src="/editorial/silk-pink.webp" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-cream/35" />
                  {cutouts.length > 0 ? (
                    <div className="absolute inset-0 flex items-end justify-center gap-6 pb-[12%]">
                      {cutouts.map((src, j) => (
                        <div
                          key={src}
                          className="relative h-[62%] w-[38%] drop-shadow-[0_30px_40px_rgba(36,28,30,0.25)] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2"
                          style={{ transitionDelay: `${j * 80}ms` }}
                        >
                          <Image src={src} alt="" fill sizes="30vw" className="object-contain object-bottom" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    set.featuredImage && (
                      <Image src={set.featuredImage.url} alt={set.featuredImage.altText ?? set.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                    )
                  )}
                  {set.compareAtPriceRange && Number(set.compareAtPriceRange.minVariantPrice.amount) > Number(set.priceRange.minVariantPrice.amount) && (
                    <span className="absolute top-6 left-6 border border-ink bg-cream/90 px-3 py-1.5 text-[0.58rem] tracking-luxe uppercase">Set &amp; save</span>
                  )}
                </div>
                <div className="flex flex-col items-center px-6 py-7 text-center md:px-10">
                  <span className="eyebrow-num">0{i + 1}</span>
                  <h3 className="mt-1 font-serif text-3xl">{set.title}</h3>
                  <Price price={set.priceRange.minVariantPrice} compareAt={set.compareAtPriceRange?.minVariantPrice} className="mt-2 font-serif text-2xl" />
                  <p className="mt-3 max-w-md text-sm text-plum">{set.description}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
