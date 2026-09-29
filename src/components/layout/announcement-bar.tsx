"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { announcements } from "@/content/site";
import { PauseIcon, PlayIcon } from "@/components/ui/icons";

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribe = (notify: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
};

/**
 * Light pink announcement bar above the white nav (option 1G). Rotates one message at a time.
 * Anything that moves on its own needs a way to stop it (WCAG 2.2.2), so the bar has a
 * pause button, holds still while hovered or focused, and starts paused for shoppers
 * whose device asks for reduced motion. Only the message on show can be reached or read.
 */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [choice, setChoice] = useState<boolean | null>(null); // null: follow the device setting
  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
  const paused = choice ?? reduced;
  const rotates = announcements.length > 1;

  useEffect(() => {
    if (!rotates || paused || held) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % announcements.length), 4500);
    return () => clearInterval(id);
  }, [rotates, paused, held]);

  return (
    <div className="relative z-40 bg-pink text-ink">
      <div
        className="container-lb relative h-[var(--announce-h)] overflow-hidden text-[0.68rem] font-medium tracking-[0.22em] uppercase"
        role="region"
        aria-label="Announcements"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        {announcements.map((a, i) => (
          <Link
            key={a.text}
            href={a.href}
            className={`absolute inset-y-0 right-0 left-0 flex items-center justify-center text-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-plum focus-visible:-outline-offset-4 ${
              rotates ? "px-9" : ""
            } ${i === index ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
            inert={i !== index}
          >
            {a.text}
          </Link>
        ))}
        {rotates && (
          <button
            type="button"
            onClick={() => setChoice(!paused)}
            aria-label={paused ? "Play announcements" : "Pause announcements"}
            className="absolute top-1/2 right-2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center text-ink/70 transition-colors hover:text-ink focus-visible:outline-offset-0 sm:right-6 lg:right-12"
          >
            {paused ? <PlayIcon width={11} height={11} /> : <PauseIcon width={11} height={11} />}
          </button>
        )}
      </div>
    </div>
  );
}
