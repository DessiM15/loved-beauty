"use server";

import { cookies, headers } from "next/headers";
import { addToCart, createCart, getCart, removeFromCart, updateCart } from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";

/**
 * Cart server actions. The cart id lives in an httpOnly cookie.
 * Pages stay static: the client fetches the cart after hydration.
 */

const CART_ID_COOKIE = "lb_cart_id";

async function getCartId(): Promise<string | undefined> {
  return (await cookies()).get(CART_ID_COOKIE)?.value;
}

async function setCartId(id: string) {
  (await cookies()).set(CART_ID_COOKIE, id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 14,
  });
}

/** The shopper's IP as Vercel reports it, passed on so Shopify can tell shoppers apart. */
async function buyerIp(): Promise<string | undefined> {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined;
}

export type ActionResult = { ok: true; cart: Cart } | { ok: false; error: string };

export async function fetchCartAction(): Promise<Cart | null> {
  const id = await getCartId();
  if (!id) return null;
  return getCart(id, await buyerIp()).catch(() => null);
}

/**
 * One Shopify request per add: straight into the shopper's bag, or a new bag made with the
 * item already in it. A new bag only replaces the old one when the old one no longer works
 * (expired, or already checked out), so a failed add never empties a good bag.
 */
export async function addItemAction(merchandiseId: string, quantity = 1): Promise<ActionResult> {
  try {
    if (!merchandiseId) return { ok: false, error: "Please select an option." };
    const lines = [{ merchandiseId, quantity }];
    const ip = await buyerIp();
    const id = await getCartId();
    if (id) {
      const updated = await addToCart(id, lines, ip).catch(() => null);
      if (updated) return { ok: true, cart: updated };
    }
    const cart = await createCart(lines, ip);
    await setCartId(cart.id);
    return { ok: true, cart };
  } catch (e) {
    console.error("addItemAction", e);
    return { ok: false, error: "We couldn't add that to your bag. Please try again." };
  }
}

export async function updateItemAction(lineId: string, merchandiseId: string, quantity: number): Promise<ActionResult> {
  try {
    const id = await getCartId();
    if (!id) return { ok: false, error: "Your bag has expired. Please add the item again." };
    const ip = await buyerIp();
    const updated = quantity <= 0 ? await removeFromCart(id, [lineId], ip) : await updateCart(id, [{ id: lineId, merchandiseId, quantity }], ip);
    return { ok: true, cart: updated };
  } catch (e) {
    console.error("updateItemAction", e);
    return { ok: false, error: "We couldn't update your bag. Please try again." };
  }
}

export async function removeItemAction(lineId: string): Promise<ActionResult> {
  try {
    const id = await getCartId();
    if (!id) return { ok: false, error: "Your bag has expired. Please add the item again." };
    const updated = await removeFromCart(id, [lineId], await buyerIp());
    return { ok: true, cart: updated };
  } catch (e) {
    console.error("removeItemAction", e);
    return { ok: false, error: "We couldn't update your bag. Please try again." };
  }
}
