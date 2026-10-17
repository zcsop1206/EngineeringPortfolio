#!/usr/bin/env python3
"""Probe A: per-token surprisal of a schema's statement under a small local LM.

  python probes/surprisal.py schemata/<name>.md [more.md ...] [--model ID] [--threshold BITS]

Emits signals only: highlighted tokens, one mean number, and a greedy completion
of the second half from the first. Writes probes/out/<name>.surprisal.<model>.md.
Untested without a model present; see probes/README.md.
"""
import argparse, math, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "probes" / "out"

def statement(path):
    txt = Path(path).read_text(encoding="utf-8")
    m = re.search(r"^## Statement\s*\n(.*?)(?=^## |\Z)", txt, re.S | re.M)
    if not m:
        sys.exit(f"{path}: no ## Statement section")
    s = " ".join(l.strip() for l in m.group(1).splitlines() if l.strip() and not l.strip().startswith("<!--"))
    return s

def load(model_id):
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer
    tok = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32)
    model.eval()
    return tok, model

def surprisal(tok, model, text):
    import torch
    ids = tok(text, return_tensors="pt").input_ids
    with torch.no_grad():
        logits = model(ids).logits[0, :-1]
    logp = torch.log_softmax(logits.float(), dim=-1)
    targets = ids[0, 1:]
    bits = (-logp[torch.arange(len(targets)), targets] / math.log(2)).tolist()
    toks = tok.convert_ids_to_tokens(targets)
    first = tok.convert_ids_to_tokens(ids[0, :1])[0]
    return [(first, 0.0)] + list(zip(toks, bits))

def completion(tok, model, text, max_new=40):
    import torch
    words = text.split()
    head = " ".join(words[: len(words) // 2])
    ids = tok(head, return_tensors="pt").input_ids
    with torch.no_grad():
        out = model.generate(ids, max_new_tokens=max_new, do_sample=False)
    return head, tok.decode(out[0, ids.shape[1]:], skip_special_tokens=True), " ".join(words[len(words) // 2 :])

def render(pairs, threshold):
    s, open_ = "", False
    for t, b in pairs:
        piece = t.replace("▁", " ").replace("Ġ", " ")
        hot = b >= threshold
        if hot and not open_:
            lead = len(piece) - len(piece.lstrip())
            s += piece[:lead] + "==" + piece[lead:]; open_ = True
        elif not hot and open_:
            s += "==" + piece; open_ = False
        else:
            s += piece
    return (s + ("==" if open_ else "")).strip()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="+")
    ap.add_argument("--model", default="google/gemma-2-2b")
    ap.add_argument("--threshold", type=float, default=8.0, help="bits; tokens at or above are highlighted")
    a = ap.parse_args()
    tok, model = load(a.model)
    OUT.mkdir(exist_ok=True)
    for f in a.files:
        text = statement(f)
        pairs = surprisal(tok, model, text)
        mean = sum(b for _, b in pairs) / max(len(pairs), 1)
        head, gen, real = completion(tok, model, text)
        name = Path(f).stem
        tag = a.model.split("/")[-1].lower()
        report = (
            f"# surprisal: {name}\n\nmodel: {a.model}  threshold: {a.threshold} bits\n\n"
            f"## highlighted (>= threshold)\n{render(pairs, a.threshold)}\n\n"
            f"## mean surprisal per token\n{mean:.2f} bits\n\n"
            f"## completion test\nhead: {head}\n\nmodel continues: {gen.strip()}\n\nmine: {real}\n\n"
            f"## interpretation\n<!-- by hand. original / idiosyncratic / confused, per highlight. borrowed? -->\n"
        )
        (OUT / f"{name}.surprisal.{tag}.md").write_text(report, encoding="utf-8")
        print(f"{name}: mean {mean:.2f} bits, {sum(b >= a.threshold for _, b in pairs)} tokens highlighted -> probes/out/{name}.surprisal.{tag}.md")

if __name__ == "__main__":
    main()
