import { StarIcon } from "@/components/ui/icons";

/**
 * Reviews block. Hidden until NEXT_PUBLIC_SHOW_REVIEWS=true, because an
 * empty reviews section hurts trust more than none at all.
 *
 * When ready, connect a Shopify reviews app (Judge.me, Loox or Shopify's
 * own Product Reviews) and render its data here; the markup below is the
 * layout target, with sample content for the demo only.
 */
export function Reviews({ productTitle }: { productTitle: string }) {
  if (process.env.NEXT_PUBLIC_SHOW_REVIEWS !== "true") return null;

  const sample = [
    { name: "Demo review", rating: 5, text: `Sample review for ${productTitle}. Replace with real reviews from your reviews app.` },
  ];

  return (
    <section className="mt-16" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="h-display text-3xl">
        Loved by you
      </h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {sample.map((r) => (
          <li key={r.name} className="rounded-2xl border border-petal bg-white p-5">
            <div className="flex items-center gap-1 text-gold" aria-label={`${r.rating} out of 5 stars`}>
              {Array.from({ length: r.rating }).map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <p className="mt-3 text-sm text-plum">{r.text}</p>
            <p className="mt-3 text-xs tracking-wide uppercase">{r.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
