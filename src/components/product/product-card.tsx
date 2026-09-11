"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/shopify/types";
import { useCart } from "@/components/cart/cart-context";
import { Price } from "./price";
import { ProductPlaceholder } from "./product-placeholder";
import { cn, hasRealOptions, isOnSale, productHasRange } from "@/lib/utils";
import { BagIcon } from "@/components/ui/icons";

/**
 * Collection grid card. Same pattern as Kylie / e.l.f.:
 * single-variant products add straight to the bag; shade products go to the
 * product page to choose. Hover swaps to the second image if there is one.
 */
export function ProductCard({ product, priority = false, index = 0 }: { product: Product; priority?: boolean; index?: number }) {
  const { addItem, isPending } = useCart();
  const [adding, setAdding] = useState(false);
  const href = `/products/${product.handle}`;
  const [primary, secondary] = product.images;
  const multi = hasRealOptions(product) && product.variants.length > 1;
  const soldOut = !product.availableForSale;
  const isBestseller = product.tags.includes("bestseller");
  const isNew = product.tags.includes("new");
  const sale = isOnSale(product);

  async function quickAdd() {
    setAdding(true);
    await addItem(product.variants[0].id, 1);
    setAdding(false);
  }

  return (
    <article className="group relative flex flex-col" style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}>
      <Link href={href} className="relative block overflow-hidden rounded-2xl bg-blush" aria-label={product.title}>
        <div className="relative aspect-[4/5]">
          {primary ? (
            <>
              <Image
                src={primary.url}
                alt={primary.altText ?? product.title}
                fill
                sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
                priority={priority}
                className={cn(
                  "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]",
                  secondary && "group-hover:opacity-0",
                )}
              />
              {secondary && (
                <Image
                  src={secondary.url}
                  alt={secondary.altText ?? product.title}
                  fill
                  sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <ProductPlaceholder title={product.title} handle={product.handle} />
          )}
        </div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {soldOut ? (
            <Badge tone="ink">Sold out</Badge>
          ) : (
            <>
              {isBestseller && <Badge tone="gold">Bestseller</Badge>}
              {isNew && <Badge tone="rose">New</Badge>}
              {sale && <Badge tone="rose">Set &amp; save</Badge>}
            </>
          )}
        </div>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[0.95rem] leading-snug">
            <Link href={href} className="text-ink hover:text-rose-deep">
              {product.title}
            </Link>
          </h3>
          <p className="mt-0.5 text-xs text-plum">
            {multi ? `${product.variants.length} shades` : product.productType}
          </p>
        </div>
        <Price
          price={product.priceRange.minVariantPrice}
          compareAt={product.compareAtPriceRange?.minVariantPrice}
          prefix={productHasRange(product) ? "from" : undefined}
          className="shrink-0 text-sm"
        />
      </div>

      <div className="mt-3">
        {soldOut ? (
          <button type="button" disabled className="btn btn-ghost w-full">
            Sold out
          </button>
        ) : multi ? (
          <Link href={href} className="btn btn-ghost w-full">
            Choose shade
          </Link>
        ) : (
          <button
            type="button"
            onClick={quickAdd}
            disabled={adding || isPending}
            className="btn btn-ghost w-full group-hover:border-ink group-hover:bg-ink group-hover:text-white"
          >
            <BagIcon width={16} height={16} /> {adding ? "Adding…" : "Add to bag"}
          </button>
        )}
      </div>
    </article>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "gold" | "rose" | "ink" }) {
  const tones = {
    gold: "bg-white/90 text-ink ring-1 ring-gold",
    rose: "bg-rose text-white",
    ink: "bg-ink text-white",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[0.6rem] tracking-[0.14em] uppercase", tones[tone])}>
      {children}
    </span>
  );
}
