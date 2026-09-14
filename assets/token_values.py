"""Read the existing raw palette from the package's canonical CSS."""
from pathlib import Path
import re

CSS = Path(__file__).resolve().parent.parent / "design-system" / "tokens.css"

def color(name):
    css = re.sub(r"/\*.*?\*/", "", CSS.read_text(), flags=re.S)
    match = re.search(r"--" + re.escape(name) + r"\s*:\s*(#[0-9a-fA-F]{6})\s*;", css)
    if not match:
        raise ValueError(f"Expected a six-digit raw color token: --{name}")
    return match.group(1)
