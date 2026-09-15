> Maintained here in Press. The sibling `brand-assets` folder is historical input. For current cross-surface rules read [DESIGN.md](../DESIGN.md). Use [the visual asset reference](../preview/brand-assets.html) to choose a variant. Leave at least one quarter of the emblem height as clear space around a standalone signature.

# kindling brand assets in Press

The brand name is always lowercase, including at the beginning of a sentence. The outlined wordmark spells `kindling`; regenerate from `WM_TEXT = "kindling"` and never uppercase it in layout CSS.

Original logo and brand assets maintained by Press for kindling (the local-first fiction-writing app). Every asset derives from one flat source SVG plus the Fraunces variable font, assembled by a deterministic build script. **Do not hand-edit the generated SVGs** — change the source or the build script and re-run.

## What this is used for

- **App**: window/dock/taskbar icons (Tauri), about screen, splash.
- **Website** (`kindlingwriter.com`): favicon, header lockup, social/OG share image.
- **Repo/GitHub**: README lockup, social preview, org avatar.
- **Social**: profile avatars and share cards across the accounts.

---

## Directory layout

```
assets/
├── README.md                 ← this file
├── requirements.txt          ← maintenance dependencies (fonttools + cairosvg + Pillow)
├── build_assets.py           ← Step 1: source → svg/           (deterministic, mechanical)
├── build_rasters.py          ← Step 2: svg/ → PNG/ico/icns/OG  (deterministic, mechanical)
├── source/
│   └── kindling-source.svg   ← THE final mark: 2-page book + two-tone flame, flat paths
├── fonts/                    ← Fraunces variable TTF (bundled locally; never downloaded by the build)
├── svg/                      ← generated canonical SVGs   (build_assets.py)
├── favicon/                  ← web favicons + manifest     (build_rasters.py)
├── app-icons/                ← 1024² master + .icns/.iconset (build_rasters.py)
├── social/                   ← OG card + square avatars     (build_rasters.py)
└── png/                      ← lockup/mark PNG exports      (build_rasters.py)
```

---

## Step 1 — build the SVGs

The `svg/` folder starts empty. The build runs in an isolated **uv venv** (`.venv/`) so it never touches system Python. Populate it:

```bash
cd /path/to/press/assets
uv venv                                 # create .venv (first time only; Python 3.12)
uv pip install -r requirements.txt      # fonttools (SVG build), cairosvg and Pillow (raster steps)
.venv/bin/python build_assets.py        # uses bundled Fraunces, writes 11 SVGs to svg/
```

> Dependencies are listed in `requirements.txt` but are not pinned; record the maintenance environment when rebuilding. Activate the env with `source .venv/bin/activate` if you'd rather run `python build_assets.py` directly.

The build is **purely mechanical**: it recolours the source mark into light/dark/mono variants, composes the stacked lockup with the outlined wordmark, and extracts the flame for the favicon. No source mark geometry is redrawn — the mark you see in `source/` is exactly the mark that ships. It produces, in `svg/`:

| File | What it is | Use it for |
|---|---|---|
| `kindling-lockup-stacked.svg` | **Primary signature** — emblem over wordmark, colour | Default brand mark: site header, README, share cards |
| `kindling-lockup-stacked-reversed.svg` | Stacked lockup, on dark | Dark backgrounds |
| `kindling-lockup-stacked-mono.svg` | Stacked lockup, one colour | Print, engraving, low-contrast |
| `kindling-mark.svg` | Emblem alone (book + flame), colour | Avatars, app tiles, tight/square contexts |
| `kindling-mark-reversed.svg` | Emblem, on dark | " on dark |
| `kindling-mark-mono.svg` / `-mono-reversed.svg` | Emblem, one colour | Single-colour placements |
| `kindling-wordmark.svg` / `-reversed.svg` | "kindling" outlined in Fraunces | Text-only lockups, footers |
| `kindling-favicon.svg` / `-reversed.svg` | **Flame only**, centred in a square | Favicon + app-icon source; the icon identity |

---

## Design system

> The full Press specification — colour, typography, composition, named devices, the
> hard rules and the banlist — lives in **`../DESIGN.md`**. What follows
> is only the subset the logo build needs; the guide is authoritative.

**Colours** — these mirror `../design-system/tokens.css`, which is the source of truth for the whole brand. The builders read these values through `token_values.py`; never free-hand a new output hex.

| Role | Light | Dark |
|---|---|---|
| Ink (book + wordmark) | `#231D18` | `#E8E0D4` |
| Paper (background) | `#F4EFE6` | `#1E1A16` |
| Flame — main (terracotta) | `#B5532E` | `#E08A5C` |
| Flame — inner (ember) | `#E0612C` | `#F0A878` |

The book and wordmark use the **ink** role, so the reversed/dark variants are just ink resolving lighter — the mark tracks the app's light/dark modes automatically.

