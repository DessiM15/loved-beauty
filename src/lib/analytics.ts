import type { Cart, CartLine } from "@/lib/shopify/types";

/**
 * GA4 shopping events sent from the storefront. They do nothing when Google Analytics is
 * not loaded. The purchase itself is recorded by Shopify's checkout, not here.
 */
type Gtag = (command: "event", name: string, params: Record<string, unknown>) => void;

function send(name: string, params: Record<string, unknown>) {
  try {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag === "function") gtag("event", name, params);
  } catch {
    /* analytics must never break shopping */
  }
}

function item(line: CartLine, quantity = line.quantity) {
  const shade = line.merchandise.title === "Default Title" ? undefined : line.merchandise.title;
  return { item_id: line.merchandise.product.handle, item_name: line.merchandise.product.title, item_variant: shade, price: Number(line.merchandise.price.amount), quantity };
}

export function trackAddToCart(cart: Cart, merchandiseId: string, quantity: number) {
  const line = cart.lines.find((l) => l.merchandise.id === merchandiseId);
  if (!line) return;
  const price = Number(line.merchandise.price.amount);
  send("add_to_cart", { currency: line.merchandise.price.currencyCode, value: price * quantity, items: [item(line, quantity)] });
}

export function trackBeginCheckout(cart: Cart) {
  send("begin_checkout", { currency: cart.cost.subtotalAmount.currencyCode, value: Number(cart.cost.subtotalAmount.amount), items: cart.lines.map((l) => item(l)) });
}
