"use client";

import Image, { type ImageProps } from "next/image";
import type { ReactNode } from "react";
import { setTheme, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

type Pic = { src: string; alt: string; position?: string };

/** next/image that swaps source by theme. Server renders the light image. */
export function ThemedImage({ light, dark, style, ...rest }: { light: Pic; dark: Pic } & Omit<ImageProps, "src" | "alt">) {
  const theme = useTheme();
  const pic = theme === "noir" ? dark : light;
  return <Image key={pic.src} src={pic.src} alt={pic.alt} style={{ ...style, objectPosition: pic.position ?? (style as React.CSSProperties | undefined)?.objectPosition }} {...rest} />;
}

/** Render one of two subtrees depending on theme. */
export function ThemeSwitch({ light, noir }: { light: ReactNode; noir: ReactNode }) {
  const theme = useTheme();
  return <>{theme === "noir" ? noir : light}</>;
}

/** Review-only switch. Rendered only when NEXT_PUBLIC_THEME_TOGGLE=true. */
export function ThemeToggle() {
  const theme = useTheme();
  return (
    <div className="inline-flex items-center border border-line text-[0.58rem] tracking-[0.16em] uppercase" role="group" aria-label="Design version (review only)">
      {(["light", "noir"] as const).map((t, i) => (
        <button
          key={t}
          type="button"
          onClick={() => setTheme(t)}
          aria-pressed={theme === t}
          className={cn("px-2.5 py-1 transition-colors", theme === t ? "bg-ink text-white" : "text-plum hover:text-ink")}
        >
          V{i + 1}
        </button>
      ))}
    </div>
  );
}
