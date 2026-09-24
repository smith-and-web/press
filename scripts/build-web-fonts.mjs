/* Publish the canonical font files for web delivery.
 *
 * Press owns the font files. `design-system/fonts.css` serves the original
 * variable TTFs, which is right for a desktop application bundling its own
 * assets and wrong for a website paying for every byte over the wire. Before
 * this step each web consumer vendored its own WOFF2 from a third-party
 * package (Fontsource), which put a second set of @font-face declarations
 * under the same family names, with narrower axes and no Inter italic.
 *
 * This is the one conversion route, and it makes two web-only reductions,
 * neither of which drops a glyph:
 *
 * 1. The website weight contract. Each face is instanced to the weights the
 *    website and application layers use: Fraunces 500–600, Newsreader and
 *    Inter 400–700 in roman and italic. Fraunces's SOFT and WONK axes are
 *    pinned at their defaults (0 and 1), which is how every surface already
 *    renders them. Optical size is kept whole: `font-optical-sizing: auto` is
 *    in use. A web surface that needs a weight outside the contract changes it
 *    here first; the browser would otherwise clamp or synthesize it.
 * 2. A unicode-range split. Each face publishes a Latin file (Latin-1, Latin
 *    Extended-A, typographic punctuation, arrows, keyboard keys, check marks)
 *    and a Rest file holding every other glyph in the canonical font. Browsers download Rest
 *    only for a page that uses one of its characters, so coverage is
 *    unchanged and a Latin page pays for Latin.
 *
 * Measured on kindlingwriter.com, 24 Sep 2026: the five faces went from
 * 1,363 KiB to 499 KiB (Latin files), and mobile lab LCP fell by 2–3 s on
 * every template, with no visible change to rendered text.
 *
 *   npm run fonts:build    write assets/fonts/web/ and design-system/fonts-web.css
 *   npm run fonts:check    verify both against the current canonical TTFs
 *
 * The manifest records the source TTF digest beside each published digest, so
 * a stale or hand-edited web font is detectable without re-running the encoder.
 * The desktop application's `fonts.css` is unaffected: it keeps every axis and
 * weight of the canonical TTFs.
 */
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import subsetFont from 'subset-font';
import { Blob, Face } from 'harfbuzzjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const digest = (buffer) => createHash('sha256').update(buffer).digest('hex');
const version = async (name) =>
  JSON.parse(await readFile(resolve(root, `node_modules/${name}/package.json`), 'utf8').catch(() => '{"version":"unknown"}')).version;

/* family/style mirror design-system/fonts.css; `weight` is the web contract
   and `axes` instances the font to it. */
const WEB_WEIGHT = { wght: { min: 400, max: 700 } };
const FACES = [
  { family: 'Fraunces', style: 'normal', weight: '500 600', ttf: 'Fraunces[SOFT,WONK,opsz,wght].ttf', web: 'Fraunces', axes: { SOFT: 0, WONK: 1, wght: { min: 500, max: 600 } } },
  { family: 'Newsreader', style: 'normal', weight: '400 700', ttf: 'Newsreader[opsz,wght].ttf', web: 'Newsreader', axes: WEB_WEIGHT },
  { family: 'Newsreader', style: 'italic', weight: '400 700', ttf: 'Newsreader-Italic[opsz,wght].ttf', web: 'Newsreader-Italic', axes: WEB_WEIGHT },
  { family: 'Inter', style: 'normal', weight: '400 700', ttf: 'Inter[opsz,wght].ttf', web: 'Inter', axes: WEB_WEIGHT },
  { family: 'Inter', style: 'italic', weight: '400 700', ttf: 'Inter-Italic[opsz,wght].ttf', web: 'Inter-Italic', axes: WEB_WEIGHT },
];

/* The Latin file. Chosen from the characters Press surfaces actually set, not
   from a stock "latin" range: the stock range omits U+2192, and one "→" on a
   page would pull the Rest file. */
const LATIN = [
  [0x0000, 0x017f], // Basic Latin, Latin-1, Latin Extended-A
  [0x0192, 0x0192], [0x02bb, 0x02bc], [0x02c6, 0x02c6], [0x02da, 0x02da], [0x02dc, 0x02dc],
  [0x0304, 0x0304], [0x0308, 0x0308], [0x0329, 0x0329],
  [0x2000, 0x206f], // general punctuation: dashes, quotes, ellipsis
  [0x20ac, 0x20ac], [0x2116, 0x2116], [0x2122, 0x2122],
  [0x2190, 0x21ff], // arrows, including ⇧ ⇥ ↩
  [0x2303, 0x2303], [0x2318, 0x2318], [0x2325, 0x2326], [0x232b, 0x232b], [0x238b, 0x238b], [0x23ce, 0x23cf], // keyboard keys: ⌃ ⌘ ⌥ ⌦ ⌫ ⎋ ⏎ ⏏
  [0x2212, 0x2212], [0x2215, 0x2215], [0x22ef, 0x22ef],
  [0x2713, 0x2713], [0x2717, 0x2717], // check mark, ballot x
  [0xfeff, 0xfeff], [0xfffd, 0xfffd],
];
const inLatin = (cp) => LATIN.some(([from, to]) => cp >= from && cp <= to);

