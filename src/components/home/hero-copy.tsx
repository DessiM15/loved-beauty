import Link from "next/link";
import { hero } from "@/content/site";
import { ArrowRightIcon } from "@/components/ui/icons";

export const IVORY = "#f5ece6";
export const ROSE = "#e3a5b4";
export const PLUM_TEXT = "#c9b6bb";

/** Launch copy shared by both heroes. `dark` forces ivory type (both heroes sit on dark photography). */
export function HeroCopy({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  const ink = dark ? IVORY : undefined;
  return (
    <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
      <p className="eyebrow text-[0.72rem] animate-fade-up" style={{ animationDelay: "500ms", color: dark ? ROSE : undefined }}>
        {hero.eyebrow}
      </p>
      <h1 id="hero-heading" className={`h-display mt-5 animate-fade-up ${compact ? "text-5xl sm:text-6xl md:text-7xl" : "text-[3.4rem] sm:text-7xl md:text-8xl"}`} style={{ animationDelay: "650ms", color: ink }}>
        {hero.headlineLead}{" "}
        <em className="h-italic" style={{ color: dark ? ROSE : undefined }}>
          {hero.headlineItalic}
        </em>
      </h1>
      <span className="mt-6 gold-rule animate-fade-up" style={{ animationDelay: "720ms" }} />
      <p className="mx-auto mt-6 max-w-md text-[0.98rem] leading-relaxed animate-fade-up" style={{ animationDelay: "800ms", color: dark ? PLUM_TEXT : undefined }}>
        {hero.subhead}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-5 animate-fade-up" style={{ animationDelay: "950ms" }}>
        <Link href={hero.primaryCta.href} className="btn" style={dark ? { background: IVORY, color: "#17110f", borderColor: IVORY } : undefined}>
          {hero.primaryCta.label} <ArrowRightIcon width={14} height={14} />
        </Link>
        <Link href={hero.secondaryCta.href} className="link-underline text-[0.68rem] tracking-luxe uppercase" style={{ color: ink }}>
          {hero.secondaryCta.label}
        </Link>
      </div>
    </div>
  );
}

export function ScrollCue({ dark = false, label = "Scroll" }: { dark?: boolean; label?: string }) {
  return (
    <div className="absolute right-6 bottom-8 hidden flex-col items-center gap-3 md:flex" aria-hidden="true" style={{ color: dark ? PLUM_TEXT : undefined }}>
      <span className="text-[0.58rem] tracking-luxe uppercase [writing-mode:vertical-rl]">{label}</span>
      <span className="block h-12 w-px overflow-hidden" style={{ background: dark ? "rgba(245,236,230,0.2)" : undefined }}>
        <span className="block h-full w-full" style={{ background: dark ? IVORY : undefined, animation: "scroll-cue 2.4s cubic-bezier(0.76,0,0.24,1) infinite" }} />
      </span>
    </div>
  );
}
