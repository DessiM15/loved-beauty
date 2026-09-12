"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Collection, Product } from "@/lib/shopify/types";
import { ProductGrid } from "./product-grid";
import { SortSelect, type SortValue } from "./sort-select";
import { cn } from "@/lib/utils";

/**
 * Shop / collection page: a title, a row of category tabs, a sort control and
 * the grid. Sorting is client-side so the page stays static.
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

  const tabs = [{ handle: "", title: "All", href: "/shop" }, ...collections.map((c) => ({ handle: c.handle, title: c.title, href: `/collections/${c.handle}` }))];

  return (
    <div className="container-lb pb-16 md:pb-24">
      <div className="flex flex-col items-center pt-10 pb-8 text-center md:pt-14">
        <h1 className="h-display text-4xl md:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-md text-[0.95rem] text-plum">{description}</p>}
      </div>

      {/* Category tabs */}
      <nav aria-label="Categories" className="hairline-t hairline-b">
        <ul className="flex justify-start gap-7 overflow-x-auto py-4 scrollbar-none md:justify-center">
          {tabs.map((tab) => {
            const active = (tab.handle || undefined) === activeHandle;
            return (
              <li key={tab.href} className="shrink-0">
                <Link href={tab.href} aria-current={active ? "page" : undefined} className={cn("link-underline text-[0.7rem] font-medium tracking-luxe uppercase", active ? "text-ink" : "text-plum hover:text-ink")}>
                  {tab.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex items-center justify-between py-5">
        <span className="text-[0.66rem] tracking-luxe uppercase text-plum">
          {products.length} {products.length === 1 ? "product" : "products"}
        </span>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      <ProductGrid products={sorted} />
    </div>
  );
}
