"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { announcements } from "@/content/site";
import { ThemeToggle } from "@/components/theme/themed";

/** Hairline promo bar above the header. Rotates one message at a time. */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (announcements.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % announcements.length), 4500);
    return () => clearInterval(id);
  }, []);

  const showToggle = process.env.NEXT_PUBLIC_THEME_TOGGLE === "true";
  return (
    <div className="relative z-40 border-b border-line bg-cream">
      {showToggle && (
        <div className="absolute top-1/2 right-3 z-10 -translate-y-1/2 md:right-6">
          <ThemeToggle />
        </div>
      )}
      <div className={`container-lb relative h-[var(--announce-h)] overflow-hidden text-[0.72rem] font-normal tracking-[0.16em] uppercase text-ink `} aria-live="polite">
        {announcements.map((a, i) => (
          <Link
            key={a.text}
            href={a.href}
            className={`absolute inset-y-0 left-0 flex items-center justify-center text-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-rose-deep ${showToggle ? "right-24 md:right-0" : "right-0"} ${
              i === index ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
            }`}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
          >
            {a.text}
          </Link>
        ))}
      </div>
    </div>
  );
}
