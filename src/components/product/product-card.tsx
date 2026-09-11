"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/shopify/types";
import { useCart } from "@/components/cart/cart-context";
import { Price } from "./price";
import { ProductPlaceholder } from "./product-placeholder";
import { cn, hasRealOptions, isOnSale, productHasRange } from "@/lib/utils";
import { PlusIcon, CheckIcon } from "@/components/ui/icons";

/**
 * Editorial product cell: square corners, image fills the cell, number in
 * the corner, second image on hover, a "+" quick-add that reveals on hover
 * (always visible on touch). Shade products go to the page to choose.
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

  async function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    setState("adding");
    const ok = await addItem(product.variants[0].id, 1);
    setState(ok ? "added" : "idle");
    if (ok) setTimeout(() => setState("idle"), 1800);
  }

  return (
    <article className="group relative flex h-full flex-col bg-cream" data-reveal style={{ "--d": `${(index % 4) * 80}ms` } as React.CSSProperties}>
      <Link href={href} className="relative block overflow-hidden bg-blush" aria-label={product.title}>
        <div className="relative aspect-[4/5]">
          {primary ? (
            <>
              <Image
                src={primary.url}
                alt={primary.altText ?? product.title}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                priority={priority}
                className={cn(
                  "object-cover transition-[transform,opacity] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]",
                  secondary && "group-hover:opacity-0",
                )}
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

        <span className="eyebrow-num absolute top-4 left-4">{String(index + 1).padStart(2, "0")}</span>
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
          {soldOut ? (
            <Tag>Sold out</Tag>
          ) : (
            <>
              {isBestseller && <Tag>Bestseller</Tag>}
              {sale && <Tag>Set &amp; save</Tag>}
            </>
          )}
        </div>

        {/* Quick add */}
        {!soldOut && (
          <div className="absolute right-4 bottom-4 translate-y-2 opacity-100 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            {multi ? (
              <span className="inline-flex h-11 items-center gap-2 border border-ink bg-cream/95 px-4 text-[0.6rem] tracking-luxe uppercase text-ink">Choose shade</span>
            ) : (
              <button
                type="button"
                onClick={quickAdd}
                disabled={state === "adding" || isPending}
                aria-label={`Add ${product.title} to bag`}
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center border transition-colors duration-300",
                  state === "added" ? "border-rose bg-rose text-white" : "border-ink bg-cream/95 text-ink hover:bg-ink hover:text-white",
                )}
              >
                {state === "added" ? <CheckIcon /> : <PlusIcon width={18} height={18} />}
              </button>
            )}
          </div>
        )}
      </Link>

      <div className="flex items-start justify-between gap-4 px-1 pt-4 pb-6">
        <div>
          <h3 className="text-[0.95rem] leading-snug">
            <Link href={href} className="link-underline text-ink">
              {product.title}
            </Link>
          </h3>
          <p className="mt-1 text-[0.62rem] tracking-wide2 uppercase text-plum">{multi ? `${product.variants.length} shades` : product.productType}</p>
        </div>
        <Price
          price={product.priceRange.minVariantPrice}
          compareAt={product.compareAtPriceRange?.minVariantPrice}
          prefix={productHasRange(product) ? "from" : undefined}
          className="shrink-0 font-serif text-lg"
        />
      </div>
    </article>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="border border-ink/70 bg-cream/90 px-2.5 py-1 text-[0.55rem] tracking-luxe uppercase text-ink">{children}</span>;
}
