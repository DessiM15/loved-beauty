import { newsletter } from "@/content/site";
import { NewsletterForm } from "./newsletter-form";

export function NewsletterSection() {
  return (
    <section className="hairline-t bg-blush" aria-labelledby="newsletter-heading">
      <div className="container-lb grid gap-10 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <p className="eyebrow" data-reveal>
            {newsletter.eyebrow}
          </p>
          <h2 id="newsletter-heading" className="h-display mt-4 text-5xl md:text-6xl" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
            {newsletter.headlineLead} <em className="h-italic text-rose-deep">{newsletter.headlineItalic}</em>
          </h2>
          <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-plum" data-reveal style={{ "--d": "200ms" } as React.CSSProperties}>
            {newsletter.text}
          </p>
        </div>
        <div data-reveal style={{ "--d": "260ms" } as React.CSSProperties}>
          <NewsletterForm source="home" variant="line" />
        </div>
      </div>
    </section>
  );
}
