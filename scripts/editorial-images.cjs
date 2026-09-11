/* eslint-disable */
// Downloads the licensed Pexels editorial placeholders and writes optimized WebP.
// Pexels license: free for commercial use, no attribution required. See public/editorial/CREDITS.md
// Every slot uses a different photograph.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const out = path.join(process.cwd(), "public/editorial");
const D = process.env.CACHE || "/tmp/pexels-cache";
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(D, { recursive: true });

const set = [
  // home
  { id: "28112154", name: "hero", w: 2600, ratio: null, alt: "Lip gloss applied to glossy lips with a wand" },
  { id: "14438174", name: "cat-lips", w: 1400, ratio: 3 / 4, alt: "A pink lip gloss wand applied to soft pink lips" },
  { id: "6659420", name: "cat-lip-care", w: 1400, ratio: 3 / 4, alt: "Natural glossy lips on glowing skin" },
  { id: "12698452", name: "cat-glow", w: 1400, ratio: 3 / 4, alt: "Radiant highlighted skin and glossy red lips in golden light" },
  { id: "7256136", name: "cat-sets", w: 1400, ratio: 3 / 4, alt: "Lip liner and lipsticks arranged on blush pink" },
  { id: "8793887", name: "silk", w: 2600, ratio: null, alt: "Soft blush silk folds" },
  { id: "7956636", name: "silk-pink", w: 2000, ratio: null, alt: "Pink satin folds" },
  { id: "8793882", name: "silk-pale", w: 1600, ratio: null, alt: "Pale blush silk" },
  { id: "36537440", name: "ritual", w: 1600, ratio: 4 / 5, alt: "A woman applying lip gloss with a wand" },
  { id: "4938200", name: "swatches", w: 2600, ratio: null, alt: "Lip color swatches on an arm" },
  // collection banners
  { id: "7290085", name: "banner-shop", w: 2600, ratio: null, alt: "Glossy peach lips being painted with a lip brush" },
  { id: "32272839", name: "banner-lips", w: 2600, ratio: null, alt: "Peach lip oil applied to glossy lips" },
  { id: "7298660", name: "banner-lip-care", w: 2600, ratio: null, alt: "Natural lips on deep, glowing skin" },
  { id: "6651667", name: "banner-glow", w: 2600, ratio: null, alt: "Collarbone and shoulder dusted with shimmer" },
  { id: "7256137", name: "banner-sets", w: 2600, ratio: null, alt: "Lip liner, lipsticks and a dried sprig on blush pink" },
  { id: "8092952", name: "banner-bestsellers", w: 2600, ratio: null, alt: "Magenta lips in soft light" },
  // pages
  { id: "16150431", name: "about", w: 1600, ratio: 4 / 5, alt: "Model in a pink dress with a soft pink eye" },
  { id: "8128700", name: "shade-page", w: 2600, ratio: null, alt: "Lip color swatches on the back of a hand" },
  // instagram grid (square)
  { id: "11540032", name: "ig-1", w: 1000, ratio: 1, alt: "Lips with lilac glitter" },
  { id: "3912572", name: "ig-2", w: 1000, ratio: 1, alt: "Glowing skin with a rose eye look" },
  { id: "30863545", name: "ig-3", w: 1000, ratio: 1, alt: "Glossy red lips" },
];

async function fetchTo(id) {
  const f = path.join(D, `${id}-big.jpg`);
  if (fs.existsSync(f)) return f;
  const r = await fetch(`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2600`);
  if (!r.ok) throw new Error(`fetch ${id} ${r.status}`);
  fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
  return f;
}

(async () => {
  for (const f of fs.readdirSync(out)) if (f.endsWith(".webp")) fs.unlinkSync(path.join(out, f));
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
    await img.webp({ quality: 78 }).toFile(path.join(out, `${s.name}.webp`));
    credits.push(`- ${s.name}.webp — https://www.pexels.com/photo/${s.id}/ — alt: "${s.alt}"`);
    console.log("ok", s.name);
  }
  // phone hero: portrait crop of the hero shot, lips in the upper third
  const hero = await fetchTo("28112154");
  const hm = await sharp(hero).rotate().metadata();
  const pw = Math.round(hm.width * 0.78), ph = Math.round((pw * 4) / 3);
  await sharp(hero).rotate().extract({ left: Math.round((hm.width - pw) * 0.55), top: Math.round((hm.height - ph) * 0.25), width: pw, height: ph }).resize(1200, 1600).webp({ quality: 80 }).toFile(path.join(out, "hero-portrait.webp"));
  credits.push(`- hero-portrait.webp — same as hero.webp, portrait crop for phones`);
  fs.writeFileSync(path.join(out, "CREDITS.md"), credits.join("\n") + "\n");
  console.log("credits written");
})();
