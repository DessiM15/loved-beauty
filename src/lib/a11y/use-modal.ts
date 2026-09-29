"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

function focusableIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0 && !el.closest("[inert]"));
}

function canTakeFocus(el: Element | null): el is HTMLElement {
  return el instanceof HTMLElement && el !== document.body && el.isConnected && el.getClientRects().length > 0 && !el.closest("[inert]");
}

/**
 * Modal behaviour shared by the bag, the phone menu and the welcome offer.
 * While open: the rest of the page is inert (nothing behind the panel can be
 * reached by keyboard, touch or screen reader), focus moves inside, Tab stays
 * inside, Escape closes. On close, focus goes back to the control that opened
 * it, or to `fallback` if that control is gone.
 */
export function useModal(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
  { initialFocus, fallback }: { initialFocus?: RefObject<HTMLElement | null>; fallback?: string } = {},
) {
  // Keep the latest onClose without re-running the effect (and re-stealing focus) on every render.
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const root = ref.current;
    if (!open || !root) return;

    const opener = document.activeElement;

    // Everything outside the modal goes inert. Live regions stay on so announcements are still read out.
    const silenced: Element[] = [];
    for (let node: HTMLElement = root; node.parentElement && node !== document.body; node = node.parentElement) {
      for (const sibling of Array.from(node.parentElement.children)) {
        if (sibling === node || sibling.hasAttribute("inert") || sibling.hasAttribute("data-live-region")) continue;
        if (/^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(sibling.tagName)) continue;
        sibling.setAttribute("inert", "");
        silenced.push(sibling);
      }
    }

    (initialFocus?.current ?? focusableIn(root)[0] ?? root).focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusableIn(root);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!root.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && (active === first || active === root)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      for (const el of silenced) el.removeAttribute("inert");
      const target = canTakeFocus(opener) ? opener : fallback ? document.querySelector<HTMLElement>(fallback) : null;
      if (canTakeFocus(target)) target.focus({ preventScroll: true });
    };
  }, [open, ref, initialFocus, fallback]);
}
