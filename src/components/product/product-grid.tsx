import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

/** Simple product grid: two columns on phones, up to four on desktop. */
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
        <p className="text-2xl font-semibold">Nothing here yet.</p>
        <p className="mt-2 text-sm text-plum">Check back soon, new products are on their way.</p>
      </div>
    );
  }
  return (
    <div className={cn("grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12", columns === 4 ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-3", className)}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} index={i} />
      ))}
    </div>
  );
}
