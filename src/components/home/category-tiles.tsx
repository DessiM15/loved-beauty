import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/shopify/types";
import { ArrowRightIcon } from "@/components/ui/icons";
import { placeholderTint } from "@/lib/utils";

/** Category entry points right under the hero: the fastest route to a product. */
export function CategoryTiles({ collections }: { collections: Collection[] }) {
  if (collections.length === 0) return null;
  return (
    <section className="container-lb -mt-2 py-12 md:py-16" aria-label="Shop by category">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {collections.map((c) => (
          <li key={c.id}>
            <Link
              href={`/collections/${c.handle}`}
              className="group relative block overflow-hidden rounded-2xl"
              style={{ background: placeholderTint(c.handle) }}
            >
              <div className="relative aspect-[4/5] md:aspect-[3/4]">
                {c.image && (
                  <Image
                    src={c.image.url}
                    alt={c.image.altText ?? c.title}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent p-4 pt-12 text-white">
                  <p className="font-serif text-xl leading-tight md:text-2xl">{c.title}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[0.62rem] tracking-luxe uppercase opacity-90">
                    Shop now <ArrowRightIcon width={12} height={12} />
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
