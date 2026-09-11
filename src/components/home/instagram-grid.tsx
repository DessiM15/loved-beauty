import { instagram, noir } from "@/content/site";
import { ThemedImage } from "@/components/theme/themed";
import { InstagramIcon } from "@/components/ui/icons";
import { SectionIntro } from "@/components/ui/section-intro";

/** Hairline grid of six posts, edge to edge. Curated, not a live feed (see content/site.ts). */
export function InstagramGrid() {
  return (
    <section className="hairline-t" aria-labelledby="ig-heading">
      <SectionIntro id="ig-heading" eyebrow={instagram.handle} title={instagram.headline} text={instagram.text} link={{ label: "Follow along", href: instagram.url, external: true }} />
      <ul className="grid grid-cols-3 hairline-t md:grid-cols-6">
        {instagram.posts.map((post, i) => (
          <li key={i} className="border-r border-b border-line [&:nth-child(3n)]:border-r-0 md:border-b-0 md:[&:nth-child(3n)]:border-r md:last:border-r-0" data-reveal="fade" style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
            <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden" aria-label={`${post.alt} on Instagram`}>
              <ThemedImage light={{ src: post.src, alt: post.alt }} dark={post.src.startsWith("/editorial/") ? { src: noir.instagram[Math.floor(i / 2) % noir.instagram.length], alt: post.alt } : { src: post.src, alt: post.alt }} fill sizes="(min-width: 768px) 16vw, 33vw" className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
              <span className="absolute inset-0 flex items-center justify-center text-[#fbf7f5] opacity-0 transition duration-500 group-hover:opacity-100" style={{ background: "rgba(20,14,16,0.3)" }}>
                <InstagramIcon />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
