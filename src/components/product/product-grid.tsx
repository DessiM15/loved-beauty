import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

/** Hairline product grid: cells separated by 1px lines, no card backgrounds. */
export function ProductGrid({
  products,
  columns = 4,
  priorityCount = 4,
  className,
}: {
  products: Product[];
  columns?: 3 | 4;
  priorityCount?: number;
  className?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="border border-dashed border-line p-16 text-center">
        <p className="font-serif text-3xl">Nothing here yet.</p>
        <p className="mt-2 text-sm text-plum">Check back soon, new products are on their way.</p>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px bg-line",
        columns === 4 ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-3",
        className,
      )}
    >
      {products.map((p, i) => (
        <div key={p.id} className="bg-cream p-3 md:p-5">
          <ProductCard product={p} priority={i < priorityCount} index={i} />
        </div>
      ))}
    </div>
  );
}
