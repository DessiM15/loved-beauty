import type { Metadata } from "next";
import Link from "next/link";
import { LockIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

/**
 * Demo-only page. Once Shopify is connected, the Checkout button sends
 * shoppers to Shopify's secure hosted checkout (Shop Pay, Apple Pay, etc.)
 * and this page is never reached.
 */
export default function CheckoutPreviewPage() {
  return (
    <div className="container-lb flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blush text-rose-deep">
        <LockIcon />
      </span>
      <h1 className="h-display mt-5 text-4xl">Secure checkout</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-plum">
        In the live store this button opens Shopify&rsquo;s secure checkout with Shop Pay, Apple Pay, Google Pay and all major cards.
        It will be connected as soon as the Loved Beauty Shopify store is ready.
      </p>
      <Link href="/shop" className="btn btn-primary mt-8">
        Back to shop
      </Link>
    </div>
  );
}
