import Link from "next/link";
import { Parallax } from "@/components/motion/parallax";
import { noir } from "@/content/site";
import { ThemedImage } from "@/components/theme/themed";
import { ArrowRightIcon } from "@/components/ui/icons";

/** Full-bleed shade finder entry over the swatch photograph. */
export function ShadeFinderBanner() {
  return (
    <section className="relative overflow-hidden hairline-t" aria-labelledby="shade-banner-heading">
      <Parallax amount={6} className="absolute inset-0">
        <ThemedImage light={{ src: "/editorial/swatches.webp", alt: "Lip color swatches on an arm", position: "50% 40%" }} dark={noir.swatches} fill sizes="100vw" className="object-cover" />
      </Parallax>
      <div className="absolute inset-0 bg-cream/60" />
      <div className="container-lb relative flex min-h-[60vh] items-center justify-center py-20">
        <div className="flex max-w-2xl flex-col items-center text-center">
          <p className="eyebrow" data-reveal>
            New · Shade finder
          </p>
          <h2 id="shade-banner-heading" className="h-display mt-4 text-5xl md:text-6xl" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
            Not sure which shade is <em className="h-italic text-rose-deep">yours?</em>
          </h2>
          <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-plum" data-reveal style={{ "--d": "200ms" } as React.CSSProperties}>
            Snap a selfie or answer three quick questions. We&rsquo;ll match you to the liner and gloss made for your undertone, in 30 seconds.
          </p>
          <Link href="/shade-finder" className="btn btn-primary mt-8" data-reveal style={{ "--d": "300ms" } as React.CSSProperties}>
            Find my shade <ArrowRightIcon width={14} height={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
