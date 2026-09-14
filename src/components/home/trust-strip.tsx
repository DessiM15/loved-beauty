import { trust } from "@/content/site";
import { HeartIcon, LeafIcon, SparkleIcon } from "@/components/ui/icons";

const icons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  clean: LeafIcon,
  tones: HeartIcon,
  results: SparkleIcon,
};

/** Three promises on a light tan band under the hero (option 1G). Home only. */
export function TrustStrip() {
  return (
    <section aria-label="Our promise" className="border-y border-tan-line bg-tan">
      <ul className="grid grid-cols-3">
        {trust.map((t) => {
          const Icon = icons[t.key] ?? LeafIcon;
          return (
            <li key={t.key} className="flex flex-col items-center gap-2.5 px-2 py-7 text-center text-[0.6rem] font-medium tracking-[0.2em] uppercase text-ink not-first:border-l not-first:border-tan-line md:gap-3 md:py-11 md:text-[0.7rem] md:tracking-[0.26em]">
              <Icon width={26} height={26} className="md:h-[30px] md:w-[30px]" />
              {t.label}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