**Type** (brand-wide, for reference; not needed to build these assets):
- Display: **Fraunces** (variable) — the wordmark is this, outlined at `opsz 144, wght 540, SOFT 16, WONK 0`.
- Body: **Newsreader**. UI: **Inter**. All OFL.

**Sizing rules** (enforce wherever the mark is placed):
- **Stacked lockup**: ≥ 140px wide, or the wordmark stops being legible → drop to the emblem alone.
- **Emblem**: holds to ~40px; floor 32px.
- **Below ~32px**: use the flame favicon only (solid down to 16px).

---

## Maintenance rules

- **The mark lives in `source/kindling-source.svg`.** It is the final geometry — two pages a side, flame enlarged — as flat paths. To change the logo, replace this file with a new export (keep the same colours: book/baseline `#231D18`, flame `#B5532E` main + `#E0612C` inner; those hexes are how the build tells book from flame) and re-run the build.
- **Colours are locked to `../design-system/tokens.css`.** If the palette changes there, re-run the builders, which resolve colors through `token_values.py`. Don't edit hexes in the generated SVGs directly.
- **The build settings** are the canonical token palette, plus `LOCK_WT`/`LOCK_GAP` (wordmark width and gap in the stacked lockup), and `WM_AXES` (the Fraunces variable-font axes the wordmark is outlined at). Everything else is derived from the source.
- **The wordmark is outlined Fraunces**, not a font reference — it renders identically everywhere with no font installed. Change `WM_AXES` and re-run to re-cut it; the lockups pick up the new wordmark automatically.
- **The flame favicon is unaffected by the mark's layout** — the build extracts the flame paths and fits them to a square on their own, so it stays correct even if the book or the mark's framing changes.

> **On the source geometry:** the mark is the fanning book with the *top* page pair dropped (two pages a side, for clarity and small-size legibility) and the flame scaled ~9% about its base so it reads as the hero and stays seated on the spine. Those were deliberate design decisions, now baked into the flat source rather than applied at build time — so what's in `source/` is what ships. The original three-page Figma export lives in git history if you ever need to revisit them.

---

## Step 2 — build the rasters

The SVGs are the source of truth; every raster is derived from `svg/` by `build_rasters.py` (cairosvg + Pillow — no ImageMagick). One command regenerates `favicon/`, `app-icons/`, `social/`, and `png/`:

```bash
brew install cairo                      # one-time: SVG→PNG backend for cairosvg (already installed)
DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib .venv/bin/python build_rasters.py
```

> **cairo + venv gotcha:** the uv-managed Python won't find Homebrew's cairo via dlopen, so the `DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib` prefix (or `export`-ing it once per shell) is required for anything that imports cairosvg. Everything else — `.ico`, `.icns`, OG compositing — is done with Pillow, which is pure-venv.

What it produces:

| Folder | Files | Notes |
|---|---|---|
| `favicon/` | `favicon.svg`, `favicon-{16,32,48}.png` (transparent), `favicon.ico` (16/32/48), `apple-touch-icon.png` (180, paper), `icon-{192,512}.png` (paper), `site.webmanifest` | manifest: name "kindling", `theme_color` `#B5532E`, `background_color` `#F4EFE6` |
| `app-icons/` | `app-icon-1024.png` (flame on paper), `kindling.icns`, `kindling.iconset/` | `.icns` is standalone (16→1024 @1x/@2x via `iconutil`) |
| `social/` | `og-image.png` (1200×630), `avatar-{light,dark}-800.png` (emblem), `avatar-flame-{light,dark}-800.png` | avatars are true 800² tiles (emblem centred) |
| `png/` | `lockup-{240,480,960}.png`, `mark-{240,480,960}.png` | transparent; for dark backgrounds use the `-reversed` SVGs instead |

**Tauri app icons** are the one step this repo can't run itself — from the *app* repo, point Tauri at the master to overwrite `src-tauri/icons/` with the full platform set:
```bash
npm run tauri icon /path/to/press/assets/app-icons/app-icon-1024.png    # or: cargo tauri icon <path>
```
Review the dock/taskbar result — if the flame feels tight, increase the tile padding (the favicon SVG is currently ~12.5% pad) and rebuild before re-running. The macOS dock does **not** auto-round icons, so the current master is a hard-edged paper square; switch to a rounded-rect tile if you want it to match native squircle icons.

(For web, RealFaviconGenerator with `kindling-favicon.svg` produces the same set plus edge-case tiles if you'd rather use a hosted service.)

---

## Provenance

- The mark (`source/kindling-source.svg`) was built in Figma — a fanning open book with a two-tone flame rising through it — then finalised to two pages a side with the flame scaled ~9%, and flattened to plain paths. The flame is the original kindling flame, recolored to the brand palette.
- Wordmark: Fraunces (OFL, undercasetype/Fraunces), outlined at the axes above.
- A visual review page of the full package was produced in the design session (it embeds every variant and the size/lockup rationale). It's large and lives in that chat rather than here; regenerate a lightweight `index.html` from `svg/` if you want a local contact sheet.
