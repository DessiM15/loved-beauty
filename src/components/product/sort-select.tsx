"use client";

import { ChevronDownIcon } from "@/components/ui/icons";

export type SortValue = "featured" | "best-selling" | "newest" | "price-asc" | "price-desc";

const options: { value: SortValue; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function SortSelect({ value, onChange }: { value: SortValue; onChange: (v: SortValue) => void }) {
  return (
    <label className="relative inline-flex items-center gap-2 text-xs text-plum">
      <span>Sort by</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortValue)}
          className="appearance-none rounded-full border border-petal bg-white py-1.5 pr-8 pl-3 text-xs text-ink"
          aria-label="Sort products"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-plum" width={14} height={14} />
      </span>
    </label>
  );
}
