import Image from "next/image";

/** Tile for products without photography yet: hot pink ground, logo, name. */
export function ProductPlaceholder({ title }: { title: string; handle?: string }) {
  return (
    <div className="absolute inset-0 bg-hot text-white">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <Image src="/brand/logo.png" alt="" width={2100} height={600} className="h-10 w-auto" />
        <p className="h-display text-2xl">{title}</p>
        <p className="text-[0.55rem] tracking-luxe uppercase text-pink">Photography coming soon</p>
      </div>
    </div>
  );
}
