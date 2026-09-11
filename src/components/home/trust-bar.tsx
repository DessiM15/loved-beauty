import { LockIcon, MailIcon, TruckIcon, HeartIcon } from "@/components/ui/icons";
import { freeShippingThreshold, site } from "@/content/site";

export function TrustBar() {
  const items = [
    { icon: TruckIcon, title: `Free U.S. shipping over $${freeShippingThreshold}`, text: "Ships from Texas in 1 to 3 business days." },
    { icon: LockIcon, title: "Secure checkout", text: "Shop Pay, Apple Pay, Google Pay and all major cards." },
    { icon: HeartIcon, title: "Packed with love", text: "Every order is hand-packed and checked." },
    { icon: MailIcon, title: "We're here to help", text: site.supportEmail },
  ];
  return (
    <section className="container-lb py-12" aria-label="Why shop with us">
      <ul className="grid gap-6 rounded-3xl border border-petal bg-white px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3">
            <Icon className="mt-0.5 shrink-0 text-rose" />
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="mt-0.5 text-xs text-plum">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
