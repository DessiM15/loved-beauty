/* eslint-disable */
// V2 "after dark" editorial placeholders. Pexels license (commercial, no attribution). Distinct from the light set.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const out = path.join(process.cwd(), "public/noir");
const D = process.env.CACHE || "/tmp/pexels-cache";
fs.mkdirSync(out, { recursive: true });

const set = [
  { id: "31141638", name: "cat-lips", w: 1400, ratio: 3 / 4, alt: "Gloss applied to lips in low light" },
  { id: "6108724", name: "cat-lip-care", w: 1400, ratio: 3 / 4, alt: "Red lips behind a rain-streaked window" },
  { id: "10755003", name: "cat-glow", w: 1400, ratio: 3 / 4, alt: "Gold-dusted hands framing a face in shadow" },
  { id: "12969218", name: "cat-sets", w: 1400, ratio: 3 / 4, alt: "Red lip products on dark marble" },
  { id: "7676886", name: "satin", w: 2600, ratio: null, alt: "Black satin folds" },
  { id: "6843237", name: "satin-2", w: 2000, ratio: null, alt: "Dark charcoal satin" },
  { id: "21926656", name: "satin-3", w: 1600, ratio: null, alt: "Black silk" },
  { id: "29185844", name: "ritual", w: 1600, ratio: 4 / 5, alt: "A woman applying red gloss in shadow" },
  { id: "2250619", name: "swatches", w: 2600, ratio: null, alt: "Gold glitter freckles on skin" },
  { id: "20630309", name: "banner-shop", w: 2600, ratio: null, alt: "Dark hair blowing across red lips" },
  { id: "13847742", name: "banner-lips", w: 2600, ratio: null, alt: "Applying red lip liner in low light" },
  { id: "12614835", name: "banner-lip-care", w: 2600, ratio: null, alt: "Coral lips framed by dark curls" },
  { id: "7693585", name: "banner-glow", w: 2600, ratio: null, alt: "A back dusted in gold shimmer" },
  { id: "4938514", name: "banner-sets", w: 2600, ratio: null, alt: "Makeup flat lay on black" },
  { id: "10896330", name: "banner-bestsellers", w: 2600, ratio: null, alt: "Red lips, eyes closed, red coat" },
  { id: "26790920", name: "about", w: 1600, ratio: 4 / 5, alt: "Model in a coral dress against black" },
  { id: "7248766", name: "shade-page", w: 2600, ratio: null, alt: "Gold glitter" },
  { id: "11027344", name: "ig-1", w: 1000, ratio: 1, alt: "Purple glitter on skin in shadow" },
  { id: "7693361", name: "ig-2", w: 1000, ratio: 1, alt: "A gold-dusted hand reaching into light" },
  { id: "12642408", name: "ig-3", w: 1000, ratio: 1, alt: "Gold-painted skin catching light" },
];

async function fetchTo(id) {
  const f = path.join(D, `${id}-big.jpg`);
  if (fs.existsSync(f)) return f;
  const r = await fetch(`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2600`);
  if (!r.ok) throw new Error(`fetch ${id} ${r.status}`);
  fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
  return f;
}

async function heroCutout() {
  const f = await fetchTo("4355977");
  const { data, info } = await sharp(f).rotate().resize({ width: 2000 }).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const px = (x, y) => (y * W + x) * C;
  const mask = new Uint8Array(W * H);
  const stack = [];
  const isBg = (i) => Math.max(data[i], data[i + 1], data[i + 2]) < 34;
  for (let x = 0; x < W; x++) stack.push(x, 0, x, H - 1);
  for (let y = 0; y < H; y++) stack.push(0, y, W - 1, y);
  while (stack.length) {
    const y = stack.pop(), x = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const k = y * W + x;
    if (mask[k] || !isBg(px(x, y))) continue;
    mask[k] = 1;
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }
  const alpha = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) alpha[i] = mask[i] ? 0 : 255;
  const feathered = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } }).blur(1.6).toColourspace("b-w").raw().toBuffer();
  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    rgba[i * 4] = data[i * C]; rgba[i * 4 + 1] = data[i * C + 1]; rgba[i * 4 + 2] = data[i * C + 2]; rgba[i * 4 + 3] = feathered[i];
  }
  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 84, alphaQuality: 92 }).toFile(path.join(out, "hero-model.webp"));
  // also the flat photo for phones (portrait crop, face upper third)
  const m = await sharp(f).rotate().metadata();
  const ph = m.height, pw = Math.round(ph * 3 / 4);
  await sharp(f).rotate().extract({ left: Math.round((m.width - pw) * 0.42), top: 0, width: pw, height: ph }).resize(1200, 1600).webp({ quality: 80 }).toFile(path.join(out, "hero-portrait.webp"));
  console.log("hero cutout", W, H);
}

(async () => {
  for (const f of fs.readdirSync(out)) if (f.endsWith(".webp")) fs.unlinkSync(path.join(out, f));
  const credits = ["# V2 (after dark) editorial placeholder photography", "", "Source: Pexels (https://www.pexels.com/license/). Free for commercial use, no attribution required.", "", "- hero-model.webp / hero-portrait.webp — https://www.pexels.com/photo/4355977/ — model in profile with a braided wire, black studio background"];
  await heroCutout();
  for (const s of set) {
    const f = await fetchTo(s.id);
    let img = sharp(f).rotate();
    const m = await img.metadata();
    if (s.ratio) {
      const w = Math.min(s.w, m.width);
      img = img.resize(w, Math.round(w / s.ratio), { fit: "cover", position: "attention" });
    } else img = img.resize({ width: Math.min(s.w, m.width) });
    await img.webp({ quality: 78 }).toFile(path.join(out, `${s.name}.webp`));
    credits.push(`- ${s.name}.webp — https://www.pexels.com/photo/${s.id}/ — alt: "${s.alt}"`);
    console.log("ok", s.name);
  }
  fs.writeFileSync(path.join(out, "CREDITS.md"), credits.join("\n") + "\n");
})();
