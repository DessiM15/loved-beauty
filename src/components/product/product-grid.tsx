import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

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
      <div className="rounded-2xl border border-dashed border-petal p-12 text-center">
        <p className="font-serif text-2xl">Nothing here yet.</p>
        <p className="mt-2 text-sm text-plum">Check back soon, new products are on their way.</p>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-9 md:gap-x-6",
        columns === 4 ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-3",
        className,
      )}
    >
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} index={i} />
      ))}
    </div>
  );
}
