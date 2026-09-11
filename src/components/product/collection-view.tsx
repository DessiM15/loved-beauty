"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Collection, Product } from "@/lib/shopify/types";
import { ProductGrid } from "./product-grid";
import { SortSelect, type SortValue } from "./sort-select";
import { cn } from "@/lib/utils";
import Image from "next/image";

/**
 * Collection page: full-bleed editorial banner (header sits over it) with a
 * centered, spotlighted title; hairline toolbar; hairline product grid.
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
  banner?: { src: string; alt: string; position?: string } | null;
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
      <section className="relative flex min-h-[56vh] flex-col justify-center overflow-hidden md:min-h-[64vh]" style={{ background: "#120d0e" }} data-hero-tone="dark">
        {banner && (
          <>
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: banner.position ?? "50% 50%", animation: "ken-burns 2.4s cubic-bezier(0.16,1,0.3,1) both" }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(18,13,14,0.55) 0%, rgba(18,13,14,0.1) 30%, rgba(18,13,14,0.25) 60%, rgba(18,13,14,0.92) 100%)" }} />
          </>
        )}
        <div className="container-lb relative flex flex-col items-center pt-[calc(var(--header-h)+3rem)] pb-12 text-center md:pb-16">
          <div className="relative flex flex-col items-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-24 -inset-y-14 md:-inset-x-48 md:-inset-y-24"
              style={{ background: "radial-gradient(ellipse at center, rgba(18,13,14,0.75) 0%, rgba(18,13,14,0.55) 40%, rgba(18,13,14,0.2) 62%, rgba(18,13,14,0) 76%)" }}
            />
            <nav aria-label="Breadcrumb" className="relative mb-4 text-[0.62rem] tracking-luxe uppercase animate-fade-up" style={{ color: "#c9b6bb" }}>
              <ol className="flex items-center gap-3">
                <li>
                  <Link href="/" className="hover:opacity-80">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/shop" className="hover:opacity-80">
                    Shop
                  </Link>
                </li>
                {activeHandle && (
                  <>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page" style={{ color: "#f5ece6" }}>
                      {title}
                    </li>
                  </>
                )}
              </ol>
            </nav>
            <h1 className="h-display relative text-6xl md:text-8xl animate-fade-up" style={{ animationDelay: "120ms", color: "#f5ece6" }}>
              {title}
            </h1>
            {description && (
              <p className="relative mt-4 max-w-md text-[0.98rem] animate-fade-up" style={{ animationDelay: "240ms", color: "#c9b6bb" }}>
                {description}
              </p>
            )}
          </div>
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
