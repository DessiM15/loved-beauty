import Image from "next/image";
import Link from "next/link";
import { hero } from "@/content/site";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * The home page is this hero: a soft pink-cream ground, the products floating
 * around centred copy (the Kylie Cosmetics pattern). Each product is a
 * transparent cut-out positioned in percentages so the composition reflows
 * instead of cropping. Phones show two groups, desktops all six. They hold still.
 */
type Piece = {
  src: string;
  alt: string;
  w: number;
  h: number;
  /** desktop placement (percent of the hero box) */
  d: React.CSSProperties;
  /** phone placement; omit to hide on phones */
  m?: React.CSSProperties;
  rotate?: number;
};

const pieces: Piece[] = [
  { src: "/hero/setting-spray.webp", alt: "Shimmer Glow Setting Spray", w: 206, h: 509, d: { left: "3%", top: "16%", height: "56%" }, m: { left: "3%", bottom: "4%", height: "32%" }, rotate: -8 },
  { src: "/hero/oil-spray.webp", alt: "Shimmer Glow Oil Spray", w: 228, h: 376, d: { left: "13%", top: "42%", height: "42%" } },
  { src: "/hero/holo-tube.webp", alt: "Loved Beauty lip oil", w: 372, h: 190, d: { left: "1%", bottom: "6%", width: "24%" }, rotate: 0 },
  { src: "/hero/tan-tube.webp", alt: "Shimmer Highlighter", w: 202, h: 469, d: { right: "-0.6%", top: "8%", height: "52%" } },
  { src: "/hero/lip-scrub.webp", alt: "Sugar Lip Scrub", w: 233, h: 217, d: { right: "10%", top: "27%", height: "24%" } },
  { src: "/hero/gloss-trio.webp", alt: "Lustre lip glosses and Peptide Lip Lacquer", w: 462, h: 479, d: { right: "5%", bottom: "5%", height: "54%" }, m: { right: "1%", bottom: "3%", height: "34%" } },
];

export function Hero() {
  return (
    <section
      className="relative flex min-h-[calc(100svh-var(--announce-h))] flex-col overflow-hidden"
      aria-labelledby="hero-heading"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 50% 30%, #fdf6f3 0%, rgba(253,246,243,0) 70%), radial-gradient(ellipse 60% 50% at 15% 85%, #fbe4e4 0%, rgba(251,228,228,0) 70%), radial-gradient(ellipse 60% 50% at 88% 80%, #fae3df 0%, rgba(250,227,223,0) 70%), linear-gradient(180deg, #fbf3f0 0%, #f8e8e6 100%)",
      }}
    >
      {/* Products */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {pieces.map((p) => (
          <div key={p.src}>
            <div className="absolute hidden md:block" style={p.d}>
              <Floating piece={p} />
            </div>
            {p.m && (
              <div className="absolute md:hidden" style={p.m}>
                <Floating piece={p} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Copy */}
      <div className="container-lb relative flex flex-1 flex-col items-center justify-start pt-[calc(var(--header-h)+2.5rem)] pb-[38svh] text-center md:justify-center md:py-[calc(var(--header-h)+4rem)]">
        <p className="eyebrow text-[0.72rem] animate-fade-up" style={{ animationDelay: "200ms" }}>
          {hero.eyebrow}
        </p>
        <h1 id="hero-heading" className="h-display mt-5 max-w-3xl text-[3.1rem] sm:text-7xl md:text-8xl lg:text-[6.2rem] animate-fade-up" style={{ animationDelay: "320ms" }}>
          {hero.headlineLead}
          <br />
          <span className="h-italic">{hero.headlineAccent}</span>
        </h1>
        <p className="p-serif mx-auto mt-5 max-w-lg text-[1.15rem] text-plum md:text-[1.3rem] animate-fade-up" style={{ animationDelay: "460ms" }}>
          {hero.subhead}
        </p>
        <div className="mt-7 flex flex-wrap md:mt-9 items-center justify-center gap-5 animate-fade-up" style={{ animationDelay: "600ms" }}>
          <Link href={hero.primaryCta.href} className="btn btn-primary">
            {hero.primaryCta.label} <ArrowRightIcon width={14} height={14} />
          </Link>
          <Link href={hero.secondaryCta.href} className="link-underline text-[0.7rem] font-medium tracking-luxe uppercase text-ink">
            {hero.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

/** One cut-out. Sized by its container, still, grounded by a soft shadow. */
function Floating({ piece }: { piece: Piece }) {
  const landscape = piece.w > piece.h;
  return (
    <div
      className="h-full w-full"
      style={{
        transform: `rotate(${piece.rotate ?? 0}deg)`,
        filter: "drop-shadow(0 26px 22px rgba(120, 70, 80, 0.22))",
      }}
    >
      <Image
        src={piece.src}
        alt={piece.alt}
        width={piece.w}
        height={piece.h}
        priority
        sizes="(min-width: 768px) 30vw, 45vw"
        className={landscape ? "h-auto w-full" : "h-full w-auto"}
        style={{ maxWidth: "none" }}
      />
    </div>
  );
}
