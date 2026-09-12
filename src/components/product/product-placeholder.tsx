import Image from "next/image";

/** Tile for products without photography yet: brand pink ground, logo, name. */
export function ProductPlaceholder({ title }: { title: string; handle?: string }) {
  return (
    <div className="absolute inset-0 bg-pink">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="logo-smoke inline-block">
          <Image src="/brand/logo.png" alt="" width={2100} height={600} className="h-9 w-auto" />
        </span>
        <p className="text-lg font-semibold leading-tight text-ink">{title}</p>
        <p className="text-[0.55rem] tracking-luxe uppercase text-plum">Photography coming soon</p>
      </div>
    </div>
  );
}
