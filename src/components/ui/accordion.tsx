import { ChevronDownIcon } from "./icons";
import { cn } from "@/lib/utils";

/**
 * Native <details> accordion: no JS, accessible, and the content is in the
 * HTML for Google (important for FAQ rich results).
 */
export function Accordion({
  items,
  className,
  defaultOpen = 0,
}: {
  items: { title: string; content: React.ReactNode }[];
  className?: string;
  defaultOpen?: number | null;
}) {
  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, i) => (
        <details key={item.title} className="group" open={defaultOpen === i}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[0.95rem] font-medium text-ink marker:hidden [&::-webkit-details-marker]:hidden">
            {item.title}
            <ChevronDownIcon className="shrink-0 text-plum transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <div className="pb-5 text-sm leading-relaxed text-plum">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
