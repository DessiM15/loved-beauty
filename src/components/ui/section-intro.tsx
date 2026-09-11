import Link from "next/link";
import { ArrowRightIcon } from "./icons";

/** Centered section opener: eyebrow, large serif title (optional italic tail), optional line and link. */
export function SectionIntro({
  id,
  eyebrow,
  title,
  italic,
  text,
  link,
  className = "py-14 md:py-20",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  italic?: string;
  text?: string;
  link?: { label: string; href: string; external?: boolean };
  className?: string;
}) {
  return (
    <div className={`container-lb flex flex-col items-center text-center ${className}`}>
      {eyebrow && (
        <p className="eyebrow" data-reveal>
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="h-display mt-3 max-w-4xl text-5xl md:text-6xl" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
        {title} {italic && <em className="h-italic text-rose-deep">{italic}</em>}
      </h2>
      {text && (
        <p className="mt-5 max-w-lg text-[0.98rem] leading-relaxed text-plum" data-reveal style={{ "--d": "180ms" } as React.CSSProperties}>
          {text}
        </p>
      )}
      {link &&
        (link.external ? (
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="link-underline mt-6 inline-flex items-center gap-2 text-[0.68rem] tracking-luxe uppercase text-ink" data-reveal style={{ "--d": "240ms" } as React.CSSProperties}>
            {link.label} <ArrowRightIcon width={12} height={12} />
          </a>
        ) : (
          <Link href={link.href} className="link-underline mt-6 inline-flex items-center gap-2 text-[0.68rem] tracking-luxe uppercase text-ink" data-reveal style={{ "--d": "240ms" } as React.CSSProperties}>
            {link.label} <ArrowRightIcon width={12} height={12} />
          </Link>
        ))}
    </div>
  );
}
