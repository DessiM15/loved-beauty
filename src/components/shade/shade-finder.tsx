"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { BagIcon, CheckIcon, LockIcon, SparkleIcon } from "@/components/ui/icons";
import { cn, formatMoney, placeholderTint } from "@/lib/utils";
import type { Money, Image as ProductImage } from "@/lib/shopify/types";

type Pick = {
  role: string;
  why: string;
  handle: string;
  title: string;
  shade: string | null;
  price: Money;
  image: ProductImage | null;
  variantId: string;
  available: boolean;
};

type Result = {
  ok: true;
  headline: string;
  summary: string;
  analysis: { lipTone: string; confidence: string; note: string } | null;
  picks: Pick[];
};

const VIBES = [
  { value: "barely-there", label: "Barely there", text: "Your lips, but better" },
  { value: "everyday", label: "Everyday", text: "Soft, defined, wearable" },
  { value: "bold", label: "Bold", text: "A statement lip" },
];

const VEINS = [
  { value: "blue", label: "Blue or purple", text: "Cool undertone" },
  { value: "green", label: "Green or olive", text: "Warm undertone" },
  { value: "both", label: "A mix, hard to tell", text: "Neutral undertone" },
];

const DEPTHS = [
  { value: "fair", label: "Fair" },
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "tan", label: "Tan" },
  { value: "deep", label: "Deep" },
];

/** Downscale a photo in the browser so uploads are small and fast. */
async function downscale(file: File, max = 768): Promise<{ data: string; mediaType: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return { data: canvas.toDataURL("image/jpeg", 0.85), mediaType: "image/jpeg" };
}

