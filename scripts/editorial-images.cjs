/* eslint-disable */
// Downloads the licensed Pexels editorial placeholders and writes optimized WebP.
// Pexels license: free for commercial use, no attribution required. See public/editorial/CREDITS.md
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const out = path.join(process.cwd(), "public/editorial");
const D = process.env.CACHE || "/tmp/pexels-cache";
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(D, { recursive: true });

const set = [
  { id: "28112154", name: "hero", w: 2600, ratio: null, alt: "Lip gloss applied to glossy lips with a wand" },
  { id: "14438174", name: "cat-lips", w: 1400, ratio: 3 / 4, alt: "A pink lip gloss wand applied to soft pink lips" },
  { id: "6659420", name: "cat-lip-care", w: 1400, ratio: 3 / 4, alt: "Natural glossy lips on glowing skin" },
  { id: "34299108", name: "cat-glow", w: 1400, ratio: 3 / 4, alt: "Luminous skin catching golden light" },
  { id: "7256136", name: "cat-sets", w: 1400, ratio: 3 / 4, alt: "Lip liner and lipsticks arranged on blush pink" },
  { id: "8793887", name: "silk", w: 2600, ratio: null, alt: "Soft blush silk folds" },
  { id: "28112154", name: "ritual", w: 1600, ratio: 4 / 5, alt: "Lip gloss applied to glossy lips" },
  { id: "4938200", name: "swatches", w: 2600, ratio: null, alt: "Lip color swatches on an arm" },
  { id: "16150431", name: "about", w: 1600, ratio: 4 / 5, alt: "Model in a pink dress with a soft pink eye" },
  { id: "32272839", name: "lips-wide", w: 2600, ratio: null, alt: "Peach lip oil applied to glossy lips" },
];

async function fetchTo(id) {
  const f = path.join(D, `${id}.jpg`);
  if (fs.existsSync(f)) return f;
  const r = await fetch(`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2600`);
  if (!r.ok) throw new Error(`fetch ${id} ${r.status}`);
  fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
  return f;
}

(async () => {
  const credits = ["# Editorial placeholder photography", "", "Source: Pexels (https://www.pexels.com/license/). Free for commercial use, no attribution required.", "Replace each file with the client's own photoshoot image of the same name and orientation.", ""];
  for (const s of set) {
    const f = await fetchTo(s.id);
    let img = sharp(f).rotate();
    const m = await img.metadata();
    if (s.ratio) {
      const w = Math.min(s.w, m.width);
      img = img.resize(w, Math.round(w / s.ratio), { fit: "cover", position: "attention" });
    } else {
      img = img.resize({ width: Math.min(s.w, m.width) });
    }
    await img.clone().webp({ quality: 80 }).toFile(path.join(out, `${s.name}.webp`));
    credits.push(`- ${s.name}.webp — https://www.pexels.com/photo/${s.id}/ — alt: "${s.alt}"`);
    console.log("ok", s.name);
  }
  // mobile hero: portrait crop of the same shot
  const hero = await fetchTo("7290085");
  await sharp(hero).rotate().resize(1200, 1600, { fit: "cover", position: "centre" }).webp({ quality: 80 }).toFile(path.join(out, "hero-portrait.webp"));
  credits.push(`- hero-portrait.webp — same as hero.webp, portrait crop for phones`);
  fs.writeFileSync(path.join(out, "CREDITS.md"), credits.join("\n") + "\n");
  console.log("credits written");
})();
