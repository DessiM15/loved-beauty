import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/shopify/types";
import { categoryPanels } from "@/content/site";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * Full-bleed category panels separated by hairlines. Numbered eyebrow,
 * serif title, gold rule, one line, "Shop" on hover. Image scales and
 * lifts slightly on hover. Stacks to full-width rows on phones.
 */
export function CategoryPanels({ collections }: { collections: Collection[] }) {
  const panels = categoryPanels
    .map((p) => ({ ...p, collection: collections.find((c) => c.handle === p.handle) }))
    .filter((p) => p.collection);

  return (
    <section className="hairline-t hairline-b" aria-label="Shop by category">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {panels.map((p, i) => (
          <li key={p.handle} className="group relative border-b border-line last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0">
            <Link href={`/collections/${p.handle}`} className="relative block overflow-hidden" aria-label={`Shop ${p.title}`}>
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[3/4.4]">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(36,28,30,0)_45%,rgba(36,28,30,0.55)_100%)] transition-opacity duration-700 group-hover:opacity-90" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8" data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
                <span className="eyebrow-num text-gold-soft">0{i + 1}</span>
                <h3 className="h-display mt-2 text-3xl md:text-[2.2rem]">{p.title}</h3>
                <span className="mt-3 block h-px w-10 bg-gold transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-16" />
                <p className="mt-3 max-w-[16rem] text-sm text-white/80">{p.text}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[0.62rem] tracking-luxe uppercase opacity-80 transition-[opacity,transform] duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                  Shop {p.title} <ArrowRightIcon width={12} height={12} />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
