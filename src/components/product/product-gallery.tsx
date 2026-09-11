"use client";

import Image from "next/image";
import { useState } from "react";
import type { Image as ProductImage } from "@/lib/shopify/types";
import { ProductPlaceholder } from "./product-placeholder";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  title,
  handle,
  activeIndex,
}: {
  images: ProductImage[];
  title: string;
  handle: string;
  /** Optional index driven by variant selection. */
  activeIndex?: number;
}) {
  const [manual, setManual] = useState<number | null>(null);
  const index = manual ?? activeIndex ?? 0;
  const current = images[index] ?? images[0];

  return (
    <div className="lg:sticky lg:top-28">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-blush">
        {current ? (
          <Image
            key={current.url}
            src={current.url}
            alt={current.altText ?? title}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover animate-fade-up"
          />
        ) : (
          <ProductPlaceholder title={title} handle={handle} />
        )}
      </div>
      {images.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto scrollbar-none" aria-label="Product images">
          {images.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => setManual(i)}
                aria-label={`View image ${i + 1} of ${images.length}`}
                aria-current={i === index}
                className={cn(
                  "relative h-20 w-16 overflow-hidden rounded-xl border-2 bg-blush transition-colors",
                  i === index ? "border-rose" : "border-transparent hover:border-petal",
                )}
              >
                <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
