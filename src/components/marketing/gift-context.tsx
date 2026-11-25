"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { launchGift } from "@/content/site";

/**
 * The opening-day gift, shared by the popup, the top bar and the bag.
 *   pending: not known yet, show nothing
 *   on:      gifts are left; `left` is the live number, or null if the count could not be read
 *   off:     every gift is claimed, or the offer is switched off
 */
export type GiftState = { status: "pending" | "off" } | { status: "on"; left: number | null };

const GiftContext = createContext<GiftState>({ status: "off" });
export const useGift = () => useContext(GiftContext);

export function GiftProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GiftState>({ status: launchGift.enabled ? "pending" : "off" });

  useEffect(() => {
    if (!launchGift.enabled) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const load = async () => {
      let next: GiftState = { status: "on", left: null };
      try {
        const res = await fetch("/api/launch-gift", { cache: "no-store" });
        const json = (await res.json()) as { ok?: boolean; left?: number };
        if (json.ok && typeof json.left === "number") next = json.left > 0 ? { status: "on", left: json.left } : { status: "off" };
      } catch {
        /* the offer still shows, without a number */
      }
      if (!alive) return;
      setState(next);
      if (next.status === "on") timer = setTimeout(load, 60_000);
    };
    load();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  return <GiftContext.Provider value={state}>{children}</GiftContext.Provider>;
}

/** "37 of 80 gifts left", or nothing when the number is unknown. */
export function giftsLeftLabel(left: number | null): string | null {
  if (left === null) return null;
  return `${left} of ${launchGift.total} ${left === 1 ? "gift" : "gifts"} left`;
}
