"use client";

import { useEffect, useState } from "react";
import { newsletter, firstOrderCode } from "@/content/site";
import { NewsletterForm } from "./newsletter-form";
import { CloseIcon } from "@/components/ui/icons";

const KEY = "lb_welcome_dismissed";

/**
 * Delayed welcome offer. Appears once, after 12s or 40% scroll, never on
 * product/checkout-preview pages, and remembers dismissal for 14 days.
 * Enable with NEXT_PUBLIC_SHOW_WELCOME_POPUP=true.
 */
export function WelcomePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SHOW_WELCOME_POPUP !== "true") return;
    if (/^\/(products|checkout-preview)/.test(window.location.pathname)) return;
    try {
      const until = Number(localStorage.getItem(KEY) ?? 0);
      if (until > Date.now()) return;
    } catch {
      /* storage unavailable */
    }
    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
    };
    const timer = setTimeout(show, 12000);
    const onScroll = () => {
      const pct = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      if (pct > 0.4) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(KEY, String(Date.now() + 14 * 24 * 60 * 60 * 1000));
    } catch {
      /* ignore */
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="welcome-heading">
      <button type="button" aria-label="Close" onClick={dismiss} className="absolute inset-0 bg-ink/40" />
      <div className="relative w-full max-w-md rounded-sm bg-cream p-7 text-center shadow-2xl animate-fade-up">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-sm hover:bg-blush"
        >
          <CloseIcon width={18} height={18} />
        </button>
        <p className="eyebrow">Welcome to Loved Beauty</p>
        <h2 id="welcome-heading" className="h-display mt-2 text-3xl">
          {newsletter.headline}
        </h2>
        <p className="mt-2 text-sm text-plum">
          Join the list and use code <strong className="text-ink">{firstOrderCode}</strong> at checkout.
        </p>
        <div className="mt-5">
          <NewsletterForm source="popup" />
        </div>
        <button type="button" onClick={dismiss} className="mt-4 text-xs tracking-wide2 uppercase text-plum hover:text-ink">
          No thanks
        </button>
      </div>
    </div>
  );
}
