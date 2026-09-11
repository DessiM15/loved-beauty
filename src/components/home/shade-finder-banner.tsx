import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, SparkleIcon } from "@/components/ui/icons";

/** Home page entry to the shade finder. Compact by design: one line, one button. */
export function ShadeFinderBanner() {
  return (
    <section className="container-lb py-6" aria-labelledby="shade-banner-heading">
      <Link
        href="/shade-finder"
        className="group relative flex flex-col items-center gap-5 overflow-hidden rounded-3xl bg-ink px-6 py-8 text-white md:flex-row md:justify-between md:px-10"
      >
        <div className="flex items-center gap-4">
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-petal sm:inline-flex">
            <SparkleIcon />
          </span>
          <div>
            <p className="text-[0.62rem] tracking-luxe uppercase text-petal">New · Shade finder</p>
            <h2 id="shade-banner-heading" className="mt-1 font-serif text-2xl leading-tight md:text-3xl">
              Not sure which shade is yours? Find out in 30 seconds.
            </h2>
            <p className="mt-1 text-sm text-white/70">Use a selfie or answer three quick questions.</p>
          </div>
        </div>
        <span className="btn shrink-0 bg-white text-ink group-hover:bg-petal">
          Find my shade <ArrowRightIcon width={14} height={14} />
        </span>
        <Image
          src="/brand/monogram-blush.png"
          alt=""
          width={120}
          height={112}
          className="pointer-events-none absolute -right-6 -bottom-8 h-40 w-auto opacity-10"
        />
      </Link>
    </section>
  );
}
