import { values } from "@/content/site";
import { BunnyIcon, DropIcon, LeafIcon, ShieldIcon } from "@/components/ui/icons";

const icons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  vegan: LeafIcon,
  "cruelty-free": BunnyIcon,
  clean: DropIcon,
  "paraben-free": ShieldIcon,
};

export function ValueStrip() {
  return (
    <section className="border-y border-line bg-cream" aria-label="Our values">
      <div className="container-lb grid grid-cols-2 gap-6 py-8 md:grid-cols-4 md:py-10">
        {values.map((v) => {
          const Icon = icons[v.key] ?? LeafIcon;
          return (
            <div key={v.key} className="flex items-start gap-3 md:flex-col md:items-center md:text-center">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-blush text-rose-deep">
                <Icon />
              </span>
              <div>
                <p className="text-sm font-medium">{v.title}</p>
                <p className="mt-0.5 text-xs text-plum">{v.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
