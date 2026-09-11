import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { Price } from "@/components/product/price";
import { ArrowRightIcon } from "@/components/ui/icons";

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
      <div className="container-lb flex flex-col gap-4 py-14 md:flex-row md:items-end md:justify-between md:py-20">
        <div>
          <p className="eyebrow" data-reveal>
            Sets &amp; bundles
          </p>
          <h2 id="sets-heading" className="h-display mt-3 text-5xl md:text-6xl" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
            Better <em className="h-italic text-rose-deep">together.</em>
          </h2>
        </div>
        <Link href="/collections/sets" className="link-underline inline-flex items-center gap-2 self-start text-[0.68rem] tracking-luxe uppercase text-ink md:self-auto" data-reveal>
          All sets <ArrowRightIcon width={12} height={12} />
        </Link>
      </div>
      <ul className="grid hairline-t md:grid-cols-2">
        {sets.slice(0, 2).map((set, i) => {
          const cutouts = CUTOUTS[set.handle] ?? [];
          return (
            <li key={set.id} className="group relative border-b border-line md:border-b-0 md:[&:first-child]:border-r" data-reveal style={{ "--d": `${i * 120}ms` } as React.CSSProperties}>
              <Link href={`/products/${set.handle}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/4]">
                  <Image src="/editorial/silk.webp" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-cream/20" />
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
                <div className="flex items-start justify-between gap-6 px-6 py-6 md:px-8">
                  <div>
                    <span className="eyebrow-num">0{i + 1}</span>
                    <h3 className="mt-1 font-serif text-3xl">{set.title}</h3>
                    <p className="mt-2 max-w-md text-sm text-plum">{set.description}</p>
                  </div>
                  <Price price={set.priceRange.minVariantPrice} compareAt={set.compareAtPriceRange?.minVariantPrice} className="shrink-0 pt-2 font-serif text-2xl" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
