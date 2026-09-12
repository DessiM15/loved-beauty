"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { announcements } from "@/content/site";
import { navToggleEnabled, setNavStyle, useNavStyle } from "@/lib/nav-style";
import { cn } from "@/lib/utils";

/** Hairline promo bar above the header. Rotates one message at a time. */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (announcements.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % announcements.length), 4500);
    return () => clearInterval(id);
  }, []);

  const nav = useNavStyle();
  const dark = nav === "dark";

  return (
    <div className={cn("relative z-40 border-b", dark ? "border-white/10 bg-ink text-cream" : "border-line bg-cream text-ink")}>
      {navToggleEnabled && (
        <div className="absolute top-1/2 right-3 z-10 -translate-y-1/2 md:right-6" role="group" aria-label="Header version (review only)">
          {(["light", "dark"] as const).map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setNavStyle(t)}
              aria-pressed={nav === t}
              className={cn(
                "border px-2 py-0.5 text-[0.55rem] tracking-[0.16em] uppercase transition-colors",
                dark ? "border-white/20" : "border-line",
                nav === t ? (dark ? "bg-cream text-ink" : "bg-ink text-white") : "opacity-60 hover:opacity-100",
              )}
            >
              V{i + 1}
            </button>
          ))}
        </div>
      )}
      <div className={cn("container-lb relative h-[var(--announce-h)] overflow-hidden text-[0.7rem] font-medium tracking-[0.16em] uppercase")} aria-live="polite">
        {announcements.map((a, i) => (
          <Link
            key={a.text}
            href={a.href}
            className={`absolute inset-y-0 left-0 flex items-center justify-center text-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-rose-deep ${navToggleEnabled ? "right-16 md:right-0" : "right-0"} ${
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
