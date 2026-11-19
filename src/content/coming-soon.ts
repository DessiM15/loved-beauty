/**
 * The launch page shown while the store is closed.
 * Change the copy here; the page reads everything from this file.
 */
export const comingSoon = {
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
    src: "/coming-soon/loved-beauty-film-short.mp4",
    poster: "/coming-soon/poster-short.jpg",
    /** The picture used when the page is shared in a text or on social media. */
    share: "/coming-soon/share.jpg",
    label: "Loved Beauty launch film",
  },
  logo: "/coming-soon/logo.png",
  credit: "Designed by Smart Scale, LLC",
  /** How long the ending holds the screen before the film starts again (ms). */
  revealMs: 4800,
} as const;
