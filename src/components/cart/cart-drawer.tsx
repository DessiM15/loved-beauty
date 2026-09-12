"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "./cart-context";
import { freeShippingThreshold } from "@/content/site";
import { cn, formatMoney, placeholderTint } from "@/lib/utils";
import { CloseIcon, LockIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import { CartUpsell } from "./cart-upsell";

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateItem, removeItem, isPending, error } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  const subtotal = Number(cart?.cost.subtotalAmount.amount ?? 0);
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const lines = cart?.lines ?? [];
  const isEmpty = lines.length === 0;

  return (
    <div className={cn("fixed inset-0 z-50 overflow-hidden", !isOpen && "pointer-events-none")} aria-hidden={!isOpen}>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close bag"
        onClick={closeCart}
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        tabIndex={isOpen ? 0 : -1}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="h-display text-2xl">
            Your bag{" "}
            {cart && cart.totalQuantity > 0 && (
              <span className="font-sans text-sm text-plum">({cart.totalQuantity})</span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-10 w-10 items-center justify-center hover:bg-blush"
            aria-label="Close bag"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Free shipping progress */}
        <div className="border-b border-line bg-blush/60 px-5 py-3">
          <p className="text-xs text-plum">
            {remaining > 0 ? (
              <>
                You&rsquo;re <strong className="text-ink">{formatMoney({ amount: remaining.toFixed(2), currencyCode: "USD" })}</strong> away
                from free U.S. shipping.
              </>
            ) : (
              <strong className="text-ink">You&rsquo;ve unlocked free U.S. shipping.</strong>
            )}
          </p>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line" aria-hidden="true">
            <div className="h-full rounded-full bg-gold transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="h-display text-2xl">Your bag is empty.</p>
              <p className="mt-2 text-sm text-plum">A little something for your lips?</p>
              <Link href="/shop" onClick={closeCart} className="btn btn-primary mt-6">
                Shop all
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {lines.map((line) => {
                const optionLabel = line.merchandise.selectedOptions
                  .filter((o) => o.value !== "Default Title")
                  .map((o) => o.value)
                  .join(" · ");
                return (
                  <li key={line.id} className="flex gap-4 py-4">
                    <Link
                      href={`/products/${line.merchandise.product.handle}`}
                      onClick={closeCart}
                      className="relative h-24 w-20 shrink-0 overflow-hidden"
                      style={{ background: placeholderTint(line.merchandise.product.handle) }}
                    >
                      {line.merchandise.image ? (
                        <Image
                          src={line.merchandise.image.url}
                          alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : null}
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/products/${line.merchandise.product.handle}`}
                            onClick={closeCart}
                            className="text-sm font-medium text-ink"
                          >
                            {line.merchandise.product.title}
                          </Link>
                          {optionLabel && <p className="mt-0.5 text-xs text-plum">{optionLabel}</p>}
                        </div>
                        <p className="text-sm">{formatMoney(line.cost.totalAmount)}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="inline-flex items-center border border-line bg-white">
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center hover:bg-blush"
                            aria-label={`Decrease quantity of ${line.merchandise.product.title}`}
                            onClick={() => updateItem(line.id, line.merchandise.id, line.quantity - 1)}
                          >
                            <MinusIcon />
                          </button>
                          <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center hover:bg-blush"
                            aria-label={`Increase quantity of ${line.merchandise.product.title}`}
                            onClick={() => updateItem(line.id, line.merchandise.id, line.quantity + 1)}
                          >
                            <PlusIcon />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-xs text-plum hover:text-danger"
                          onClick={() => removeItem(line.id)}
                          aria-label={`Remove ${line.merchandise.product.title}`}
                        >
                          <TrashIcon /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {!isEmpty && <CartUpsell />}
          {error && (
            <p role="alert" className="mt-4 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}
        </div>

        {!isEmpty && (
          <div className="border-t border-line bg-white px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-plum">Subtotal</span>
              <span className="font-medium">{formatMoney(cart?.cost.subtotalAmount)}</span>
            </div>
            <p className="mt-1 text-xs text-plum">Shipping and taxes calculated at checkout.</p>
            <a
              href={cart?.checkoutUrl ?? "#"}
              className="btn btn-rose mt-4 w-full"
              aria-disabled={isPending}
              onClick={(e) => isPending && e.preventDefault()}
            >
              <LockIcon width={16} height={16} /> Checkout
            </a>
            <button type="button" onClick={closeCart} className="link-underline mx-auto mt-4 block text-[0.62rem] tracking-luxe uppercase text-plum hover:text-ink">
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
