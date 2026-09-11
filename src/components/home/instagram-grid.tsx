import Image from "next/image";
import { instagram } from "@/content/site";
import { InstagramIcon } from "@/components/ui/icons";

/** Hairline grid of six posts, edge to edge. Curated, not a live feed (see content/site.ts). */
export function InstagramGrid() {
  return (
    <section className="hairline-t" aria-labelledby="ig-heading">
      <div className="container-lb flex flex-col gap-3 py-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow" data-reveal>
            {instagram.handle}
          </p>
          <h2 id="ig-heading" className="h-display mt-3 text-5xl" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
            {instagram.headline}
          </h2>
        </div>
        <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-2 self-start text-[0.68rem] tracking-luxe uppercase text-ink md:self-auto" data-reveal>
          <InstagramIcon width={16} height={16} /> Follow along
        </a>
      </div>
      <ul className="grid grid-cols-3 hairline-t md:grid-cols-6">
        {instagram.posts.map((post, i) => (
          <li key={i} className="border-r border-b border-line [&:nth-child(3n)]:border-r-0 md:border-b-0 md:[&:nth-child(3n)]:border-r md:last:border-r-0" data-reveal="fade" style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
            <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden" aria-label={`${post.alt} on Instagram`}>
              <Image src={post.src} alt={post.alt} fill sizes="(min-width: 768px) 16vw, 33vw" className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-white opacity-0 transition duration-500 group-hover:bg-ink/25 group-hover:opacity-100">
                <InstagramIcon />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
