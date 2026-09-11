import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { getProduct } from "@/lib/shopify";
import { profileFromQuiz, recommend, type ShadeProfile, type Vibe } from "@/lib/shade/recommend";

/**
 * Shade finder API.
 *
 * Two inputs, one output:
 *   { answers: { veins, depth, vibe } }            → quiz path, no AI, always available
 *   { image: <base64>, mediaType, vibe }            → selfie path, Claude vision reads undertone + depth
 *
 * Privacy: the selfie is analyzed in memory and never written to disk or
 * logged. Claude is instructed to describe coloring only, never identity.
 *
 * Cost: one image call ≈ 1.5k input + 200 output tokens. At Opus 5 pricing
 * that is roughly $0.01 per match; 1,000 matches a month ≈ $12.
 * Override the model with SHADE_MATCH_MODEL if needed.
 */

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = process.env.SHADE_MATCH_MODEL ?? "claude-opus-5";
const MAX_IMAGE_BYTES = 2_500_000; // ~2.5MB after client-side downscale
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const AnalysisSchema = z.object({
  undertone: z.enum(["cool", "neutral", "warm"]),
  depth: z.enum(["fair", "light", "medium", "tan", "deep"]),
  natural_lip_tone: z.string().describe("Two to four words, e.g. 'soft rosy pink' or 'deep mauve brown'"),
  confidence: z.enum(["low", "medium", "high"]),
  note: z.string().describe("One friendly sentence about the lighting or how sure the read is. No identity details."),
});

// Simple per-instance rate limit: 10 selfie analyses per IP per 10 minutes.
const hits = new Map<string, { n: number; reset: number }>();
function limited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || rec.reset < now) {
    hits.set(ip, { n: 1, reset: now + 10 * 60 * 1000 });
    return false;
  }
  rec.n += 1;
  return rec.n > 10;
}

async function buildResponse(profile: ShadeProfile, analysis?: z.infer<typeof AnalysisSchema>) {
  const rec = recommend(profile);
  const picks = await Promise.all(
    rec.picks.map(async (pick) => {
      const product = await getProduct(pick.handle);
      if (!product) return null;
      const byShade = pick.shade ? product.variants.find((v) => v.selectedOptions.some((o) => o.value === pick.shade)) : undefined;
      const variant = byShade ?? product.variants[0];
      return {
        role: pick.role,
        why: pick.why,
        handle: product.handle,
        title: product.title,
        shade: pick.shade ?? null,
        price: variant.price,
        image: variant.image ?? product.featuredImage,
        variantId: variant.id,
        available: variant.availableForSale,
      };
    }),
  );
  return {
    ok: true,
    profile,
    analysis: analysis
      ? { lipTone: analysis.natural_lip_tone, confidence: analysis.confidence, note: analysis.note }
      : null,
    headline: rec.headline,
    summary: rec.summary,
    picks: picks.filter((p): p is NonNullable<typeof p> => Boolean(p)),
  };
}

export async function POST(req: Request) {
  let body: { answers?: { veins: string; depth: string; vibe: string }; image?: string; mediaType?: string; vibe?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }

  // ---- Quiz path ----
  if (body.answers) {
    return NextResponse.json(await buildResponse(profileFromQuiz(body.answers)));
  }

  // ---- Selfie path ----
  if (!body.image || !body.mediaType) {
    return NextResponse.json({ ok: false, message: "Please add a photo or answer the questions." }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ok: false, code: "unavailable", message: "Selfie matching isn't switched on yet. Try the three questions instead." }, { status: 503 });
  }
  if (!ALLOWED_TYPES.has(body.mediaType)) {
    return NextResponse.json({ ok: false, message: "Please use a JPG, PNG or WebP photo." }, { status: 400 });
  }
  const data = body.image.replace(/^data:[^;]+;base64,/, "");
  if (data.length * 0.75 > MAX_IMAGE_BYTES) {
    return NextResponse.json({ ok: false, message: "That photo is a little large. Please try a smaller one." }, { status: 413 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, message: "Lots of matching going on. Please try again in a few minutes." }, { status: 429 });
  }

  const vibes: Vibe[] = ["barely-there", "everyday", "bold"];
  const vibe: Vibe = vibes.includes(body.vibe as Vibe) ? (body.vibe as Vibe) : "everyday";

  const client = new Anthropic();
  try {
    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 1024,
      output_config: { effort: "low", format: zodOutputFormat(AnalysisSchema) },
      system: [
        {
          type: "text",
          text:
            "You are a makeup artist helping a shopper choose a lip liner and gloss shade from a selfie. " +
            "Look only at skin coloring and the natural lip color. Determine the skin undertone (cool = pink/blue-leaning, warm = golden/peach-leaning, neutral = a balance), " +
            "the skin depth on a five-step scale (fair, light, medium, tan, deep), and describe the natural lip tone in a few words. " +
            "Account for lighting: warm indoor light and filters can exaggerate warmth; note lower confidence when lighting is poor. " +
            "Never describe or guess the person's identity, age, ethnicity, gender or anything beyond coloring. If no face or lips are visible, set confidence to low and explain in the note.",
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: body.mediaType as "image/jpeg" | "image/png" | "image/webp", data } },
            { type: "text", text: "Analyze this selfie for undertone, depth and natural lip tone." },
          ],
        },
      ],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return NextResponse.json({ ok: false, message: "We couldn't read that photo. Try a clearer, well-lit selfie or answer the questions." }, { status: 422 });
    }

    const analysis = response.parsed_output;
    const profile: ShadeProfile = { undertone: analysis.undertone, depth: analysis.depth, vibe };
    return NextResponse.json(await buildResponse(profile, analysis));
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ ok: false, message: "Lots of matching going on. Please try again in a minute." }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      console.error("shade-match api error", error.status, error.message);
    } else {
      console.error("shade-match", error);
    }
    return NextResponse.json({ ok: false, message: "Something went wrong reading the photo. Try the three questions instead." }, { status: 502 });
  }
}
