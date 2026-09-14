"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/shopify/types";
import { useCart } from "@/components/cart/cart-context";
import { Price } from "./price";
import { ProductPlaceholder } from "./product-placeholder";
import { cn, hasRealOptions, isOnSale, productHasRange } from "@/lib/utils";
import { CheckIcon } from "@/components/ui/icons";

/**
 * Product card (option 1G): the photo in a bordered cream box, the name in the
 * serif, then price on the left and a small light-pink "Add to bag" on the
 * right. Single-variant products add straight to the bag; shade products go
 * to the page to choose.
 */
export function ProductCard({ product, priority = false, index = 0 }: { product: Product; priority?: boolean; index?: number }) {
  const { addItem, isPending } = useCart();
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");
  const href = `/products/${product.handle}`;
  const [primary, secondary] = product.images;
  const multi = hasRealOptions(product) && product.variants.length > 1;
  const soldOut = !product.availableForSale;
  const isBestseller = product.tags.includes("bestseller");
  const sale = isOnSale(product);

  async function quickAdd() {
    setState("adding");
    const ok = await addItem(product.variants[0].id, 1);
    setState(ok ? "added" : "idle");
    if (ok) setTimeout(() => setState("idle"), 1800);
  }

  const pill = "inline-flex items-center gap-1.5 whitespace-nowrap rounded-[2px] px-2.5 py-2 text-[0.58rem] font-medium tracking-[0.2em] uppercase transition-colors md:px-3.5 md:py-2.5 md:text-[0.62rem]";

  return (
    <article className="group flex h-full flex-col" data-reveal style={{ "--d": `${(index % 4) * 60}ms` } as React.CSSProperties}>
      <Link href={href} className="relative block overflow-hidden border border-line bg-cream" aria-label={product.title}>
        <div className="relative aspect-[4/5]">
          {primary ? (
            <>
              <Image
                src={primary.url}
                alt={primary.altText ?? product.title}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                priority={priority}
                className={cn("object-cover transition-[transform,opacity] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]", secondary && "group-hover:opacity-0")}
              />
              {secondary && (
                <Image
                  src={secondary.url}
                  alt={secondary.altText ?? product.title}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <ProductPlaceholder title={product.title} handle={product.handle} />
          )}
        </div>
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {soldOut ? <Tag>Sold out</Tag> : isBestseller ? <Tag>Bestseller</Tag> : sale ? <Tag>Set &amp; save</Tag> : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-3.5 text-left">
        <h3 className="h-display text-[1.2rem] md:text-[1.5rem]">
          <Link href={href} className="text-ink">
            {product.title}
          </Link>
        </h3>
        {multi && <p className="mt-1 text-[0.6rem] tracking-wide2 uppercase text-plum">{product.variants.length} shades</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-[0.8rem] md:text-[0.85rem]">
          <Price price={product.priceRange.minVariantPrice} compareAt={product.compareAtPriceRange?.minVariantPrice} prefix={productHasRange(product) ? "from" : undefined} />
          {soldOut ? (
            <span className={cn(pill, "border border-line text-plum")}>Sold out</span>
          ) : multi ? (
            <Link href={href} className={cn(pill, "bg-pink text-ink hover:bg-ink hover:text-white")}>
              Choose shade
            </Link>
          ) : (
            <button
              type="button"
              onClick={quickAdd}
              disabled={state === "adding" || isPending}
              aria-label={`Add ${product.title} to bag`}
              className={cn(pill, state === "added" ? "bg-ink text-white" : "bg-pink text-ink hover:bg-ink hover:text-white", "disabled:opacity-60")}
            >
              {state === "added" ? (
                <>
                  <CheckIcon width={12} height={12} /> Added
                </>
              ) : state === "adding" ? (
                "Adding…"
              ) : (
                "Add to bag"
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="bg-white/90 px-2.5 py-1 text-[0.55rem] font-medium tracking-luxe uppercase text-ink">{children}</span>;
}
