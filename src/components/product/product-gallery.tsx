"use client";

import Image from "next/image";
import { useState } from "react";
import type { Image as ProductImage } from "@/lib/shopify/types";
import { ProductPlaceholder } from "./product-placeholder";
import { cn } from "@/lib/utils";

/** Square-cornered gallery that bleeds to the page edge; thumbnails below. */
export function ProductGallery({
  images,
  title,
  handle,
  activeIndex,
}: {
  images: ProductImage[];
  title: string;
  handle: string;
  activeIndex?: number;
}) {
  const [manual, setManual] = useState<number | null>(null);
  const index = manual ?? activeIndex ?? 0;
  const current = images[index] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-blush">
        {current ? (
          <Image key={current.url} src={current.url} alt={current.altText ?? title} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover animate-fade-up" />
        ) : (
          <ProductPlaceholder title={title} handle={handle} />
        )}
      </div>
      {images.length > 1 && (
        <ul className="flex gap-px border-t border-line bg-line" aria-label="Product images">
          {images.map((img, i) => (
            <li key={img.url} className="bg-cream">
              <button
                type="button"
                onClick={() => setManual(i)}
                aria-label={`View image ${i + 1} of ${images.length}`}
                aria-current={i === index}
                className={cn("relative block h-24 w-20 overflow-hidden transition-opacity duration-300", i === index ? "opacity-100" : "opacity-50 hover:opacity-100")}
              >
                <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                {i === index && <span className="absolute inset-x-0 bottom-0 h-px bg-ink" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
