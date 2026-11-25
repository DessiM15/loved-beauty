"use client";

import Image from "next/image";
import Link from "next/link";
import { Allura } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { launchGift } from "@/content/site";
import { CloseIcon } from "@/components/ui/icons";
import { useModal } from "@/lib/a11y/use-modal";
import { giftsLeftLabel, useGift } from "./gift-context";

const script = Allura({ weight: "400", subsets: ["latin"], display: "swap" });
const KEY = "lb_gift_dismissed";

/**
 * The opening-day gift as a love note (the client's pick, option J): pale pink card, her photo as
 * a snapshot, the headline in script, and the live number of gifts left. Shows once a day, a
 * moment after the page settles, never on product or checkout pages, and stops for good when
 * every gift is claimed.
 */
export function GiftPopup() {
  const gift = useGift();
  const on = gift.status === "on";
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!on) return;
    if (/^\/(products|checkout-preview)/.test(window.location.pathname)) return;
    try {
      if (Number(localStorage.getItem(KEY) ?? 0) > Date.now()) return;
    } catch {
      /* storage unavailable */
    }
    let timer: ReturnType<typeof setTimeout>;
    const show = () => {
      // Never on top of the bag or the menu: two modals at once strand keyboard focus. Try again shortly.
      if (Array.from(document.querySelectorAll('[role="dialog"]')).some((d) => !d.closest("[inert]"))) {
        timer = setTimeout(show, 4000);
        return;
      }
      setOpen(true);
    };
    timer = setTimeout(show, 2500);
    return () => clearTimeout(timer);
  }, [on]);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(KEY, String(Date.now() + 24 * 60 * 60 * 1000));
    } catch {
      /* ignore */
    }
  }

  useModal(rootRef, open && on, dismiss, { initialFocus: closeRef, fallback: "#main" });

  if (!open || gift.status !== "on") return null;
  const left = giftsLeftLabel(gift.left);

  return (
    <div ref={rootRef} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 outline-none" role="dialog" aria-modal="true" aria-labelledby="gift-heading" tabIndex={-1}>
      {/* Backdrop: a click target for the mouse. Keyboard and screen readers use Close or Escape. */}
      <div aria-hidden="true" onClick={dismiss} className="fixed inset-0 bg-ink/45" />
      <div className="relative my-auto grid w-full max-w-[22rem] justify-items-center gap-7 bg-pink px-6 pt-11 pb-8 text-center text-ink shadow-2xl animate-fade-up md:max-w-[58rem] md:grid-cols-[0.72fr_1fr] md:items-center md:gap-14 md:px-14 md:py-14 md:text-left">
        <button
          ref={closeRef}
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-2 right-2 inline-flex h-10 w-10 items-center justify-center hover:bg-white/60 focus-visible:outline-offset-0"
        >
          <CloseIcon width={20} height={20} />
        </button>
        <div className="grid w-[62%] -rotate-[4deg] justify-items-center gap-1.5 bg-white p-3 pb-2 shadow-[0_14px_30px_-14px_rgb(42_34_32/0.5)] md:w-full md:gap-2 md:p-4 md:pb-3">
          <div className="relative aspect-[4/5] w-full">
            <Image src={launchGift.photo.src} alt={launchGift.photo.alt} fill sizes="(min-width: 768px) 340px, 220px" className="object-cover object-[50%_30%]" />
          </div>
          <span aria-hidden="true" className={`${script.className} text-[1.6rem] leading-none text-rose-ink md:text-[2.1rem]`}>
            Loved Beauty
          </span>
        </div>
        <div className="grid justify-items-center gap-3 md:justify-items-start md:gap-4">
          <p className="eyebrow text-rose-ink">{launchGift.eyebrow}</p>
          <h2 id="gift-heading" className={`${script.className} text-[3.5rem] leading-[0.9] font-normal whitespace-nowrap text-ink md:text-[5.6rem]`}>
            {launchGift.headline}
          </h2>
          <p className="p-serif text-[1.2rem] leading-[1.3] text-plum md:text-[1.6rem]">{launchGift.offer}</p>
          {left && (
            <p className="text-[0.72rem] font-medium tracking-[0.22em] uppercase text-ink">
              <span aria-hidden="true" className="mr-2 text-coral">
                ♥︎
              </span>
              {left}
            </p>
          )}
          <Link href={launchGift.cta.href} onClick={dismiss} className="btn mt-1 border border-ink bg-ink text-ivory hover:border-plum hover:bg-plum">
            {launchGift.cta.label}
          </Link>
          <p className="text-[0.75rem] text-ink">{launchGift.fine}</p>
        </div>
      </div>
    </div>
  );
}
