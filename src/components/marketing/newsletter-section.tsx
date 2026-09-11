import { newsletter } from "@/content/site";
import { NewsletterForm } from "./newsletter-form";

export function NewsletterSection() {
  return (
    <section className="bg-blush" aria-labelledby="newsletter-heading">
      <div className="container-lb py-16 text-center md:py-20">
        <p className="eyebrow">{newsletter.eyebrow}</p>
        <h2 id="newsletter-heading" className="h-display mt-3 text-4xl md:text-5xl">
          {newsletter.headline}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] text-plum">{newsletter.text}</p>
        <div className="mt-7">
          <NewsletterForm source="home" />
        </div>
      </div>
    </section>
  );
}
