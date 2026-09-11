"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Collection, Product } from "@/lib/shopify/types";
import { ProductGrid } from "./product-grid";
import { SortSelect, type SortValue } from "./sort-select";
import { cn } from "@/lib/utils";

/**
 * Shared layout for /shop and /collections/[handle]:
 * breadcrumb, heading, category chips, sort, grid.
 * Sorting happens client-side so these pages stay fully static (ISR),
 * which keeps them fast and resilient during a traffic spike.
 */
export function CollectionView({
  title,
  description,
  products,
  collections,
  activeHandle,
}: {
  title: string;
  description?: string;
  products: Product[];
  collections: Collection[];
  activeHandle?: string;
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

  const chips = [
    { handle: "", title: "All", href: "/shop" },
    ...collections.map((c) => ({ handle: c.handle, title: c.title, href: `/collections/${c.handle}` })),
  ];

  return (
    <div className="container-lb py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-plum">
        <ol className="flex items-center gap-2">
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

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="h-display text-4xl md:text-5xl">{title}</h1>
          {description && <p className="mt-2 max-w-xl text-[0.95rem] text-plum">{description}</p>}
        </div>
        <p className="text-xs text-plum">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-y border-petal py-3 md:flex-row md:items-center md:justify-between">
        <ul className="flex gap-2 overflow-x-auto scrollbar-none" aria-label="Categories">
          {chips.map((chip) => {
            const active = (chip.handle || undefined) === activeHandle;
            return (
              <li key={chip.href} className="shrink-0">
                <Link
                  href={chip.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex rounded-full border px-4 py-1.5 text-xs tracking-wide transition-colors",
                    active ? "border-ink bg-ink text-white" : "border-petal bg-white text-ink hover:border-ink",
                  )}
                >
                  {chip.title}
                </Link>
              </li>
            );
          })}
        </ul>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      <div className="mt-8">
        <ProductGrid products={sorted} />
      </div>
    </div>
  );
}
