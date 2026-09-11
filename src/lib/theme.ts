"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "noir";
export const THEME_KEY = "lb_theme";

function read(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "noir" ? "noir" : "light";
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

/** Current theme, driven by the `data-theme` attribute on <html>. Server snapshot is always light. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "light");
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}

/** Inline script for <head>: applies the saved theme before first paint. */
export const themeInitScript = `(function(){try{var d=${JSON.stringify(process.env.NEXT_PUBLIC_DEFAULT_THEME === "noir" ? "noir" : "light")};var t=${
  process.env.NEXT_PUBLIC_THEME_TOGGLE === "true" ? "localStorage.getItem('lb_theme')||d" : "d"
};document.documentElement.dataset.theme=t==='noir'?'noir':'light';}catch(e){}})();`;
