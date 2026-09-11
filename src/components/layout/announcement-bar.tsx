"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { announcements } from "@/content/site";

/**
 * Slim promo bar above the nav. Rotates messages every 5s on mobile,
 * shows all on desktop. Highest-converting single element on beauty sites.
 */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (announcements.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % announcements.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-ink text-white">
      <div className="container-lb flex h-9 items-center justify-center text-[0.68rem] tracking-[0.14em] uppercase">
        {/* mobile: one rotating message */}
        <div className="relative h-full w-full overflow-hidden md:hidden" aria-live="polite">
          {announcements.map((a, i) => (
            <Link
              key={a.text}
              href={a.href}
              className={`absolute inset-0 flex items-center justify-center text-center transition-opacity duration-500 ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={i !== index}
              tabIndex={i === index ? 0 : -1}
            >
              {a.text}
            </Link>
          ))}
        </div>
        {/* desktop: all messages */}
        <ul className="hidden items-center gap-8 md:flex">
          {announcements.map((a, i) => (
            <li key={a.text} className="flex items-center gap-8">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />}
              <Link href={a.href} className="hover:text-petal transition-colors">
                {a.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
