import Image from "next/image";

/** Tile for products without photography yet: silk ground, monogram, name. */
export function ProductPlaceholder({ title }: { title: string; handle?: string }) {
  return (
    <div className="absolute inset-0">
      <Image src="/editorial/silk-pale.webp" alt="" fill sizes="30vw" className="object-cover" />
      <div className="absolute inset-0 bg-cream/55" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <Image src="/brand/monogram-rose.png" alt="" width={120} height={112} className="h-12 w-auto opacity-70" />
        <p className="font-serif text-xl leading-tight text-ink">{title}</p>
        <p className="text-[0.55rem] tracking-luxe uppercase text-rose-deep">Photography coming soon</p>
      </div>
    </div>
  );
}
