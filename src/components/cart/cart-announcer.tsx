"use client";

import { useCart } from "./cart-context";

/**
 * Reads bag changes out to screen readers ("Lustre Lip Gloss added to bag,
 * 2 items in bag"). Invisible. It lives outside the drawer and is never made
 * inert, so it speaks whether the bag is open or closed.
 */
export function CartAnnouncer() {
  const { announcement } = useCart();
  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true" data-live-region>
      {announcement}
    </div>
  );
}
