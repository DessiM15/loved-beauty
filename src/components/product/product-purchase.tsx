"use client";

import { useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { useCart } from "@/components/cart/cart-context";
import { Price } from "./price";
import { ProductGallery } from "./product-gallery";
import { hasRealOptions, cn } from "@/lib/utils";
import { BagIcon, CheckIcon, MinusIcon, PlusIcon, TruckIcon, ShieldIcon, LockIcon } from "@/components/ui/icons";
import { freeShippingThreshold } from "@/content/site";
import { ShadeFinderLink } from "./shade-finder-link";

/**
 * Left: gallery. Right: title, price, shade selector, quantity, add to bag.
 * Kept as one client component so shade selection can drive the gallery.
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
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
      <ProductGallery images={product.images} title={product.title} handle={product.handle} activeIndex={galleryIndex} />

      <div className="lg:pt-4">
        <p className="eyebrow">{product.productType}</p>
        <h1 className="h-display mt-2 text-4xl md:text-5xl">{product.title}</h1>
        <div className="mt-4 text-lg">
          {variant ? <Price price={variant.price} compareAt={variant.compareAtPrice} /> : <Price price={product.priceRange.minVariantPrice} />}
        </div>

        <p className="mt-5 max-w-prose text-[0.95rem] leading-relaxed text-plum">{product.description}</p>

        {showOptions &&
          product.options.map((option) => (
            <fieldset key={option.id} className="mt-7">
              <legend className="mb-3 flex items-baseline gap-2 text-xs tracking-wide2 uppercase">
                {option.name}
                <span className="normal-case tracking-normal text-plum">— {selected[option.name]}</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const active = selected[option.name] === value;
                  const candidate = product.variants.find((v) =>
                    v.selectedOptions.every((o) => (o.name === option.name ? o.value === value : selected[o.name] === o.value)),
                  );
                  const available = candidate?.availableForSale ?? false;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                      aria-pressed={active}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-colors",
                        active ? "border-ink bg-ink text-white" : "border-petal bg-white text-ink hover:border-ink",
                        !available && "line-through opacity-50",
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        {showOptions && product.variants.length > 1 && <ShadeFinderLink />}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <div className="inline-flex h-12 items-center self-start rounded-full border border-petal bg-white">
            <button
              type="button"
              className="inline-flex h-12 w-11 items-center justify-center rounded-full hover:bg-blush"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              <MinusIcon />
            </button>
            <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              className="inline-flex h-12 w-11 items-center justify-center rounded-full hover:bg-blush"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
            >
              <PlusIcon />
            </button>
          </div>
          <button
            type="button"
            onClick={onAdd}
            disabled={!variant || !variant.availableForSale || isPending}
            className={cn("btn flex-1", justAdded ? "btn-rose" : "btn-primary")}
          >
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

        <ul className="mt-6 grid gap-2.5 text-xs text-plum sm:grid-cols-3">
          <li className="flex items-center gap-2">
            <TruckIcon width={18} height={18} className="text-rose" /> Free U.S. shipping ${freeShippingThreshold}+
          </li>
          <li className="flex items-center gap-2">
            <ShieldIcon width={18} height={18} className="text-rose" /> Vegan &amp; cruelty-free
          </li>
          <li className="flex items-center gap-2">
            <LockIcon width={18} height={18} className="text-rose" /> Secure checkout
          </li>
        </ul>

        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
