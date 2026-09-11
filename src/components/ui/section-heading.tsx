import Link from "next/link";
import { ArrowRightIcon } from "./icons";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  text,
  link,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  link?: { label: string; href: string };
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-3 md:mb-10",
        align === "center" ? "items-center text-center" : "items-start text-left md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={align === "center" ? "max-w-xl" : "max-w-xl"}>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="h-display text-3xl md:text-4xl">{title}</h2>
        {text && <p className="mt-3 text-[0.95rem] leading-relaxed text-plum">{text}</p>}
      </div>
      {link && (
        <Link href={link.href} className="link-underline inline-flex items-center gap-1.5 text-[0.74rem] tracking-[0.14em] uppercase text-ink">
          {link.label} <ArrowRightIcon width={14} height={14} />
        </Link>
      )}
    </div>
  );
}
