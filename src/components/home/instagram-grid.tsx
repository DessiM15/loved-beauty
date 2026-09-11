import Image from "next/image";
import { instagram } from "@/content/site";
import { InstagramIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Curated Instagram grid. A live feed via Instagram's API is brittle and
 * needs app review; a curated set of six images that links to the profile
 * looks identical and never breaks. Update `instagram.posts` in content/site.ts.
 */
export function InstagramGrid() {
  return (
    <section className="container-lb py-16 md:py-20" aria-labelledby="ig-heading">
      <SectionHeading eyebrow={instagram.handle} title={instagram.headline} text={instagram.text} />
      <ul className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
        {instagram.posts.map((post, i) => (
          <li key={i}>
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-xl bg-blush"
              aria-label={`${post.alt} on Instagram`}
            >
              <Image src={post.src} alt={post.alt} fill sizes="(min-width: 768px) 16vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-white opacity-0 transition group-hover:bg-ink/30 group-hover:opacity-100">
                <InstagramIcon />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
