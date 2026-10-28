#!/usr/bin/env python3
"""edge: optional tooling over the markdown. The Obsidian plugin and Bases show all of this.
Signals, scheduling and counting only. Deletable without losing information.

  edge capture "<tag> text"        append a line to inbox/inbox.md
  edge triage                      show inbox grouped by signal, with what each should become
  edge new question|schema|project <name>
  edge due                         schemata whose drill_next is today or earlier
  edge drill <schema> pass|fail    double or reset the interval on that schema
  edge sweep <project>             print every schema's lens against a project
  edge stats                       where knowledge is sitting right now, with health
"""
import re, sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent
INBOX = ROOT / "inbox" / "inbox.md"
TAGS = {"?": "question -> questions/", "!": "surprise -> anomaly on a schema, or project Surprises",
        "~": "hunch -> question until the rule is stated", "=": "derivation -> exemplar on a schema",
        "x": "error -> anomaly or question", "p": "prediction -> project Predictions table"}
TODAY = date.today()

def frontmatter(path):
    txt = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---", txt, re.S)
    fm = {}
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                fm[k.strip()] = v.strip()
    return fm, txt

def num(fm, key):
    try:
        return int(fm.get(key, "0") or 0)
    except ValueError:
        return 0

def health(fm):
    ex, an, co = num(fm, "exemplars"), num(fm, "anomalies"), num(fm, "confirmed")
    if an > ex: return "crisis"
    if an > co: return "degenerating"
    if co > 0: return "progressive"
    if ex > 0: return "holding"
    return "empty"

def set_field(path, key, value):
    txt = path.read_text(encoding="utf-8")
    new, n = re.subn(rf"^{key}:.*$", f"{key}: {value}", txt, count=1, flags=re.M)
    if n == 0:
        sys.exit(f"{path.name}: no field {key}")
    path.write_text(new, encoding="utf-8")

def section(txt, heading):
    m = re.search(rf"^## {re.escape(heading)}\s*\n(.*?)(?=^## |\Z)", txt, re.S | re.M)
    return m.group(1).strip() if m else ""

def capture(args):
    line = " ".join(args).strip()
    if not line or line[0] not in TAGS:
        sys.exit(f"first char must be one of {' '.join(TAGS)}")
    with INBOX.open("a", encoding="utf-8") as f:
        f.write(f"- {TODAY} {line}\n")
    print("captured")

def inbox_lines():
    out = []
    for l in INBOX.read_text(encoding="utf-8").splitlines():
        m = re.match(r"- (\d{4}-\d{2}-\d{2}) ([?!~=xp]) (.*)", l)
        if m:
            out.append(m.groups())
    return out

def triage(_):
    lines = inbox_lines()
    if not lines:
        print("inbox empty"); return
    for tag, meaning in TAGS.items():
        hits = [l for l in lines if l[1] == tag]
        if hits:
            print(f"\n{tag}  {meaning}")
            for d, _, t in hits:
                print(f"   {d}  {t}")
    print("\nresolve each into a file by hand, then delete the line. inbox should end empty.")

def new(args):
    kind, name = args[0], "-".join(args[1:]).lower()
    folder = {"question": "questions", "schema": "schemata", "project": "projects"}[kind]
    dst = ROOT / folder / f"{name}.md"
    if dst.exists():
        sys.exit(f"{dst} exists")
    txt = (ROOT / "templates" / f"{kind}.md").read_text(encoding="utf-8").replace("{{date}}", str(TODAY))
    dst.write_text(txt, encoding="utf-8")
    print(dst.relative_to(ROOT))

def schemata():
    return sorted((ROOT / "schemata").glob("*.md"))

def due(_):
    rows = []
    for s in schemata():
        fm, _ = frontmatter(s)
        nxt = fm.get("drill_next", "")
        if nxt and date.fromisoformat(nxt) <= TODAY:
            rows.append((s.stem, fm))
    if not rows:
        print("nothing due"); return
    for name, fm in rows:
        print(f"[{name}] solve a new exemplar   ({health(fm)}, {num(fm,'exemplars')} so far, due {fm['drill_next']})")
    print("\nwork it (write / draw / constrain / build), put it under ## Exemplars and bump the count. then: edge drill <schema> pass|fail")

def drill(args):
    name, result = args[0], args[1]
    path = ROOT / "schemata" / f"{name}.md"
    if not path.exists():
        sys.exit(f"no schema {name}")
    fm, _ = frontmatter(path)
    iv = int(fm.get("drill_interval", "1") or 1) * 2 if result == "pass" else 1
    set_field(path, "drill_interval", iv)
    set_field(path, "drill_next", TODAY + timedelta(days=iv))
    print(f"{name}: next {TODAY + timedelta(days=iv)} (interval {iv})")
    if result == "pass" and num(fm, "exemplars") == 0:
        print("note: exemplars is still 0. a pass without a new exemplar in the file is not a pass.")
    if result == "fail":
        print('also capture it:  edge capture "x failed drill <schema>: <cause>"')

def sweep(args):
    proj = ROOT / "projects" / f"{args[0]}.md"
    if not proj.exists():
        sys.exit(f"no project {args[0]}")
    _, ptxt = frontmatter(proj)
    print(f"# lens sweep: {args[0]}  ({TODAY})\n")
    print(f"intent: {section(ptxt, 'Intent')[:200]}\n")
    for s in schemata():
        fm, txt = frontmatter(s)
        lens = section(txt, "Lens") or "(no lens written yet)"
        print(f"## {s.stem}  [{health(fm)}, held {fm.get('held','?')}]")
        print(f"   {lens}")
        print("   -> answer: \n")
    print("any lens you cannot answer is a new question. any lens that feels irrelevant: say why, that is also data.")

def stats(_):
    inbox = inbox_lines()
    qs = [frontmatter(p)[0] for p in (ROOT / "questions").glob("*.md")]
    ss = [frontmatter(p)[0] for p in schemata()]
    due_n = sum(1 for s in ss if s.get("drill_next") and date.fromisoformat(s["drill_next"]) <= TODAY)
    by_health = {}
    for s in ss:
        by_health[health(s)] = by_health.get(health(s), 0) + 1
    print("inbox     ", {t: sum(1 for l in inbox if l[1] == t) for t in TAGS if any(l[1] == t for l in inbox)} or "empty")
    print("questions ", {st: sum(1 for q in qs if q.get("status") == st) for st in ["open", "attempting", "derived", "schema"]})
    print("schemata  ", len(ss), "| held:", sum(1 for s in ss if s.get("held") == "true"),
          "| health:", by_health, "| exemplars:", sum(num(s, "exemplars") for s in ss),
          "| anomalies:", sum(num(s, "anomalies") for s in ss), "| drills due:", due_n)
    print("\nreading: UU->KU shows as inbox ! and new questions. KU->KK shows as exemplars growing. held: true is a known known.")

CMDS = {"capture": capture, "triage": triage, "new": new, "due": due, "drill": drill, "sweep": sweep, "stats": stats}

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in CMDS:
        print(__doc__); sys.exit(1)
    CMDS[sys.argv[1]](sys.argv[2:])
