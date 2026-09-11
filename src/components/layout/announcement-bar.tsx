"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { announcements } from "@/content/site";

/** Hairline promo bar above the header. Rotates one message at a time. */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (announcements.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % announcements.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative z-40 border-b border-line bg-cream">
      <div className="container-lb relative h-[var(--announce-h)] overflow-hidden text-[0.72rem] font-normal tracking-[0.16em] uppercase text-ink" aria-live="polite">
        {announcements.map((a, i) => (
          <Link
            key={a.text}
            href={a.href}
            className={`absolute inset-0 flex items-center justify-center text-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-rose-deep ${
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
