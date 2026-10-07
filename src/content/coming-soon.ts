/**
 * The launch page shown while the store is closed.
 * Change the copy and the launch moment here; the page reads everything from this file.
 */
export const comingSoon = {
  /** Launch moment. PLACEHOLDER: midnight in Houston on 31 October 2026, until the real date is set. */
  launchAt: "2026-10-31T00:00:00-05:00",
  headline: { lead: "Coming", accent: "Soon" },
  subhead: "Be the first to know when we launch.",
  form: {
    firstName: "First name",
    email: "Email address",
    cta: "Notify me",
    legal: "By signing up you agree to receive emails from Loved Beauty. Unsubscribe anytime.",
    done: "You’re on the list",
    doneText: "We’ll email you the moment we launch.",
  },
  film: {
    src: "/coming-soon/loved-beauty-film.mp4",
    poster: "/coming-soon/poster.jpg",
    label: "Loved Beauty launch film",
  },
  logo: "/coming-soon/logo.png",
  credit: "Designed by Smart Scale, LLC",
  /** How long the ending holds the screen before the film starts again (ms). */
  revealMs: 4800,
} as const;
