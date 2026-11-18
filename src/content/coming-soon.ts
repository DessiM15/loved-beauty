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
    src: "/coming-soon/loved-beauty-film.mp4",
    poster: "/coming-soon/poster.jpg",
    label: "Loved Beauty launch film",
  },
  logo: "/coming-soon/logo.png",
  credit: "Designed by Smart Scale, LLC",
  /** How long the ending holds the screen before the film starts again (ms). */
  revealMs: 4800,
  /**
   * The film's end card: the picture fades to black by 30.5s and the wordmark appears at 30.8s.
   * On a wide screen the film is cropped to a band, so from `at` the film pinches in and lifts
   * until the whole wordmark sits in the clear space under the signup. The wordmark's place in
   * the frame (fractions of its height and width) was measured from the file.
   */
  endCard: { at: 30.55, wordmark: { top: 0.441, bottom: 0.562, left: 0.078, right: 0.921 } },
} as const;