export function ShadeFinder({ selfieEnabled }: { selfieEnabled: boolean }) {
  const [mode, setMode] = useState<"selfie" | "quiz">(selfieEnabled ? "selfie" : "quiz");
  const [vibe, setVibe] = useState("everyday");
  const [veins, setVeins] = useState("");
  const [depth, setDepth] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<{ data: string; mediaType: string } | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      const img = await downscale(file);
      imageRef.current = img;
      setPreview(img.data);
      setStatus("idle");
      setMessage("");
    } catch {
      setStatus("error");
      setMessage("We couldn't read that photo. Try another one.");
    }
  }

  async function submit(payload: Record<string, unknown>) {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/shade-match", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = (await res.json()) as Result | { ok: false; message?: string };
      if (json.ok) {
        setResult(json);
        setStatus("done");
        setTimeout(() => document.getElementById("shade-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      } else {
        setStatus("error");
        setMessage(json.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  const quizReady = veins && depth && vibe;

  return (
    <div>
      {/* Mode switch */}
      <div className="mx-auto flex max-w-sm border border-line bg-white p-1" role="tablist" aria-label="How to find your shade">
        {(
          [
            ["selfie", "Use a selfie"],
            ["quiz", "3 quick questions"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 px-4 py-2.5 text-[0.62rem] tracking-luxe uppercase transition-colors",
              mode === m ? "bg-ink text-white" : "text-ink hover:bg-blush",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-2xl border border-line bg-white p-6 md:p-8">
        {/* Vibe: shared by both modes */}
        <fieldset>
          <legend className="mb-3 text-xs tracking-wide2 uppercase">What&rsquo;s the vibe?</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {VIBES.map((v) => (
              <OptionButton key={v.value} active={vibe === v.value} onClick={() => setVibe(v.value)} label={v.label} text={v.text} />
            ))}
          </div>
        </fieldset>

        {mode === "selfie" ? (
          <div className="mt-7">
            {!selfieEnabled && (
              <p className="mb-4 rounded-sm bg-blush px-4 py-3 text-xs text-plum">
                Selfie matching is switching on soon. The three questions work right now.
              </p>
            )}
            <p className="mb-3 text-xs tracking-wide2 uppercase">Your selfie</p>
            <input ref={fileRef} type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={cn(
                "relative flex w-full flex-col items-center justify-center overflow-hidden rounded-sm border-2 border-dashed border-line bg-cream text-center transition-colors hover:border-rose",
                preview ? "aspect-[4/5] max-h-96" : "min-h-44 p-6",
              )}
              aria-label={preview ? "Change photo" : "Add a selfie"}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Your selfie preview" className="h-full w-full object-cover" />
              ) : (
                <>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blush text-rose-deep">
                    <SparkleIcon />
                  </span>
                  <p className="mt-3 font-serif text-xl">Add a selfie</p>
                  <p className="mt-1 max-w-xs text-xs text-plum">Natural daylight, no filter, lips relaxed. Tap to take one or choose from your photos.</p>
                </>
              )}
            </button>
            {preview && (
              <button type="button" onClick={() => fileRef.current?.click()} className="mt-2 text-xs text-plum underline underline-offset-4">
                Use a different photo
              </button>
            )}
            <p className="mt-4 flex items-start gap-2 text-[0.7rem] leading-relaxed text-plum">
              <LockIcon width={14} height={14} className="mt-0.5 shrink-0" />
              Your photo is analyzed instantly and never saved, stored or shared. We look at coloring only.
            </p>
            <button
              type="button"
              disabled={!preview || !selfieEnabled || status === "loading"}
              onClick={() => imageRef.current && submit({ image: imageRef.current.data, mediaType: imageRef.current.mediaType, vibe })}
              className="btn btn-primary mt-5 w-full"
            >
              {status === "loading" ? "Reading your coloring…" : "Find my shade"}
            </button>
          </div>
        ) : (
          <div className="mt-7 space-y-7">
            <fieldset>
              <legend className="mb-1 text-xs tracking-wide2 uppercase">Look at the veins on your inner wrist</legend>
              <p className="mb-3 text-xs text-plum">In daylight, what color do they look?</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {VEINS.map((v) => (
                  <OptionButton key={v.value} active={veins === v.value} onClick={() => setVeins(v.value)} label={v.label} text={v.text} />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-3 text-xs tracking-wide2 uppercase">How would you describe your skin depth?</legend>
              <div className="flex flex-wrap gap-2">
                {DEPTHS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    aria-pressed={depth === d.value}
                    onClick={() => setDepth(d.value)}
                    className={cn(
                      "rounded-sm border px-4 py-2 text-sm transition-colors",
                      depth === d.value ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              disabled={!quizReady || status === "loading"}
              onClick={() => submit({ answers: { veins, depth, vibe } })}
              className="btn btn-primary w-full"
            >
              {status === "loading" ? "Matching…" : "Find my shade"}
            </button>
          </div>
        )}

        {status === "error" && (
          <p role="alert" className="mt-4 rounded-sm bg-danger/10 px-4 py-3 text-sm text-danger">
            {message}
          </p>
        )}
      </div>

      {result && status === "done" && <Results result={result} />}
    </div>
  );
}

function OptionButton({ active, onClick, label, text }: { active: boolean; onClick: () => void; label: string; text: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-sm border px-4 py-3 text-left transition-colors",
        active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
      )}
    >
      <span className="block text-sm font-medium">{label}</span>
      <span className={cn("mt-0.5 block text-xs", active ? "text-white/80" : "text-plum")}>{text}</span>
    </button>
  );
}

function Results({ result }: { result: Result }) {
  const { addItem, isPending } = useCart();
  const [addedAll, setAddedAll] = useState(false);
  const available = result.picks.filter((p) => p.available);
  const total = available.reduce((n, p) => n + Number(p.price.amount), 0);

  async function addAll() {
    for (const p of available) await addItem(p.variantId, 1);
    setAddedAll(true);
  }

  return (
    <section id="shade-results" className="mx-auto mt-12 max-w-4xl scroll-mt-28 animate-fade-up" aria-labelledby="shade-results-heading">
      <div className="text-center">
        <p className="eyebrow">Your match</p>
        <h2 id="shade-results-heading" className="h-display mt-2 text-3xl md:text-4xl">
          {result.headline}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[0.95rem] leading-relaxed text-plum">{result.summary}</p>
        {result.analysis && (
          <p className="mx-auto mt-3 max-w-xl text-xs text-plum">
            We read your natural lip tone as <strong className="text-ink">{result.analysis.lipTone}</strong>. {result.analysis.note}
          </p>
        )}
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {result.picks.map((p) => (
          <li key={p.variantId} className="flex flex-col rounded-sm border border-line bg-white p-4">
            <Link href={`/products/${p.handle}`} className="relative block aspect-[4/5] overflow-hidden rounded-sm" style={{ background: placeholderTint(p.handle) }}>
              {p.image ? (
                <Image src={p.image.url} alt={p.image.altText ?? p.title} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center font-serif text-lg text-ink/70">{p.title}</span>
              )}
              <span className="absolute top-3 left-3 rounded-sm bg-white/90 px-2.5 py-1 text-[0.6rem] tracking-[0.14em] uppercase ring-1 ring-gold">{p.role}</span>
            </Link>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{p.title}</p>
                {p.shade && <p className="text-xs text-plum">Shade: {p.shade}</p>}
              </div>
              <p className="text-sm">{formatMoney(p.price)}</p>
            </div>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-plum">{p.why}</p>
            <button
              type="button"
              disabled={!p.available || isPending}
              onClick={() => addItem(p.variantId, 1)}
              className="btn btn-ghost mt-4 w-full"
            >
              <BagIcon width={16} height={16} /> {p.available ? "Add to bag" : "Sold out"}
            </button>
          </li>
        ))}
      </ul>

      {available.length > 1 && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <button type="button" onClick={addAll} disabled={isPending || addedAll} className={cn("btn", addedAll ? "btn-rose" : "btn-primary")}>
            {addedAll ? (
              <>
                <CheckIcon /> Added to bag
              </>
            ) : (
              <>Add the full look · {formatMoney({ amount: total.toFixed(2), currencyCode: "USD" })}</>
            )}
          </button>
          <p className="text-xs text-plum">Not quite right? Every product page lists all shades.</p>
        </div>
      )}
    </section>
  );
}
