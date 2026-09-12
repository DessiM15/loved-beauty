"use client";

import { useSyncExternalStore } from "react";

/**
 * Review-only header variant. V1: cream bar, logo over a soft haze.
 * V2: solid ink bar, logo as-is. Driven by `data-nav` on <html>.
 * The switch renders only when NEXT_PUBLIC_NAV_TOGGLE=true; at launch set
 * NEXT_PUBLIC_NAV_STYLE to the winner and drop the toggle.
 */
export type NavStyle = "light" | "dark";
export const NAV_KEY = "lb_nav";

function read(): NavStyle {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.nav === "dark" ? "dark" : "light";
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-nav"] });
  return () => mo.disconnect();
}

export function useNavStyle(): NavStyle {
  return useSyncExternalStore(subscribe, read, () => "light");
}

export function setNavStyle(style: NavStyle) {
  document.documentElement.dataset.nav = style;
  try {
    localStorage.setItem(NAV_KEY, style);
  } catch {
    /* ignore */
  }
}

export const navToggleEnabled = process.env.NEXT_PUBLIC_NAV_TOGGLE === "true";

/** Inline script for <head>: applies the saved variant before first paint. */
export const navInitScript = `(function(){try{var d=${JSON.stringify(process.env.NEXT_PUBLIC_NAV_STYLE === "dark" ? "dark" : "light")};var t=${
  navToggleEnabled ? "localStorage.getItem('lb_nav')||d" : "d"
};document.documentElement.dataset.nav=t==='dark'?'dark':'light';}catch(e){}})();`;
