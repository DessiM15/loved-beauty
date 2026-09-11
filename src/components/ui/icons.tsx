import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const BagIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true" {...base} {...p}>
    <path d="M6 8h12l1 12H5L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true" {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const MenuIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true" {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true" {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ArrowRightIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true" {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ChevronDownIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true" {...base} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const TrashIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" {...base} {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" {...base} {...p}>
    <path d="m5 12 4 4L19 6" />
  </svg>
);

export const HeartIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" fill="currentColor" {...p}>
    <path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.2 5 6.8 5c2 0 3.4 1.1 4.2 2.4C11.8 6.1 13.2 5 15.2 5c3.6 0 5.6 3.6 4.3 6.8C17.5 16.4 12 21 12 21Z" />
  </svg>
);

export const StarIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" fill="currentColor" {...p}>
    <path d="m12 2.5 2.9 6.2 6.8.8-5 4.7 1.3 6.8L12 17.6 6 21l1.3-6.8-5-4.7 6.8-.8L12 2.5Z" />
  </svg>
);

export const InstagramIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true" {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const TikTokIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true" fill="currentColor" {...p}>
    <path d="M14 3h3c.3 2.3 1.8 3.9 4 4.2v3c-1.5 0-2.9-.5-4-1.3V15a6 6 0 1 1-6-6h.5v3.1A3 3 0 1 0 14 15V3Z" />
  </svg>
);

export const LeafIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true" {...base} {...p}>
    <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" />
    <path d="M5 19c3-4 6-7 10-10" />
  </svg>
);

export const BunnyIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true" {...base} {...p}>
    <path d="M9 10c-1.5-3-2.5-6-1-7s3 2 3.5 5M15 10c1.5-3 2.5-6 1-7s-3 2-3.5 5" />
    <path d="M6 15a6 6 0 0 1 12 0c0 3-2.7 5-6 5s-6-2-6-5Z" />
    <path d="M10.5 15.5h3" />
  </svg>
);

export const DropIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true" {...base} {...p}>
    <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
  </svg>
);

export const SparkleIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true" {...base} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2" />
  </svg>
);

export const ShieldIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true" {...base} {...p}>
    <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const TruckIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true" {...base} {...p}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.5" />
    <circle cx="17" cy="18" r="1.5" />
  </svg>
);

export const LockIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true" {...base} {...p}>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const MailIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true" {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
