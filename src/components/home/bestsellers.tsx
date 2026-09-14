import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { bestsellers } from "@/content/site";
import { ProductCard } from "@/components/product/product-card";
import { ArrowRightIcon } from "@/components/ui/icons";

/** "Shop Our Bestsellers": four cards on the ivory ground (option 1G). */
export function Bestsellers({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="bg-ivory py-16 md:py-24" aria-labelledby="bestsellers-heading">
      <div className="container-lb flex flex-col items-center text-center">
        <p className="eyebrow" data-reveal>
          {bestsellers.eyebrow}
        </p>
        <h2 id="bestsellers-heading" className="h-display mt-4 text-[2.6rem] md:text-[4rem]" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
          {bestsellers.headline}
        </h2>
        <div className="mt-9 grid w-full grid-cols-2 gap-x-3.5 gap-y-8 text-left md:mt-14 md:grid-cols-4 md:gap-7">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} priority={i < 2} />
          ))}
        </div>
        <Link href={bestsellers.link.href} className="link-underline mt-12 inline-flex items-center gap-2 text-[0.7rem] font-medium tracking-luxe uppercase text-ink" data-reveal>
          {bestsellers.link.label} <ArrowRightIcon width={12} height={12} />
        </Link>
      </div>
    </section>
  );
}
