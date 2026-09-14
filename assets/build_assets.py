#!/usr/bin/env python3
"""
Kindling brand-asset build — regenerates the canonical SVG set.

Source of truth:
  source/kindling-source.svg   THE final mark: 2-page book + two-tone flame, as flat paths
  fonts/Fraunces[...].ttf       bundled variable font, outlined for the wordmark

Output: svg/  (11 canonical SVGs)

This build is purely mechanical: it recolours the mark into variants, composes the
stacked lockup with the outlined wordmark, and extracts the flame for the favicon.
All design geometry lives in the source SVG — nothing is transformed here.

Dependency: fonttools   ->  pip install fonttools
"""
import os, re
from token_values import color

HERE = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(HERE, "source", "kindling-source.svg")
SVG  = os.path.join(HERE, "svg")
FONT = os.path.join(HERE, "fonts", "Fraunces[SOFT,WONK,opsz,wght].ttf")

# brand colours (mirror of tokens.css — keep in sync, do not free-hand)
INK,TERRA,EMBER      = color("ink"),color("terracotta"),color("ember")          # light mode
INK_D,FLAME_D,EMBER_D= color("ink-dark"),color("flame-dark"),color("ember-dark")          # dark mode

# stacked-lockup layout (wordmark width + gap beneath the book)
LOCK_WT, LOCK_GAP = 540.0, 28.0
WM_AXES = {"opsz":144, "wght":540, "SOFT":16, "WONK":0}
WM_TEXT = "Kindling"

def load_source():
    s = open(SRC).read()
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', s).group(1).split()]
    MW, MH = vb[2], vb[3]
    inner = re.sub(r'</svg>\s*$','', re.sub(r'^<svg[^>]*>','',s,flags=re.S)).strip()
    p = re.findall(r'<path\b[^>]*/>', inner, re.S)
    book  = "".join(x for x in p if '#231D18' in x)                       # book + baseline
    flame = "".join(x for x in p if ('#B5532E' in x or '#E0612C' in x))   # two-tone flame
    return book, flame, MW, MH

def outline_wordmark():
    from fontTools.ttLib import TTFont
    from fontTools.varLib.instancer import instantiateVariableFont
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.boundsPen import BoundsPen
    from fontTools.pens.transformPen import TransformPen
    if not os.path.exists(FONT):
        raise FileNotFoundError("Restore the bundled Fraunces font from this package; no automatic download is performed.")
    f = TTFont(FONT); instantiateVariableFont(f, WM_AXES, inplace=True)
    gs=f.getGlyphSet(); cmap=f.getBestCmap(); hmtx=f["hmtx"]
    x=0; lay=[]; XMIN=1e9;XMAX=-1e9;YMIN=1e9;YMAX=-1e9
    for ch in WM_TEXT:
        g=cmap[ord(ch)]; bp=BoundsPen(gs); gs[g].draw(bp)
        if bp.bounds:
            a,b,c,d=bp.bounds; XMIN=min(XMIN,a+x);XMAX=max(XMAX,c+x);YMIN=min(YMIN,b);YMAX=max(YMAX,d)
        lay.append((g,x)); x+=hmtx[g][0]
    parts=[]
    for g,xoff in lay:
        sp=SVGPathPen(gs); gs[g].draw(TransformPen(sp,(1,0,0,-1,xoff-XMIN,YMAX))); parts.append(sp.getCommands())
    return " ".join(parts), XMAX-XMIN, YMAX-YMIN

def _nums(pathstr):
    d=re.search(r'd="([^"]*)"',pathstr).group(1); return [float(v) for v in re.findall(r'-?\d*\.?\d+',d)]
def flame_bbox(flame):
    xs=[];ys=[]
    for p in re.findall(r'<path\b[^>]*/>',flame,re.S):
        n=_nums(p); xs+=n[0::2]; ys+=n[1::2]
    return min(xs),min(ys),max(xs),max(ys)

def mark(book,flame,bc,fm,fe):
    return book.replace('#231D18',bc)+flame.replace('#B5532E',fm).replace('#E0612C',fe)
def svgfile(body,w,h,note):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}" '
            f'width="{w:.0f}" height="{h:.0f}" fill="none">\n  <!-- {note} -->\n{body}\n</svg>\n')

def build():
    os.makedirs(SVG, exist_ok=True)
    book,flame,MW,MH = load_source()
    WD,WW,WH         = outline_wordmark()
    VARS={"light":(INK,TERRA,EMBER),"reversed":(INK_D,FLAME_D,EMBER_D),"mono":(INK,INK,INK),"mono-reversed":(INK_D,INK_D,INK_D)}
    marks={k:mark(book,flame,*v) for k,v in VARS.items()}
    out={}
    out["kindling-mark.svg"]              = svgfile(marks["light"],MW,MH,"Kindling emblem (light).")
    out["kindling-mark-reversed.svg"]     = svgfile(marks["reversed"],MW,MH,"Kindling emblem (reversed/on dark).")
    out["kindling-mark-mono.svg"]         = svgfile(marks["mono"],MW,MH,"Kindling emblem (mono ink).")
    out["kindling-mark-mono-reversed.svg"]= svgfile(marks["mono-reversed"],MW,MH,"Kindling emblem (mono reversed).")
    wm=lambda fill: f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WW:.0f} {WH:.0f}" width="{WW:.0f}" height="{WH:.0f}"><path d="{WD}" fill="{fill}"/></svg>\n'
    out["kindling-wordmark.svg"]          = wm(INK)
    out["kindling-wordmark-reversed.svg"] = wm(INK_D)
    sc=LOCK_WT/WW; Hs=WH*sc; TH=MH+LOCK_GAP+Hs; cx=(MW-LOCK_WT)/2; ty=MH+LOCK_GAP
    lock=lambda k,fill: marks[k]+f'<g transform="translate({cx:.2f},{ty:.2f}) scale({sc:.5f})"><path d="{WD}" fill="{fill}"/></g>'
    out["kindling-lockup-stacked.svg"]         = svgfile(lock("light",INK),MW,TH,"Kindling stacked lockup (light).")
    out["kindling-lockup-stacked-reversed.svg"]= svgfile(lock("reversed",INK_D),MW,TH,"Kindling stacked lockup (reversed).")
    out["kindling-lockup-stacked-mono.svg"]    = svgfile(lock("mono",INK),MW,TH,"Kindling stacked lockup (mono).")
    bx0,by0,bx1,by1=flame_bbox(flame); fw,fh=bx1-bx0,by1-by0
    def fav(t,e,pad=64,S=512):
        s=(S-2*pad)/max(fw,fh); tx=S/2-s*(bx0+fw/2); ty2=S/2-s*(by0+fh/2)
        b=flame.replace('#B5532E',t).replace('#E0612C',e)
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" width="{S}" height="{S}" fill="none"><g transform="translate({tx:.2f},{ty2:.2f}) scale({s:.4f})">{b}</g></svg>\n'
    out["kindling-favicon.svg"]          = fav(TERRA,EMBER)
    out["kindling-favicon-reversed.svg"] = fav(FLAME_D,EMBER_D)
    for name,content in out.items():
        open(os.path.join(SVG,name),"w").write(content)
    print(f"Wrote {len(out)} SVGs to {SVG}")

if __name__=="__main__":
    build()
