import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-lb flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="eyebrow">404</p>
      <h1 className="h-display mt-3 text-5xl">This page has wandered off.</h1>
      <p className="mt-3 max-w-sm text-sm text-plum">The link may be old or the product may have moved. Our bestsellers are right here.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/shop" className="btn btn-primary">
          Shop all
        </Link>
        <Link href="/" className="btn btn-outline">
          Home
        </Link>
      </div>
    </div>
  );
}
