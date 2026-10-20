#!/usr/bin/env python3
"""Probe M: a map of the edge.

Embeds every unit of knowledge in the vault into one semantic space, projects it to 2-D,
and draws where the four states sit:

  known known      held schemata                        solid dot
  known unknown    open questions                       hollow ring
  unknown known    activity (writeup sections, exemplars) with no held schema near it
                                                        amber dot; grey when a schema is near
  unknown unknown  kept unmapped, by decision. The dashed frontier is the edge of what is
                   documented and nothing is drawn beyond it. (--reference FILE exists but
                   is dormant: it would draw someone else's map over mine.)

Signals only: positions, distances, links. Writes probes/out/map.svg and probes/out/map.md
(the note that embeds the SVG and lists the unknown-known candidates with links).

  python probes/map.py                      # 2-D, t-SNE if n is large enough, else PCA
  python probes/map.py --reference probes/reference/thermal.txt
  python probes/map.py --threshold 0.55     # cosine distance beyond which activity counts as unarticulated

Model: sentence-transformers/all-MiniLM-L6-v2 loaded through transformers (mean pooling),
offline from the Hugging Face cache. No sentence-transformers install needed.
"""
import argparse, math, os, re, sys
from html import escape as esc
from pathlib import Path

os.environ.setdefault("HF_HUB_OFFLINE", "1")
import numpy as np

EDGE = Path(__file__).resolve().parent.parent
VAULT = EDGE.parent
OUT = EDGE / "probes" / "out"
MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# ---------- collect ----------

def frontmatter(txt):
    m = re.match(r"---\n(.*?)\n---\n?", txt, re.S)
    fm, body = {}, txt
    if m:
        for line in m.group(1).splitlines():
            if ":" in line and not line.startswith(" "):
                k, v = line.split(":", 1)
                fm[k.strip()] = v.strip().strip('"')
        body = txt[m.end():]
    return fm, body

def section(body, heading):
    m = re.search(rf"^## {re.escape(heading)}\s*\n(.*?)(?=^## |\Z)", body, re.S | re.M)
    return m.group(1).strip() if m else ""

