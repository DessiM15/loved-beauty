import type { Money } from "@/lib/shopify/types";
import { cn, formatMoney } from "@/lib/utils";

export function Price({
  price,
  compareAt,
  className,
  prefix,
}: {
  price: Money;
  compareAt?: Money | null;
  className?: string;
  prefix?: string;
}) {
  const onSale = compareAt && Number(compareAt.amount) > Number(price.amount);
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      {prefix && <span className="text-plum">{prefix}</span>}
      <span className={onSale ? "text-rose-deep" : undefined}>{formatMoney(price)}</span>
      {onSale && (
        <s className="text-plum/70" aria-label={`Regular price ${formatMoney(compareAt)}`}>
          {formatMoney(compareAt)}
        </s>
      )}
    </span>
  );
}
