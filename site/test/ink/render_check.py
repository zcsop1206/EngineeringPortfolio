"""Checks that stripping a page's <metadata> leaves its rendering untouched, light and dark.

Serves this folder and a scratch folder on a local port, shows each fixture page twice as an
<img> (the original, and the copy stripped by src/ink/strip.mjs), screenshots both in light
and dark, and asserts the two render pixel-identical. Also samples a default-ink stroke to
check that the SVG's own prefers-color-scheme switch works inside an <img>: dark ink on the
light page, light ink on the dark one.

    python site/test/ink/render_check.py [out_dir]

Needs Python Playwright with its bundled Chromium, Pillow, and node on PATH. Screenshots and
the stripped copies go to out_dir (default: a folder under the system temp dir); nothing is
written next to the fixture.
"""
import functools
import http.server
import json
import os
import re
import subprocess
import sys
import tempfile
import threading
from pathlib import Path

from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
SITE = HERE.parent.parent
FIXTURE = HERE / "fixture" / "sample"
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(tempfile.gettempdir()) / "ink-render-check"

# The CSS the README asks the site to use for .ink-page, and the page backgrounds behind it.
PAGE_CSS = """
:root { color-scheme: light dark; }
body { margin: 16px; background: #ffffff; font: 14px system-ui, sans-serif; }
.ink-page { display: block; width: 100%; max-width: 816px; margin: 1rem auto; height: auto; background: white; }
.pair { display: grid; grid-template-columns: 816px 816px; gap: 24px; }
@media (prefers-color-scheme: dark) {
  body { background: #0b0b0b; color: #ddd; }
  .ink-page { background: #111; }
}
"""


def strip_pages(dest: Path) -> list[str]:
    """Writes each fixture page, stripped by strip.mjs, to dest. Returns the page names."""
    dest.mkdir(parents=True, exist_ok=True)
    script = (
        "import fs from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';"
        "const [strip, src, dst] = process.argv.slice(1);"
        "const { stripInkSvg } = await import(pathToFileURL(strip).href);"
        "for (const f of fs.readdirSync(src).filter(f => f.endsWith('.svg')))"
        "  fs.writeFileSync(path.join(dst, f), stripInkSvg(fs.readFileSync(path.join(src, f), 'utf8')));"
    )
    subprocess.run(
        ["node", "--input-type=module", "-e", script, str(SITE / "src" / "ink" / "strip.mjs"), str(FIXTURE), str(dest)],
        check=True,
    )
    return sorted(p.name for p in FIXTURE.glob("*.svg"))


class Handler(http.server.SimpleHTTPRequestHandler):
    """Serves this folder at / and the scratch folder at /_out/."""

    def translate_path(self, path):
        clean = path.split("?", 1)[0].split("#", 1)[0]
        if clean.startswith("/_out/"):
            return str(OUT / clean[len("/_out/"):])
        return super().translate_path(path)

    def log_message(self, *args):
        pass