def clean(text):
    text = re.sub(r"<!--.*?-->", " ", text, flags=re.S)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", text)          # images
    text = re.sub(r"<[^>]+>", " ", text)                          # html
    text = re.sub(r"\$[^$]*\$", " ", text)                        # math
    text = re.sub(r"\[\[([^\]|]+)(\|[^\]]*)?\]\]", r"\1", text)   # wikilinks
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)          # links
    text = re.sub(r"^\|.*$", " ", text, flags=re.M)               # tables
    text = re.sub(r"[`*_#>]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()

def units():
    """Each unit: dict(kind, label, text, path, anchor, meta)."""
    out = []
    for p in sorted((EDGE / "schemata").glob("*.md")):
        fm, body = frontmatter(p.read_text(encoding="utf-8"))
        gen = clean(section(body, "Generalization") or section(body, "Statement"))
        if gen:
            out.append(dict(kind="schema", held=fm.get("held") == "true", label=p.stem,
                            text=gen, path=f"edge/schemata/{p.stem}", anchor=""))
        for i, ex in enumerate(re.findall(r"^- (.+)$", section(body, "Exemplars"), re.M)):
            out.append(dict(kind="exemplar", label=f"{p.stem} ex{i+1}", text=clean(ex),
                            path=f"edge/schemata/{p.stem}", anchor="#Exemplars", schema=p.stem))
    for p in sorted((EDGE / "questions").glob("*.md")):
        fm, body = frontmatter(p.read_text(encoding="utf-8"))
        m = re.search(r"^# Q: (.+)$", body, re.M)
        if m and fm.get("status") != "schema":
            out.append(dict(kind="question", label=p.stem, text=clean(m.group(1)),
                            path=f"edge/questions/{p.stem}", anchor=""))
    for idx in sorted((VAULT / "projects").glob("*/index.md")):
        slug = idx.parent.name
        fm, body = frontmatter(idx.read_text(encoding="utf-8"))
        if fm.get("publish") == "false":
            continue
        for m in re.finditer(r"^## (.+?)\s*\n(.*?)(?=^## |\Z)", body, re.S | re.M):
            text = clean(m.group(2))
            if len(text.split()) < 25:
                continue
            out.append(dict(kind="activity", label=f"{slug}: {m.group(1).strip()}", text=text[:1500],
                            path=f"projects/{slug}/index", anchor="#" + m.group(1).strip().replace(" ", "%20"),
                            project=slug))
        for log in sorted((idx.parent / "log").glob("*.md")) if (idx.parent / "log").exists() else []:
            lfm, lbody = frontmatter(log.read_text(encoding="utf-8"))
            text = clean(lbody)
            if lfm.get("ink") or len(text.split()) < 25:
                continue
            out.append(dict(kind="activity", label=f"{slug}: log {log.stem}", text=text[:1500],
                            path=f"projects/{slug}/log/{log.stem}", anchor="", project=slug))
    return out

def reference(path):
    if not path:
        return []
    lines = [l.strip() for l in Path(path).read_text(encoding="utf-8").splitlines()]
    return [dict(kind="reference", label=l, text=l, path="", anchor="") for l in lines if l and not l.startswith("#")]

# ---------- embed ----------

def embed(texts):
    import torch
    from transformers import AutoModel, AutoTokenizer
    tok = AutoTokenizer.from_pretrained(MODEL)
    model = AutoModel.from_pretrained(MODEL).eval()
    vecs = []
    for i in range(0, len(texts), 32):
        b = tok(texts[i:i+32], padding=True, truncation=True, max_length=256, return_tensors="pt")
        with torch.no_grad():
            h = model(**b).last_hidden_state
        mask = b.attention_mask.unsqueeze(-1)
        v = (h * mask).sum(1) / mask.sum(1)
        vecs.append(torch.nn.functional.normalize(v, dim=-1))
    return torch.cat(vecs).numpy()

def reduce(X, dims):
    from sklearn.decomposition import PCA
    n = len(X)
    if n >= 12:
        from sklearn.manifold import TSNE
        X50 = PCA(n_components=min(50, n - 1), random_state=0).fit_transform(X) if n > 51 else X
        return TSNE(n_components=dims, perplexity=max(5, min(30, (n - 1) // 3)), init="pca",
                    random_state=0, metric="cosine").fit_transform(X50)
    return PCA(n_components=dims, random_state=0).fit_transform(X)

# ---------- analyse ----------

def analyse(U, X, threshold):
    held = [i for i, u in enumerate(U) if u["kind"] == "schema" and u["held"]]
    schemata = [i for i, u in enumerate(U) if u["kind"] == "schema"]
    anchors = held or schemata     # with nothing held, fall back to any schema, and say so
    for i, u in enumerate(U):
        if anchors:
            d = 1 - X[i] @ X[anchors].T
            j = int(np.argmin(d))
            u["nearest_schema"], u["dist"] = U[anchors[j]]["label"], float(d[j])
        else:
            u["nearest_schema"], u["dist"] = None, 1.0
        u["unarticulated"] = u["kind"] in ("activity", "exemplar") and u["dist"] >= threshold
    return bool(held)

def cluster(U, X):
    """Group activity units into regions. A region with no schema inside is a candidate
    micro-paradigm: work done without an articulated rule."""
    act = [i for i, u in enumerate(U) if u["kind"] == "activity"]
    if len(act) < 6:
        return []
    from sklearn.cluster import AgglomerativeClustering
    k = max(3, min(12, int(round(math.sqrt(len(act) / 2)))))
    lab = AgglomerativeClustering(n_clusters=k, metric="cosine", linkage="average").fit_predict(X[act])
    regions = []
    for c in range(k):
        members = [act[j] for j in range(len(act)) if lab[j] == c]
        if len(members) < 2:
            continue
        centroid = X[members].mean(0); centroid /= np.linalg.norm(centroid)
        central = members[int(np.argmax(X[members] @ centroid))]
        projects = sorted({U[i]["project"] for i in members})
        sch = [i for i, u in enumerate(U) if u["kind"] == "schema" and (1 - X[i] @ centroid) < 0.45]
        for i in members:
            U[i]["region"] = c
        regions.append(dict(id=c, members=members, central=U[central]["label"], projects=projects,
                            schemata=[U[i]["label"] for i in sch], cross=len(projects) > 1))
    return regions

PALETTE = ["#1f77b4", "#d62728", "#2ca02c", "#9467bd", "#ff7f0e", "#17becf", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#393b79", "#637939"]

# ---------- draw ----------

def svg(U, P, used_held, threshold, regions):
    W, H, pad, BAND = 1100, 760, 70, 215
    xs, ys = P[:, 0], P[:, 1]
    sx = lambda x: pad + (x - xs.min()) / (xs.max() - xs.min() + 1e-9) * (W - 2 * pad)
    sy = lambda y: pad + (y - ys.min()) / (ys.max() - ys.min() + 1e-9) * (H - 2 * pad)
    own = [i for i, u in enumerate(U) if u["kind"] != "reference"]
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H + BAND}" font-family="system-ui, sans-serif" font-size="11">',
             '<style>@media (prefers-color-scheme: dark){.t{fill:#ddd}.fr{stroke:#ddd}} .t{fill:#222}.fr{stroke:#222}</style>']
    # frontier: convex hull of own documented units
    if len(own) >= 3:
        from scipy.spatial import ConvexHull
        pts = np.array([[sx(xs[i]), sy(ys[i])] for i in own])
        try:
            hull = ConvexHull(pts)
            d = " ".join(f"{pts[v][0]:.1f},{pts[v][1]:.1f}" for v in hull.vertices)
            parts.append(f'<polygon class="fr" points="{d}" fill="none" stroke-dasharray="6 5" stroke-width="1.2" opacity="0.7"/>')
            vx, vy = pts[hull.vertices[0]]
            parts.append(f'<text class="t" x="{vx+6:.0f}" y="{vy-6:.0f}" opacity="0.7">edge of what is documented</text>')
        except Exception:
            pass
    # region hulls: a candidate micro-paradigm when no schema sits inside
    for r in regions:
        if len(r["members"]) < 3:
            continue
        from scipy.spatial import ConvexHull
        pts = np.array([[sx(xs[i]), sy(ys[i])] for i in r["members"]])
        try:
            hull = ConvexHull(pts)
        except Exception:
            continue
        d = " ".join(f"{pts[v][0]:.1f},{pts[v][1]:.1f}" for v in hull.vertices)
        col = "#5a8f3c" if r["schemata"] else ("#d98c1f" if r["cross"] else "#bbb")
        parts.append(f'<polygon points="{d}" fill="{col}" fill-opacity="0.07" stroke="{col}" stroke-width="1" stroke-dasharray="2 3"/>')
        cx, cy = pts.mean(0)
        tag = " + ".join(r["projects"]) if len(r["projects"]) <= 3 else f"{len(r['projects'])} projects"
        parts.append(f'<text class="t" x="{cx:.0f}" y="{cy:.0f}" text-anchor="middle" font-size="10" opacity="0.8">{esc(tag)}</text>')
    # links: exemplar -> its schema, question -> nearest schema, articulated activity -> its schema
    labels = {u["label"]: i for i, u in enumerate(U)}
    for i, u in enumerate(U):
        tgt = None
        if u["kind"] == "exemplar":
            tgt = labels.get(u.get("schema"))
        elif u["kind"] == "question" or (u["kind"] == "activity" and not u["unarticulated"]):
            tgt = labels.get(u["nearest_schema"])
        if tgt is not None:
            parts.append(f'<line x1="{sx(xs[i]):.1f}" y1="{sy(ys[i]):.1f}" x2="{sx(xs[tgt]):.1f}" y2="{sy(ys[tgt]):.1f}" stroke="#888" stroke-width="0.8" opacity="0.6"/>')
    projects = sorted({u["project"] for u in U if u["kind"] == "activity"})
    pcol = {p: PALETTE[k % len(PALETTE)] for k, p in enumerate(projects)}
    # points
    for i, u in enumerate(U):
        x, y = sx(xs[i]), sy(ys[i])
        title = f'<title>{esc(u["label"])}\n{u["kind"]}' + (f'\nnearest schema: {esc(str(u["nearest_schema"]))} (d={u["dist"]:.2f})' if u.get("nearest_schema") else "") + '</title>'
        if u["kind"] == "reference":
            parts.append(f'<g opacity="0.35"><path d="M{x-3},{y-3}L{x+3},{y+3}M{x-3},{y+3}L{x+3},{y-3}" stroke="#777" stroke-width="1"/>{title}</g>')
        elif u["kind"] == "activity":
            c = pcol[u["project"]]
            op = "0.9" if u["unarticulated"] else "0.45"
            parts.append(f'<g><circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="{c}" opacity="{op}"/>{title}</g>')
        elif u["kind"] == "exemplar":
            c = "#d98c1f" if u["unarticulated"] else "#5a8f3c"
            parts.append(f'<g><rect x="{x-4:.1f}" y="{y-4:.1f}" width="8" height="8" fill="{c}"/>{title}</g>')
        elif u["kind"] == "question":
            parts.append(f'<g><circle cx="{x:.1f}" cy="{y:.1f}" r="6" fill="none" stroke="#2f6db5" stroke-width="2"/>{title}</g>')
        elif u["kind"] == "schema":
            if u["held"]:
                parts.append(f'<g><circle cx="{x:.1f}" cy="{y:.1f}" r="7" fill="#222" class="t"/>{title}</g>')
            else:
                parts.append(f'<g><circle cx="{x:.1f}" cy="{y:.1f}" r="7" fill="none" stroke="#222" class="fr" stroke-width="2"/>'
                             f'<path d="M{x:.1f},{y-7:.1f}A7,7 0 0 1 {x:.1f},{y+7:.1f}Z" fill="#222" class="t"/>{title}</g>')
            parts.append(f'<text class="t" x="{x+10:.1f}" y="{y+4:.1f}" font-weight="600">{esc(u["label"])}</text>')
    # legend
    L = [("known known: held schema", '<circle cx="8" cy="8" r="6" fill="#222" class="t"/>'),
         ("schema not yet held", '<circle cx="8" cy="8" r="6" fill="none" stroke="#222" class="fr" stroke-width="2"/>'),
         ("known unknown: open question", '<circle cx="8" cy="8" r="5" fill="none" stroke="#2f6db5" stroke-width="2"/>'),
         ("activity: a writeup section, coloured by project", '<circle cx="8" cy="8" r="4" fill="#1f77b4"/>'),
         ("faded and linked: a schema is near it", '<circle cx="8" cy="8" r="4" fill="#1f77b4" opacity="0.45"/>'),
         ("region across projects, no schema: unknown known", '<rect x="2" y="2" width="12" height="12" fill="#d98c1f" fill-opacity="0.15" stroke="#d98c1f" stroke-dasharray="2 3"/>'),
         ("region in one project, no schema", '<rect x="2" y="2" width="12" height="12" fill="#bbb" fill-opacity="0.15" stroke="#bbb" stroke-dasharray="2 3"/>'),
         ("region with a schema inside", '<rect x="2" y="2" width="12" height="12" fill="#5a8f3c" fill-opacity="0.15" stroke="#5a8f3c" stroke-dasharray="2 3"/>'),
         ("exemplar", '<rect x="4" y="4" width="8" height="8" fill="#5a8f3c"/>'),
         ("reference concept (outside the vault)", '<path d="M5,5L11,11M5,11L11,5" stroke="#777"/>')]
    parts.append(f'<line x1="{pad}" y1="{H+8}" x2="{W-pad}" y2="{H+8}" stroke="#999" stroke-width="0.5"/>')
    for k, (txt, glyph) in enumerate(L):
        parts.append(f'<g transform="translate({W//2 - 40},{H + 20 + 18*k})">{glyph}<text class="t" x="18" y="12" font-size="10">{txt}</text></g>')
    for k, p in enumerate(projects):
        col, row = divmod(k, 6)
        parts.append(f'<g transform="translate({pad + 200*col},{H + 20 + 18*row})"><circle cx="8" cy="8" r="4" fill="{pcol[p]}"/><text class="t" x="18" y="12" font-size="10">{esc(p)}</text></g>')
    parts.append("</svg>")
    return "\n".join(parts)

def note(U, used_held, threshold, dims, ref_path, regions):
    un = sorted([u for u in U if u.get("unarticulated")], key=lambda u: -u["dist"])
    by_proj = {}
    for u in un:
        by_proj.setdefault(u.get("project", u.get("schema", "")), []).append(u)
    lines = ["---", "type: map", f"generated: {np.datetime_as_string(np.datetime64('today'))}", "---", "",
             "# map of the edge", "", "![[probes/out/map.svg]]", "",
             f"units: {len(U)} ({sum(u['kind']=='activity' for u in U)} activity, {sum(u['kind']=='schema' for u in U)} schemata, "
             f"{sum(u['kind']=='question' for u in U)} questions, {sum(u['kind']=='exemplar' for u in U)} exemplars, "
             f"{sum(u['kind']=='reference' for u in U)} reference). projection: {'t-SNE' if len(U) >= 12 else 'PCA'} to {dims}-D. "
             f"distance anchor: {'held schemata' if used_held else 'all schemata (none held yet)'}. threshold {threshold}.", ""]
    if not used_held:
        lines += ["No schema is held yet, so distances are to unheld schemata. Until one is held, every amber", "dot is provisional.", ""]
    lines += ["## regions", "", "Activity grouped by meaning, not by project. A region with no schema inside is work done",
              "without an articulated rule. One that spans projects is the strongest candidate: the same tacit",
              "rule carried across them. The label is the section nearest the region's centre, a signal, not a",
              "name. Pick a region, state the rule it ran on, and it becomes a schema.", ""]
    for r in sorted(regions, key=lambda r: (bool(r["schemata"]), not r["cross"], -len(r["members"]))):
        kind = "has schema: " + ", ".join(r["schemata"]) if r["schemata"] else ("UNKNOWN KNOWN, spans projects" if r["cross"] else "unknown known, one project")
        lines.append(f"### region {r['id']}: {r['central']}  ({len(r['members'])} sections; {', '.join(r['projects'])})  {kind}")
        for i in r["members"]:
            u = U[i]
            lines.append(f"- [[{u['path']}{u['anchor']}|{u['label']}]]")
        lines.append("")
    lines += ["## sections farthest from any schema", "", "Farthest first, capped at 25.", ""]
    for u in un[:25]:
        lines.append(f"- d={u['dist']:.2f} [[{u['path']}{u['anchor']}|{u['label']}]]  (nearest: {u['nearest_schema']})")
    lines.append("")
    qs = [u for u in U if u["kind"] == "question"]
    if qs:
        lines += ["## questions and their nearest schema", ""]
        lines += [f"- [[{u['path']}|{u['label']}]] -> {u['nearest_schema']} (d={u['dist']:.2f})" for u in qs] + [""]
    lines += ["## unknown unknowns", "",
              ("Kept unmapped, by decision (2026-10-20). The dashed line is the edge of what is documented;"
               " the map shows nothing beyond it, because anything drawn there would come from a reference"
               " outside me and would be that reference's map, not mine. Unknown unknowns enter through"
               " anomalies and through another schema's lens, not through this picture." if not ref_path else
               f"Reference: {ref_path}. Crosses far from every own point are candidates; see the SVG."), ""]
    return "\n".join(lines)

# ---------- main ----------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--reference", default=None, help="text file, one concept per line, from outside the vault")
    ap.add_argument("--threshold", type=float, default=0.55, help="cosine distance to nearest schema beyond which activity is unarticulated")
    ap.add_argument("--dims", type=int, default=2, choices=[2])
    a = ap.parse_args()
    U = units() + reference(a.reference)
    if len(U) < 3:
        sys.exit("not enough units to map")
    X = embed([u["text"] for u in U])
    used_held = analyse(U, X, a.threshold)
    regions = cluster(U, X)
    P = reduce(X, a.dims)
    OUT.mkdir(exist_ok=True)
    (OUT / "map.svg").write_text(svg(U, P, used_held, a.threshold, regions), encoding="utf-8")
    (OUT / "map.md").write_text(note(U, used_held, a.threshold, a.dims, a.reference, regions), encoding="utf-8")
    un = sum(1 for u in U if u.get("unarticulated"))
    cross = sum(1 for r in regions if r["cross"] and not r["schemata"])
    print(f"{len(U)} units, {len(regions)} regions ({cross} span projects, no schema) -> probes/out/map.svg, map.md | unarticulated sections: {un} | anchor: {'held' if used_held else 'all'} schemata")

if __name__ == "__main__":
    main()
