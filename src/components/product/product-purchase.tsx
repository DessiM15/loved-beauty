"use client";

import { useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { useCart } from "@/components/cart/cart-context";
import { Price } from "./price";
import { ProductGallery } from "./product-gallery";
import { hasRealOptions, cn } from "@/lib/utils";
import { BagIcon, CheckIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import { freeShippingThreshold, shadeColors } from "@/content/site";
import { ShadeFinderLink } from "./shade-finder-link";

/**
 * Product page top: gallery bleeding to the left edge, purchase panel right.
 * Shade options render as real colour swatches. One client component so
 * shade selection can drive the gallery.
 */
export function ProductPurchase({ product, children }: { product: Product; children?: React.ReactNode }) {
  const { addItem, isPending } = useCart();
  const showOptions = hasRealOptions(product);
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.variants[0].selectedOptions.map((o) => [o.name, o.value])),
  );
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const variant: ProductVariant | undefined = useMemo(
    () => product.variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)),
    [product.variants, selected],
  );

  const galleryIndex = useMemo(() => {
    if (!variant?.image) return 0;
    const i = product.images.findIndex((img) => img.url === variant.image?.url);
    return i >= 0 ? i : 0;
  }, [variant, product.images]);

  const lowStock = variant?.quantityAvailable != null && variant.quantityAvailable > 0 && variant.quantityAvailable <= 5;

  async function onAdd() {
    if (!variant) return;
    const ok = await addItem(variant.id, qty);
    if (ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2500);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr]">
      <div className="lg:border-r lg:border-line">
        <ProductGallery images={product.images} title={product.title} handle={product.handle} activeIndex={galleryIndex} />
      </div>

      <div className="px-5 py-10 sm:px-10 lg:sticky lg:top-[var(--header-h)] lg:self-start lg:px-14 lg:py-16">
        <p className="eyebrow">{product.productType}</p>
        <h1 className="h-display mt-3 text-5xl md:text-6xl">{product.title}</h1>
        <div className="mt-5 font-serif text-2xl">
          {variant ? <Price price={variant.price} compareAt={variant.compareAtPrice} /> : <Price price={product.priceRange.minVariantPrice} />}
        </div>

        <p className="mt-6 max-w-prose text-[0.97rem] leading-relaxed text-plum">{product.description}</p>

        {showOptions &&
          product.options.map((option) => (
            <fieldset key={option.id} className="mt-8">
              <legend className="mb-3 flex items-baseline gap-3 text-[0.62rem] tracking-luxe uppercase">
                {option.name}
                <span className="font-serif text-base normal-case tracking-normal text-plum italic">{selected[option.name]}</span>
              </legend>
              <div className="flex flex-wrap gap-3">
                {option.values.map((value) => {
                  const active = selected[option.name] === value;
                  const candidate = product.variants.find((v) =>
                    v.selectedOptions.every((o) => (o.name === option.name ? o.value === value : selected[o.name] === o.value)),
                  );
                  const available = candidate?.availableForSale ?? false;
                  const swatch = shadeColors[value];
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                      aria-pressed={active}
                      aria-label={value}
                      title={value}
                      className={cn(
                        "relative inline-flex items-center justify-center transition-transform duration-300",
                        swatch ? "h-9 w-9 rounded-full" : "border px-4 py-2 text-sm",
                        swatch
                          ? active
                            ? "ring-1 ring-ink ring-offset-4 ring-offset-cream"
                            : "ring-1 ring-line ring-offset-4 ring-offset-cream hover:ring-ink"
                          : active
                            ? "border-ink bg-ink text-white"
                            : "border-line bg-white text-ink hover:border-ink",
                        !available && "opacity-40",
                      )}
                      style={swatch ? { background: swatch } : undefined}
                    >
                      {!swatch && value}
                      {!available && <span className="absolute inset-0 m-auto h-px w-full rotate-45 bg-ink" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
              {product.variants.length > 1 && <ShadeFinderLink />}
            </fieldset>
          ))}

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <div className="inline-flex h-[3.1rem] items-center self-start border border-line bg-white">
            <button type="button" className="inline-flex h-full w-11 items-center justify-center hover:bg-blush" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              <MinusIcon />
            </button>
            <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button type="button" className="inline-flex h-full w-11 items-center justify-center hover:bg-blush" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))}>
              <PlusIcon />
            </button>
          </div>
          <button type="button" onClick={onAdd} disabled={!variant || !variant.availableForSale || isPending} className={cn("btn flex-1", justAdded ? "btn-rose" : "btn-primary")}>
            {!variant || !variant.availableForSale ? (
              "Sold out"
            ) : justAdded ? (
              <>
                <CheckIcon /> Added to bag
              </>
            ) : isPending ? (
              "Adding…"
            ) : (
              <>
                <BagIcon width={16} height={16} /> Add to bag
              </>
            )}
          </button>
        </div>

        {lowStock && (
          <p className="mt-3 text-xs text-rose-deep" aria-live="polite">
            Only {variant?.quantityAvailable} left in this shade.
          </p>
        )}

        <ul className="mt-8 grid gap-2 border-y border-line py-4 text-[0.62rem] tracking-wide2 uppercase text-plum sm:grid-cols-3">
          <li>Free U.S. shipping ${freeShippingThreshold}+</li>
          <li>Vegan &amp; cruelty-free</li>
          <li>Secure checkout</li>
        </ul>

        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
