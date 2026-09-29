/** True when the shopper has asked their device for less motion. Scripted scrolling checks this; CSS handles the rest. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
