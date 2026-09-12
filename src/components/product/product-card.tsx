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
 * Plain product card: image, name, price, one button. Nothing to decode.
 * Single-variant products add straight to the bag; shade products go to
 * the page to choose.
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

  return (
    <article className="group flex h-full flex-col" data-reveal style={{ "--d": `${(index % 4) * 60}ms` } as React.CSSProperties}>
      <Link href={href} className="relative block overflow-hidden bg-pink/60" aria-label={product.title}>
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

      <div className="flex flex-1 flex-col items-center pt-4 text-center">
        <h3 className="h-display text-[1.35rem]">
          <Link href={href} className="text-ink">
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 text-[0.62rem] tracking-wide2 uppercase text-plum">{multi ? `${product.variants.length} shades` : product.productType}</p>
        <Price price={product.priceRange.minVariantPrice} compareAt={product.compareAtPriceRange?.minVariantPrice} prefix={productHasRange(product) ? "from" : undefined} className="mt-2 text-base font-medium" />

        <div className="mt-4 w-full">
          {soldOut ? (
            <span className="btn btn-ghost w-full px-3 opacity-60">Sold out</span>
          ) : multi ? (
            <Link href={href} className="btn btn-primary w-full px-3">
              Choose shade
            </Link>
          ) : (
            <button
              type="button"
              onClick={quickAdd}
              disabled={state === "adding" || isPending}
              aria-label={`Add ${product.title} to bag`}
              className={cn("btn w-full px-3", state === "added" ? "btn-rose" : "btn-primary")}
            >
              {state === "added" ? (
                <>
                  <CheckIcon /> Added
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
