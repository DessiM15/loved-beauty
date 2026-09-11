import Image from "next/image";
import { placeholderTint } from "@/lib/utils";

/** Styled tile for products that don't have photography yet. */
export function ProductPlaceholder({ title, handle }: { title: string; handle: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
      style={{ background: `radial-gradient(120% 90% at 50% 100%, #ffffff 0%, ${placeholderTint(handle)} 70%)` }}
    >
      <Image src="/brand/monogram-rose.png" alt="" width={120} height={112} className="h-14 w-auto opacity-60" />
      <p className="font-serif text-lg leading-tight text-ink/80">{title}</p>
      <p className="text-[0.62rem] tracking-luxe uppercase text-rose-deep">Photos coming soon</p>
    </div>
  );
}
