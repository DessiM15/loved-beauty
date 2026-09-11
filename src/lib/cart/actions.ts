"use server";

import { cookies } from "next/headers";
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

async function ensureCart(): Promise<Cart> {
  const id = await getCartId();
  if (id) {
    const existing = await getCart(id).catch(() => null);
    if (existing) return existing;
  }
  const cart = await createCart();
  await setCartId(cart.id);
  return cart;
}

export type ActionResult = { ok: true; cart: Cart } | { ok: false; error: string };

export async function fetchCartAction(): Promise<Cart | null> {
  const id = await getCartId();
  if (!id) return null;
  return getCart(id).catch(() => null);
}

export async function addItemAction(merchandiseId: string, quantity = 1): Promise<ActionResult> {
  try {
    if (!merchandiseId) return { ok: false, error: "Please select an option." };
    const cart = await ensureCart();
    const updated = await addToCart(cart.id, [{ merchandiseId, quantity }]);
    return { ok: true, cart: updated };
  } catch (e) {
    console.error("addItemAction", e);
    return { ok: false, error: "We couldn't add that to your bag. Please try again." };
  }
}

export async function updateItemAction(lineId: string, merchandiseId: string, quantity: number): Promise<ActionResult> {
  try {
    const cart = await ensureCart();
    const updated =
      quantity <= 0
        ? await removeFromCart(cart.id, [lineId])
        : await updateCart(cart.id, [{ id: lineId, merchandiseId, quantity }]);
    return { ok: true, cart: updated };
  } catch (e) {
    console.error("updateItemAction", e);
    return { ok: false, error: "We couldn't update your bag. Please try again." };
  }
}

export async function removeItemAction(lineId: string): Promise<ActionResult> {
  try {
    const cart = await ensureCart();
    const updated = await removeFromCart(cart.id, [lineId]);
    return { ok: true, cart: updated };
  } catch (e) {
    console.error("removeItemAction", e);
    return { ok: false, error: "We couldn't update your bag. Please try again." };
  }
}
