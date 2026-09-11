"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Collection, Product } from "@/lib/shopify/types";
import { ProductGrid } from "./product-grid";
import { SortSelect, type SortValue } from "./sort-select";
import { cn } from "@/lib/utils";

/**
 * Collection page: full-bleed editorial banner (header sits over it),
 * hairline toolbar with category links and sort, hairline product grid.
 * Sorting is client-side so the page stays static.
 */
export function CollectionView({
  title,
  description,
  products,
  collections,
  activeHandle,
  banner,
}: {
  title: string;
  description?: string;
  products: Product[];
  collections: Collection[];
  activeHandle?: string;
  banner?: { src: string; alt: string } | null;
}) {
  const [sort, setSort] = useState<SortValue>("featured");

  const sorted = useMemo(() => {
    const list = [...products];
    const price = (p: Product) => Number(p.priceRange.minVariantPrice.amount);
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => price(a) - price(b));
      case "price-desc":
        return list.sort((a, b) => price(b) - price(a));
      case "newest":
        return list.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
      case "best-selling":
        return list.sort((a, b) => Number(b.tags.includes("bestseller")) - Number(a.tags.includes("bestseller")));
      default:
        return list;
    }
  }, [products, sort]);

  const chips = [{ handle: "", title: "All", href: "/shop" }, ...collections.map((c) => ({ handle: c.handle, title: c.title, href: `/collections/${c.handle}` }))];

  return (
    <div>
      {/* Banner */}
      <section className="relative flex min-h-[52vh] flex-col justify-end overflow-hidden bg-blush md:min-h-[62vh]">
        {banner && (
          <>
            <Image src={banner.src} alt={banner.alt} fill priority sizes="100vw" className="object-cover object-[50%_35%]" style={{ animation: "ken-burns 2.4s cubic-bezier(0.16,1,0.3,1) both" }} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,247,245,0.1)_0%,rgba(251,247,245,0)_40%,rgba(251,247,245,0.85)_100%)]" />
          </>
        )}
        <div className="container-lb relative pt-[calc(var(--header-h)+5rem)] pb-10 md:pb-14">
          <nav aria-label="Breadcrumb" className="mb-4 text-[0.62rem] tracking-luxe uppercase text-plum animate-fade-up">
            <ol className="flex items-center gap-3">
              <li>
                <Link href="/" className="hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/shop" className="hover:text-ink">
                  Shop
                </Link>
              </li>
              {activeHandle && (
                <>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-ink">
                    {title}
                  </li>
                </>
              )}
            </ol>
          </nav>
          <h1 className="h-display text-6xl md:text-8xl animate-fade-up" style={{ animationDelay: "120ms" }}>
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-md text-[0.98rem] text-plum animate-fade-up" style={{ animationDelay: "240ms" }}>
              {description}
            </p>
          )}
        </div>
      </section>

      {/* Toolbar */}
      <div className="sticky top-[var(--header-h)] z-30 hairline-t hairline-b bg-cream/95 backdrop-blur-sm">
        <div className="container-lb flex items-center justify-between gap-4 py-3">
          <ul className="flex gap-6 overflow-x-auto scrollbar-none" aria-label="Categories">
            {chips.map((chip) => {
              const active = (chip.handle || undefined) === activeHandle;
              return (
                <li key={chip.href} className="shrink-0">
                  <Link href={chip.href} aria-current={active ? "page" : undefined} className={cn("link-underline text-[0.66rem] tracking-luxe uppercase", active ? "text-ink" : "text-plum hover:text-ink")}>
                    {chip.title}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex shrink-0 items-center gap-5">
            <span className="hidden text-[0.62rem] tracking-luxe uppercase text-plum sm:inline">{products.length} products</span>
            <SortSelect value={sort} onChange={setSort} />
          </div>
        </div>
      </div>

      <div className="hairline-b">
        <ProductGrid products={sorted} />
      </div>
    </div>
  );
}
