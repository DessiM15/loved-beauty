/**
 * Shade recommendation engine.
 * Pure and deterministic so it can be unit-tested and reused by both the
 * quiz (no AI) and the selfie analysis (AI supplies the inputs).
 *
 * Shade names must match the variant option values in Shopify. Update the
 * LINER map when the client confirms the real eight liner shades.
 */

export type Undertone = "cool" | "neutral" | "warm";
export type Depth = "fair" | "light" | "medium" | "tan" | "deep";
export type Vibe = "barely-there" | "everyday" | "bold";

export type ShadeProfile = {
  undertone: Undertone;
  depth: Depth;
  vibe: Vibe;
};

export type Pick = {
  handle: string;
  /** Variant option value to preselect (e.g. a Shade). Omit for single-variant products. */
  shade?: string;
  role: "Line" | "Gloss" | "Finish" | "Prep";
  why: string;
};

export type Recommendation = {
  headline: string;
  summary: string;
  picks: Pick[];
};

// Liner shade by depth × undertone. PLACEHOLDER names until confirmed.
const LINER: Record<Depth, Record<Undertone, string>> = {
  fair: { cool: "Petal", neutral: "Bare", warm: "Bare" },
  light: { cool: "Petal", neutral: "Nude Rose", warm: "Bare" },
  medium: { cool: "Mauve", neutral: "Nude Rose", warm: "Spice" },
  tan: { cool: "Mauve", neutral: "Spice", warm: "Spice" },
  deep: { cool: "Berry", neutral: "Cocoa", warm: "Cocoa" },
};

const BOLD_LINER: Record<Undertone, string> = { cool: "Berry", neutral: "Cherry", warm: "Cherry" };

const UNDERTONE_LABEL: Record<Undertone, string> = {
  cool: "cool, pink-leaning undertone",
  neutral: "neutral undertone",
  warm: "warm, golden undertone",
};

export function recommend(profile: ShadeProfile): Recommendation {
  const { undertone, depth, vibe } = profile;
  const liner = vibe === "bold" ? BOLD_LINER[undertone] : LINER[depth][undertone];

  const picks: Pick[] = [];

  if (vibe === "barely-there") {
    picks.push(
      { handle: "lip-liner-pencil", shade: liner, role: "Line", why: `${liner} disappears into your natural lip line and quietly adds definition.` },
      { handle: "hyaluronic-acid-lip-gloss", role: "Gloss", why: "Clear, hydrating shine with gold foil. Your lips, but glossier." },
      { handle: "soft-sphere-lip-balm", role: "Prep", why: "Keeps lips soft under gloss so the shine stays smooth." },
    );
    return {
      headline: `Your match: ${liner} + clear gloss`,
      summary: `With your ${UNDERTONE_LABEL[undertone]} and a barely-there vibe, the goal is definition without visible color. ${liner} liner and a clear hydrating gloss give a polished, lit-from-within lip.`,
      picks,
    };
  }

  if (vibe === "bold") {
    const glossShade = undertone === "cool" ? "Berry" : "Cherry";
    const glossHandle = undertone === "cool" ? "peptide-lip-lacquer" : "ultra-light-lip-oil";
    picks.push(
      { handle: "lip-liner-pencil", shade: liner, role: "Line", why: `${liner} gives a crisp edge and a long-wear base for bold color.` },
      { handle: glossHandle, shade: glossShade, role: "Gloss", why: `${glossShade} is the statement layer. Build it up from the center of the lips.` },
      { handle: "sugar-lip-scrub", role: "Prep", why: "Bold color shows every flake. Scrub the night before for an even finish." },
    );
    return {
      headline: `Your match: ${liner} + ${glossShade}`,
      summary: `Your ${UNDERTONE_LABEL[undertone]} carries ${glossShade} beautifully. Line and fill with ${liner}, then layer ${glossShade} on top for a bold, glossy statement that still looks like you.`,
      picks,
    };
  }

  // everyday
  picks.push(
    { handle: "lip-liner-pencil", shade: liner, role: "Line", why: `${liner} is your everyday nude: a touch deeper than your natural lip for shape.` },
    { handle: "lustre-lip-gloss", shade: "Nude", role: "Gloss", why: "Creamy vinyl shine that wears for hours without transferring." },
    { handle: "ultra-light-lip-oil", shade: "Cherry", role: "Finish", why: "A sheer tint to switch it up when you want a little more." },
  );
  return {
    headline: `Your match: ${liner} + Lustre Nude`,
    summary: `For an everyday lip on your ${UNDERTONE_LABEL[undertone]}, ${liner} liner under Lustre Lip Gloss in Nude gives that soft, defined, slightly-more-than-natural look that works with everything.`,
    picks,
  };
}

/** Map quiz answers to a profile. */
export function profileFromQuiz(answers: { veins: string; depth: string; vibe: string }): ShadeProfile {
  const undertone: Undertone = answers.veins === "blue" ? "cool" : answers.veins === "green" ? "warm" : "neutral";
  const depths: Depth[] = ["fair", "light", "medium", "tan", "deep"];
  const depth = depths.includes(answers.depth as Depth) ? (answers.depth as Depth) : "medium";
  const vibes: Vibe[] = ["barely-there", "everyday", "bold"];
  const vibe = vibes.includes(answers.vibe as Vibe) ? (answers.vibe as Vibe) : "everyday";
  return { undertone, depth, vibe };
}
