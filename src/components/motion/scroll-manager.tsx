"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Every page load and every navigation starts at the top.
 * Browsers normally restore the previous scroll position on refresh; the
 * client asked that shoppers never land mid-page.
 */
export function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Anchor links (e.g. /about#values) are the one exception.
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