const hex = (cp) => cp.toString(16).toUpperCase().padStart(4, '0');
const ranges = (codepoints) => {
  const out = [];
  for (const cp of codepoints) {
    const last = out.at(-1);
    if (last && cp === last[1] + 1) last[1] = cp; else out.push([cp, cp]);
  }
  return out.map(([from, to]) => (from === to ? `U+${hex(from)}` : `U+${hex(from)}-${hex(to)}`)).join(', ');
};

const header = '/* Generated by scripts/build-web-fonts.mjs from the canonical TTFs in\n' +
  '   assets/fonts/. The same five faces as fonts.css, in WOFF2, instanced to the\n' +
  '   website weight contract and split by unicode-range into Latin and Rest files\n' +
  '   (no glyph is dropped). Preserve the adjacent licenses in distributions.\n' +
  '   Do not hand-edit; run `npm run fonts:build`. */\n';

await mkdir(resolve(root, 'assets/fonts/web'), { recursive: true });
const records = [];
const rules = [];
const stale = [];

for (const face of FACES) {
  const ttf = await readFile(resolve(root, 'assets/fonts', face.ttf));
  const all = [...new Face(new Blob(ttf), 0).collectUnicodes()].sort((a, b) => a - b);
  const parts = [
    { part: 'Latin', codepoints: all.filter(inLatin) },
    { part: 'Rest', codepoints: all.filter((cp) => !inLatin(cp)) },
  ];
  for (const { part, codepoints } of parts) {
    const woff2 = Buffer.from(await subsetFont(ttf, String.fromCodePoint(...codepoints), {
      targetFormat: 'woff2',
      variationAxes: face.axes,
    }));
    const file = `${face.web}-${part}.woff2`;
    /* Latin declares its whole designed range; Rest declares exactly the
       code points it carries, so the two never overlap. */
    const range = part === 'Latin'
      ? LATIN.map(([from, to]) => (from === to ? `U+${hex(from)}` : `U+${hex(from)}-${hex(to)}`)).join(', ')
      : ranges(codepoints);
    rules.push(`@font-face {
  font-family: '${face.family}'; font-style: ${face.style}; font-weight: ${face.weight}; font-display: swap;
  src: url('../assets/fonts/web/${file}') format('woff2');
  unicode-range: ${range};
}`);
    const record = {
      family: face.family,
      style: face.style,
      weight: face.weight,
      part,
      axes: face.axes,
      glyphs: codepoints.length,
      source: `assets/fonts/${face.ttf}`,
      sourceSha256: digest(ttf),
      sourceBytes: ttf.length,
      published: `assets/fonts/web/${file}`,
      sha256: digest(woff2),
      bytes: woff2.length,
    };
    records.push(record);
    const target = resolve(root, 'assets/fonts/web', file);
    if (check) {
      const current = await readFile(target).catch(() => null);
      if (!current || digest(current) !== record.sha256) stale.push(record.published);
    } else {
      await writeFile(target, woff2);
      console.log(`${record.published}  ${(woff2.length / 1024).toFixed(0)}K, ${codepoints.length} code points`);
    }
  }
}

/* Files this script no longer publishes (the pre-0.14 full-coverage WOFF2s). */
const published = new Set(records.map((r) => r.published.split('/').pop()));
for (const name of await readdir(resolve(root, 'assets/fonts/web'))) {
  if (!name.endsWith('.woff2') || published.has(name)) continue;
  if (check) stale.push(`assets/fonts/web/${name} (no longer published)`);
  else { await unlink(resolve(root, 'assets/fonts/web', name)); console.log(`removed assets/fonts/web/${name}`); }
}

const stylesheet = header + rules.join('\n') + '\n';
const manifest = JSON.stringify({
  generator: 'scripts/build-web-fonts.mjs',
  encoder: `subset-font@${await version('subset-font')} (harfbuzzjs@${await version('harfbuzzjs')})`,
  note: 'WOFF2 of the canonical TTFs, instanced to the website weight contract and split into Latin and Rest files by unicode-range. Every glyph in the canonical fonts is in exactly one file.',
  stylesheet: 'design-system/fonts-web.css',
  faces: records,
}, null, 2) + '\n';

for (const [path, contents] of [['assets/fonts/web/MANIFEST.json', manifest], ['design-system/fonts-web.css', stylesheet]]) {
  const target = resolve(root, path);
  if (check) {
    const current = await readFile(target, 'utf8').catch(() => null);
    /* The encoder version line is environment-reported; compare the faces only. */
    const strip = (text) => text.replace(/^\s*"encoder":.*$/m, '');
    if (current === null || strip(current) !== strip(contents)) stale.push(path);
  } else {
    await writeFile(target, contents);
    console.log(`wrote ${path}`);
  }
}

if (check) {
  if (stale.length) {
    console.error(`Stale web fonts; run \`npm run fonts:build\`:\n  ${stale.join('\n  ')}`);
    process.exit(1);
  }
  console.log(`Web fonts match the canonical TTFs (${FACES.length} faces, ${records.length} files).`);
}