def ink_sample_points(svg_text: str, count: int = 9):
    """Points on the widest default-ink pen stroke's centre line, in page px, or []."""
    m = re.search(r"<metadata><!\[CDATA\[([\s\S]*?)\]\]></metadata>", svg_text)
    if not m:
        return []
    strokes = [s for s in json.loads(m.group(1))["strokes"] if s["tool"] == "pen" and s["color"] == "#000000"]
    if not strokes:
        return []
    s = max(strokes, key=lambda s: s["size"])
    pts = [(s["points"][i], s["points"][i + 1]) for i in range(0, len(s["points"]), 4)]
    step = max(1, len(pts) // (count + 1))
    return pts[step::step][:count]


def luminance(rgb) -> float:
    r, g, b = rgb[:3]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    names = strip_pages(OUT / "stripped")
    rows = "\n".join(
        f'<h2>{n}</h2><div class="pair">'
        f'<img id="orig-{n[:-4]}" class="ink-page" src="/fixture/sample/{n}" width="816" height="1056" alt="">'
        f'<img id="strip-{n[:-4]}" class="ink-page" src="/_out/stripped/{n}" width="816" height="1056" alt="">'
        f"</div>"
        for n in names
    )
    (OUT / "index.html").write_text(
        f"<!doctype html><meta charset=utf-8><title>ink render check</title><style>{PAGE_CSS}</style>{rows}",
        encoding="utf-8",
    )
    # One image at the top-left corner, so the original and the stripped copy are rasterized
    # at exactly the same position. (Side by side, Chromium's antialiasing of the dots and of
    # the translucent highlighter layer differs by 1 or 2 levels in a few pixels depending on
    # the x offset, whatever the content.)
    (OUT / "solo.html").write_text(
        f"<!doctype html><meta charset=utf-8><title>ink solo</title><style>{PAGE_CSS} body {{ margin: 0; }}"
        f" .ink-page {{ margin: 0; }}</style>"
        f'<img id="solo" class="ink-page" width="816" height="1056" alt="">'
        f"<script>document.getElementById('solo').src = new URLSearchParams(location.search).get('src');</script>",
        encoding="utf-8",
    )

    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Handler, directory=str(HERE)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    origin = f"http://127.0.0.1:{server.server_address[1]}"
    url = f"{origin}/_out/index.html"
    loaded = "[...document.images].every(i => i.complete && i.naturalWidth > 0)"
    srcs = {"orig": "/fixture/sample/", "strip": "/_out/stripped/"}

    failures = []
    report = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": 1720, "height": 1200}, device_scale_factor=1)
            for scheme in ("light", "dark"):
                page.emulate_media(color_scheme=scheme)
                page.goto(url)
                page.wait_for_function(loaded, timeout=30000)
                page.evaluate("Promise.all([...document.images].map(i => i.decode()))")
                page.screenshot(path=str(OUT / f"side-by-side-{scheme}.png"), full_page=True)
                for n in names:
                    stem = n[:-4]
                    shots = {}
                    for kind in ("orig", "strip"):
                        path = OUT / scheme / f"{stem}-{kind}.png"
                        path.parent.mkdir(parents=True, exist_ok=True)
                        page.goto(f"{origin}/_out/solo.html?src={srcs[kind]}{n}")
                        page.wait_for_function(loaded, timeout=30000)
                        page.evaluate("document.images[0].decode()")
                        page.locator("#solo").screenshot(path=str(path))
                        shots[kind] = Image.open(path).convert("RGBA")
                    a, b = shots["orig"], shots["strip"]
                    if a.size != b.size:
                        failures.append(f"{scheme} {n}: sizes differ {a.size} vs {b.size}")
                        continue
                    diff = ImageChops.difference(a, b)
                    changed = sum(1 for px in diff.getdata() if px != (0, 0, 0, 0))
                    report.append(f"{scheme:5} {n}: {a.size[0]}x{a.size[1]}, {changed} pixels differ")
                    if changed:
                        failures.append(f"{scheme} {n}: {changed} pixels differ (bbox {diff.getbbox()})")

                    pts = ink_sample_points((FIXTURE / n).read_text(encoding="utf-8"))
                    if pts:
                        sx, sy = a.size[0] / 816, a.size[1] / 1056
                        lums = [luminance(a.getpixel((min(a.size[0] - 1, round(x * sx)), min(a.size[1] - 1, round(y * sy)))))
                                for x, y in pts]
                        if scheme == "light":
                            ink = min(lums)
                            ok = ink < 80
                        else:
                            ink = max(lums)
                            ok = ink > 170
                        report.append(f"      default ink luminance at stroke centre ({scheme}): {ink:.0f}"
                                      f" ({'ok' if ok else 'WRONG'})")
                        if not ok:
                            failures.append(f"{scheme} {n}: default ink luminance {ink:.0f} is wrong for {scheme} mode")
            browser.close()
    finally:
        server.shutdown()

    print("\n".join(report))
    print(f"screenshots in {OUT}")
    if failures:
        print("FAILED:\n  " + "\n  ".join(failures))
        return 1
    print("all pages render identically after stripping, light and dark")
    return 0


if __name__ == "__main__":
    sys.exit(main())
