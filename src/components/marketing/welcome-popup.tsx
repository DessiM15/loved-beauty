"use client";

import { useEffect, useRef, useState } from "react";
import { newsletter, firstOrderCode } from "@/content/site";
import { NewsletterForm } from "./newsletter-form";
import { CloseIcon } from "@/components/ui/icons";
import { useModal } from "@/lib/a11y/use-modal";

const KEY = "lb_welcome_dismissed";

/**
 * Delayed welcome offer. Appears once, after 12s or 40% scroll, never on
 * product/checkout-preview pages, and remembers dismissal for 14 days.
 * Enable with NEXT_PUBLIC_SHOW_WELCOME_POPUP=true.
 */
export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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
      // Never on top of the bag or the menu: two modals at once strand keyboard focus. It waits for the next scroll.
      if (Array.from(document.querySelectorAll('[role="dialog"]')).some((d) => !d.closest("[inert]"))) return;
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

  // Focus moves into the offer, stays there, Escape dismisses it, and focus returns to where the shopper was.
  useModal(rootRef, open, dismiss, { initialFocus: closeRef, fallback: "#main" });

  if (!open) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-50 flex items-end justify-center p-4 outline-none sm:items-center" role="dialog" aria-modal="true" aria-labelledby="welcome-heading" tabIndex={-1}>
      {/* Backdrop: a click target for the mouse. Keyboard and screen readers use Close or Escape. */}
      <div aria-hidden="true" onClick={dismiss} className="absolute inset-0 bg-ink/40" />
      <div className="relative w-full max-w-md rounded-sm bg-cream p-7 text-center shadow-2xl animate-fade-up">
        <button
          ref={closeRef}
          type="button"
          onClick={dismiss}
          aria-label="Close offer"
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
