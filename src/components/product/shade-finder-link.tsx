import Link from "next/link";
import { SparkleIcon } from "@/components/ui/icons";

/** Shown on product pages that have shades. Removes the "which one?" hesitation. */
export function ShadeFinderLink() {
  return (
    <Link
      href="/shade-finder"
      className="mt-3 inline-flex items-center gap-1.5 text-xs text-rose-deep underline decoration-petal underline-offset-4 hover:decoration-rose"
    >
      <SparkleIcon width={14} height={14} /> Not sure which shade? Find your match
    </Link>
  );
}
