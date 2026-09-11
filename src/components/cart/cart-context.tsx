"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import type { Cart } from "@/lib/shopify/types";
import { addItemAction, fetchCartAction, removeItemAction, updateItemAction } from "@/lib/cart/actions";

type CartContextValue = {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
  error: string | null;
  lastAdded: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (merchandiseId: string, quantity?: number) => Promise<boolean>;
  updateItem: (lineId: string, merchandiseId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Hydrate the cart after mount so every page can stay static.
  useEffect(() => {
    let cancelled = false;
    fetchCartAction().then((c) => {
      if (!cancelled) setCart(c);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const addItem = useCallback(async (merchandiseId: string, quantity = 1) => {
    setError(null);
    return new Promise<boolean>((resolve) => {
      startTransition(async () => {
        const res = await addItemAction(merchandiseId, quantity);
        if (res.ok) {
          setCart(res.cart);
          setLastAdded(merchandiseId);
          setOpen(true);
          resolve(true);
        } else {
          setError(res.error);
          resolve(false);
        }
      });
    });
  }, []);

  const updateItem = useCallback(async (lineId: string, merchandiseId: string, quantity: number) => {
    setError(null);
    // Optimistic update for a snappy drawer.
    setCart((prev) => {
      if (!prev) return prev;
      const lines = prev.lines
        .map((l) => (l.id === lineId ? { ...l, quantity } : l))
        .filter((l) => l.quantity > 0);
      return { ...prev, lines, totalQuantity: lines.reduce((n, l) => n + l.quantity, 0) };
    });
    startTransition(async () => {
      const res = await updateItemAction(lineId, merchandiseId, quantity);
      if (res.ok) setCart(res.cart);
      else setError(res.error);
    });
  }, []);

  const removeItem = useCallback(async (lineId: string) => {
    setError(null);
    setCart((prev) => {
      if (!prev) return prev;
      const lines = prev.lines.filter((l) => l.id !== lineId);
      return { ...prev, lines, totalQuantity: lines.reduce((n, l) => n + l.quantity, 0) };
    });
    startTransition(async () => {
      const res = await removeItemAction(lineId);
      if (res.ok) setCart(res.cart);
      else setError(res.error);
    });
  }, []);

  const value = useMemo(
    () => ({ cart, isOpen, isPending, error, lastAdded, openCart, closeCart, addItem, updateItem, removeItem }),
    [cart, isOpen, isPending, error, lastAdded, openCart, closeCart, addItem, updateItem, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
