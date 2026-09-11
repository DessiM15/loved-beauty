"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "./cart-context";
import { formatMoney, placeholderTint } from "@/lib/utils";
import { PlusIcon } from "@/components/ui/icons";
import { getUpsellsAction, type UpsellItem } from "@/lib/cart/upsell";

/**
 * "Add a little something" row inside the cart drawer.
 * Shows up to 3 low-priced items not already in the bag.
 */
export function CartUpsell() {
  const { cart, addItem, isPending } = useCart();
  const [items, setItems] = useState<UpsellItem[]>([]);
  const inBag = new Set(cart?.lines.map((l) => l.merchandise.product.handle) ?? []);
  const key = Array.from(inBag).sort().join(",");

  useEffect(() => {
    let cancelled = false;
    getUpsellsAction(Array.from(inBag)).then((res) => {
      if (!cancelled) setItems(res);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const visible = items.filter((i) => !inBag.has(i.handle)).slice(0, 3);
  if (visible.length === 0) return null;

  return (
    <div className="mt-6 border-t border-line pt-5">
      <p className="eyebrow">Add a little something</p>
      <ul className="mt-3 space-y-3">
        {visible.map((item) => (
          <li key={item.variantId} className="flex items-center gap-3">
            <div
              className="relative h-14 w-12 shrink-0 overflow-hidden"
              style={{ background: placeholderTint(item.handle) }}
            >
              {item.image && <Image src={item.image} alt={item.title} fill sizes="48px" className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="text-sm">{item.title}</p>
              <p className="text-xs text-plum">{formatMoney({ amount: item.price, currencyCode: "USD" })}</p>
            </div>
            <button
              type="button"
              disabled={isPending}
              onClick={() => addItem(item.variantId, 1)}
              className="inline-flex h-9 items-center gap-1 border border-ink px-3 text-[0.6rem] tracking-luxe uppercase hover:bg-ink hover:text-white disabled:opacity-50"
            >
              <PlusIcon /> Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
