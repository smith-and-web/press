#!/usr/bin/env python3
"""
Kindling raster build — rasterises the canonical svg/ set into shippable PNGs, favicons,
app-icon masters, and social/OG cards.

Deterministic and mechanical: every output derives from svg/ (which derives from the source
mark). Nothing here is hand-tuned geometry — only sizes, paddings, and background tiles.

Deps (both in the venv): cairosvg (SVG->PNG) + Pillow (.ico, compositing). No ImageMagick.
Install Cairo using your platform's package manager for maintenance builds.
Outputs: favicon/ app-icons/ social/ png/. Existing outputs are bundled.
macOS iconutil is optional; when absent, PNGs and iconset still generate and
an existing .icns remains untouched. No consumer repository is required.
"""
import os, io, json, shutil, subprocess
from token_values import color
import cairosvg
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SVG  = os.path.join(HERE, "svg")

# backgrounds (mirror tokens.css)
PAPER, PAPER_D = color("paper"), color("paper-dark")
THEME = color("terracotta")

def _svg(name): return os.path.join(SVG, name)
def ensure(d):
    p = os.path.join(HERE, d); os.makedirs(p, exist_ok=True); return p

def render(name, out, w=None, h=None, bg=None):
    """Rasterise an svg/ file straight to disk."""
    cairosvg.svg2png(url=_svg(name), write_to=out, output_width=w, output_height=h, background_color=bg)

def render_img(name, w=None, h=None, bg=None):
    """Rasterise to an in-memory RGBA image (for compositing)."""
    png = cairosvg.svg2png(url=_svg(name), output_width=w, output_height=h, background_color=bg)
    return Image.open(io.BytesIO(png)).convert("RGBA")

def tile(fg_img, size, bg_hex):
    """Centre an RGBA image on a square (or w,h) solid tile."""
    W, H = (size, size) if isinstance(size, int) else size
    canvas = Image.new("RGBA", (W, H), bg_hex)
    canvas.alpha_composite(fg_img, ((W - fg_img.width) // 2, (H - fg_img.height) // 2))
    return canvas

# ── Step 2 — web favicons ──────────────────────────────────────────────────
def favicons():
    d = ensure("favicon")
    shutil.copyfile(_svg("kindling-favicon.svg"), os.path.join(d, "favicon.svg"))
    for s in (16, 32, 48):
        render("kindling-favicon.svg", os.path.join(d, f"favicon-{s}.png"), s, s)   # transparent
    # multi-resolution .ico from one crisp 256px render (Pillow downsamples, Lanczos)
    render_img("kindling-favicon.svg", 256, 256).save(
        os.path.join(d, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    render("kindling-favicon.svg", os.path.join(d, "apple-touch-icon.png"), 180, 180, PAPER)
    render("kindling-favicon.svg", os.path.join(d, "icon-192.png"), 192, 192, PAPER)
    render("kindling-favicon.svg", os.path.join(d, "icon-512.png"), 512, 512, PAPER)
    manifest = {
        "name": "Kindling", "short_name": "Kindling",
        "icons": [
            {"src": "icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "icon-512.png", "sizes": "512x512", "type": "image/png"},
        ],
        "theme_color": THEME, "background_color": PAPER, "display": "standalone",
    }
    with open(os.path.join(d, "site.webmanifest"), "w") as f:
        json.dump(manifest, f, indent=2); f.write("\n")
    return d

# ── Step 3 — app-icon master + standalone .icns ────────────────────────────
ICONSET = {  # macOS iconset filename -> pixel size
    "icon_16x16.png": 16,   "icon_16x16@2x.png": 32,
    "icon_32x32.png": 32,   "icon_32x32@2x.png": 64,
    "icon_128x128.png": 128, "icon_128x128@2x.png": 256,
    "icon_256x256.png": 256, "icon_256x256@2x.png": 512,
    "icon_512x512.png": 512, "icon_512x512@2x.png": 1024,
}
def app_icons():
    d = ensure("app-icons")
    # 1024² master for `tauri icon` (flame on a paper tile)
    render("kindling-favicon.svg", os.path.join(d, "app-icon-1024.png"), 1024, 1024, PAPER)
    # standalone .icns, no Tauri needed
    iset = os.path.join(d, "kindling.iconset"); os.makedirs(iset, exist_ok=True)
    for fname, s in ICONSET.items():
        render("kindling-favicon.svg", os.path.join(iset, fname), s, s, PAPER)
    if shutil.which("iconutil"):
        subprocess.run(["iconutil", "-c", "icns", "-o", os.path.join(d, "kindling.icns"), iset], check=True)
    else:
        print("iconutil unavailable: .icns not rebuilt; existing file retained.")
    return d

# ── Step 4 — social + OG ────────────────────────────────────────────────────
def social():
    d = ensure("social")
    # OG / share card 1200×630: lockup fit to ~490px tall, centred on paper
    og = tile(render_img("kindling-lockup-stacked.svg", h=490), (1200, 630), PAPER)
    og.convert("RGB").save(os.path.join(d, "og-image.png"))
    # square avatars — emblem centred on a paper tile (fixes the non-square recipe)
    tile(render_img("kindling-mark.svg", w=660), 800, PAPER).convert("RGB").save(
        os.path.join(d, "avatar-light-800.png"))
    tile(render_img("kindling-mark-reversed.svg", w=660), 800, PAPER_D).convert("RGB").save(
        os.path.join(d, "avatar-dark-800.png"))
    # pure-flame avatars (tightest square identity)
    render("kindling-favicon.svg", os.path.join(d, "avatar-flame-light-800.png"), 800, 800, PAPER)
    render("kindling-favicon-reversed.svg", os.path.join(d, "avatar-flame-dark-800.png"), 800, 800, PAPER_D)
    return d

# ── Step 5 — PNG exports for docs/README ────────────────────────────────────
def png_exports():
    d = ensure("png")
    for w in (240, 480, 960):
        render("kindling-lockup-stacked.svg", os.path.join(d, f"lockup-{w}.png"), w)   # transparent
        render("kindling-mark.svg", os.path.join(d, f"mark-{w}.png"), w)               # transparent
    return d

def build():
    for fn in (favicons, app_icons, social, png_exports):
        d = fn()
        files = sorted(f for f in os.listdir(d) if not f.startswith("."))
        print(f"{os.path.basename(d)+'/':12} {len(files):2} files: {', '.join(files)}")

if __name__ == "__main__":
    build()
