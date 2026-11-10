#!/usr/bin/env node
// tally.mjs: reads calls.md (and git), writes readout.md. Generated output is not Adit's words.
// Plain Node >= 18, ESM, no dependencies. See README.md in this folder.
// readout.md order: header, Verdict, Next id, Open, Arrivals, Misses, Known, Dormant, Domains, Weeks, Problems.
// --nudge and --watch also write nudge.md beside the ledger (see computeNudges).
// Lines without an id get one on the next write run (see numberLedger); --check and --stdout never write.

import { readFileSync, writeFileSync, existsSync, realpathSync, watch, watchFile } from 'node:fs';
import { execFileSync, execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Dates (all computed in UTC from YYYY-MM-DD strings so no timezone drift)

const DAY_MS = 86400000;

function pad2(n) {
  return String(n).padStart(2, '0');
}

function fmtUTC(d) {
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

function toUTC(dateStr) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) throw new Error(`bad date ${dateStr}`);
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
}

export function isValidDate(dateStr) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr || '');
  if (!m) return false;
  return fmtUTC(toUTC(dateStr)) === dateStr;
}

// Monday of the ISO week containing dateStr, as YYYY-MM-DD.
export function weekStart(dateStr) {
  const d = toUTC(dateStr);
  const offset = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - offset);
  return fmtUTC(d);
}

export function addDays(dateStr, n) {
  const d = toUTC(dateStr);
  d.setUTCDate(d.getUTCDate() + n);
  return fmtUTC(d);
}

export function daysBetween(a, b) {
  return Math.round((toUTC(b) - toUTC(a)) / DAY_MS);
}

function monthOf(dateStr) {
  return dateStr.slice(0, 7);
}

// Local calendar date of an epoch (seconds), matching how "today" is taken from new Date().
export function epochToDate(epochSeconds) {
  const d = new Date(epochSeconds * 1000);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function localNow() {
  const d = new Date();
  return `${localToday()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function localClock() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

// ---------------------------------------------------------------------------
// Knobs

export const DEFAULT_KNOBS = {
  'settle window days': 14,
  'math calls per week': 6,
  'miss rate low': 20,
  'miss rate high': 60,
  'calibration gap points': 15,
  'citations per month': 1,
  'moot share max': 25,
  'test domains': ['putnam', 'asic'],
  'dormant weeks': 4,
  'resemblance': 25,
};

const SINCE_RE = /^(\d{4}-\d{2}-\d{2})(?:\s+c([1-9]\d{0,8}))?$/;

// Parses `| knob | value | since |` rows out of README text. Returns { knobs, problems }.
// The since cell is "YYYY-MM-DD" or "YYYY-MM-DD c<N>" (the system call that changed it);
// ids are collected in knobs.sinceRefs and checked against the ledger by buildReadout.
export function parseKnobs(readmeText) {
  const knobs = {};
  const problems = [];
  const rows = new Map();
  if (typeof readmeText === 'string') {
    for (const raw of readmeText.replace(/^﻿/, '').split(/\r?\n/)) {
      const line = raw.trim();
      if (!line.startsWith('|')) continue;
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (cells.length < 2) continue;
      const name = cells[0].toLowerCase();
      if (!(name in DEFAULT_KNOBS)) continue;
      if (rows.has(name)) {
        problems.push(`knob ${name} given twice, first wins`);
        continue;
      }
      rows.set(name, { value: cells[1], since: cells[2] || '' });
    }
  }
  const sinceDates = [];
  const sinceRefs = [];
  for (const name of Object.keys(DEFAULT_KNOBS)) {
    const def = DEFAULT_KNOBS[name];
    const row = rows.get(name);
    if (!row) {
      knobs[name] = def;
      problems.push(`knob ${name} missing, using default ${fmtKnob(def)}`);
      continue;
    }
    if (row.since) {
      const s = SINCE_RE.exec(row.since);
      if (!s || !isValidDate(s[1])) problems.push(`knob ${name} since "${row.since}" is not a date`);
      else {
        sinceDates.push(s[1]);
        if (s[2]) sinceRefs.push({ name, id: Number(s[2]) });
      }
    }
    if (name === 'test domains') {
      const list = row.value.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
      if (list.length === 0) {
        knobs[name] = def;
        problems.push(`knob ${name} empty, using default ${fmtKnob(def)}`);
      } else {
        knobs[name] = list;
      }
      continue;
    }
    const num = Number(row.value.replace(/%$/, '').trim());
    if (row.value.trim() === '' || !Number.isFinite(num)) {
      knobs[name] = def;
      problems.push(`knob ${name} value "${row.value}" is not a number, using default ${fmtKnob(def)}`);
    } else {
      knobs[name] = num;
    }
  }
  // The system's start: the earliest valid `since` date in the table (default 2026-11-07).
  // Checks that look back over weeks only count weeks from this one on.
  knobs.since = sinceDates.sort()[0] || '2026-11-07';
  knobs.sinceRefs = sinceRefs;
  return { knobs, problems };
}

function fmtKnob(v) {
  return Array.isArray(v) ? v.join(', ') : String(v);
}

// ---------------------------------------------------------------------------
// Ledger

// Settle verbs. held: the call was what was needed. missed: the right model was on the list and
// another was chosen. blind: the right model was never on the list. moot: never found out.
const VERBS = new Set(['held', 'missed', 'moot', 'blind']);
const MISS_VERBS = new Set(['missed', 'blind']);
// Loose prefix: anything that looks like it wants to be a c-line. If it then fails the strict
// grammar below it is a problem, not silently ignored.
const LOOSE_RE = /^\s*(?:[-*]\s*)?(?:\d{4}-\d{2}-\d{2}\s+)?c\d/;
// Strict grammar: optional "- " or "* ", optional date, c<id> (1..9 digits, no leading zero), whitespace, rest.
const LINE_RE = /^\s*(?:[-*]\s+)?(?:(\d{4}-\d{2}-\d{2})\s+)?c([1-9]\d{0,8})\s+(.*)$/;
const SETTLE_RE = /^(held|missed|moot|blind)(?::\s*(.*))?$/;
const CALL_RE = /^([a-z][a-z0-9-]*):\s*(.*)$/;
const CONF_RE = /^(?:(.*\S)\s+)?(\d{1,3})%?$/;
const FENCE_RE = /^\s*(`{3,}|~{3,})/;
// Id-less forms: the first token is a verb, or a domain token immediately followed by ": ".
const BARE_SETTLE_RE = /^\s*(?:[-*]\s+)?(?:(\d{4}-\d{2}-\d{2})\s+)?(held|missed|moot|blind)(?::\s*(.*))?$/;
const BARE_CALL_RE = /^\s*(?:[-*]\s+)?(?:(\d{4}-\d{2}-\d{2})\s+)?([a-z][a-z0-9-]*): (.*)$/;
// Where an id token goes when one is inserted: after whitespace, marker and date.
const PREFIX_RE = /^(\s*(?:[-*]\s+)?(?:\d{4}-\d{2}-\d{2}\s+)?)/;

export function isMissVerb(verb) {
  return MISS_VERBS.has(verb);
}

export function citationsIn(text, selfId) {
  const out = [];
  const seen = new Set();
  const re = /\bc([1-9]\d{0,8})\b/g;
  let m;
  while ((m = re.exec(text || '')) !== null) {
    const id = Number(m[1]);
    if (id === selfId || seen.has(id)) continue; // self-citation is ignored silently
    seen.add(id);
    out.push(id);
  }
  return out;
}

// Returns { calls, settles, problems, assigned }. calls/settles are in file order, with lineNo
// (1-based) and typedDate (string or null). Duplicate ids keep the first call; later ones are problems.
// call.text is the text exactly as typed after the domain colon (confidence included);
// call.conf is the parsed trailing confidence, or null.
// Lines without an id: a call gets max explicit id + 1, + 2, ... in file order (1 if there are no
// explicit ids); a bare settle takes the id of the nearest call above it that is still unsettled at
// that point of the file. Those lines are listed in `assigned` ({ lineNo, id, kind }) so the write
// modes can put the id into calls.md (numberLedger).
export function parseLedger(text) {
  const calls = [];
  const settles = [];
  const problems = [];
  const assigned = [];
  const ids = new Set();
  const lines = String(text || '').replace(/^\uFEFF/, '').split(/\r?\n/);

  // Walk the lines outside code fences. Returns the fence left open, if any.
  const walk = (fn) => {
    let fence = null; // { marker: '`' | '~', lineNo }
    lines.forEach((raw, i) => {
      const lineNo = i + 1;
      const line = raw.replace(/\s+$/, '');
      const f = FENCE_RE.exec(line);
      if (f) {
        const marker = f[1][0];
        if (!fence) fence = { marker, lineNo };
        else if (fence.marker === marker) fence = null;
        return;
      }
      if (fence) return;
      fn(line, lineNo);
    });
    return fence;
  };

  // Pass 1: the highest explicit call id decides where assigned ids start.
  let maxExplicit = 0;
  walk((line) => {
    const m = LINE_RE.exec(line);
    if (!m) return;
    const c = CALL_RE.exec(m[3].trim());
    if (c && !VERBS.has(c[1])) maxExplicit = Math.max(maxExplicit, Number(m[2]));
  });
  let nextAssigned = maxExplicit + 1;

  // Pass 2: the lines themselves.
  const settledSoFar = new Set();
  const pushCall = (id, domain, ctext, lineNo, typedDate, line) => {
    let conf = null;
    const k = CONF_RE.exec(ctext);
    if (k && Number(k[2]) <= 100) conf = Number(k[2]);
    if (ids.has(id)) {
      problems.push({ lineNo, text: line.trim(), kind: 'duplicate', id, message: `line ${lineNo}: duplicate id c${id}: ${line.trim()}` });
      return false;
    }
    ids.add(id);
    calls.push({ id, domain, text: ctext, conf, lineNo, typedDate, citations: citationsIn(ctext, id) });
    return true;
  };
  const pushSettle = (id, verdict, stext, lineNo, typedDate) => {
    settles.push({ id, verdict, text: stext, lineNo, typedDate, citations: citationsIn(stext, id) });
    settledSoFar.add(id);
  };
  const fence = walk((line, lineNo) => {
    if (LOOSE_RE.test(line)) {
      const m = LINE_RE.exec(line);
      if (!m) {
        problems.push({ lineNo, text: line.trim(), kind: 'unparsable', message: `line ${lineNo}: unparsable c-line: ${line.trim()}` });
        return;
      }
      const typedDate = m[1] || null;
      const id = Number(m[2]);
      const rest = m[3].trim();
      if (typedDate && !isValidDate(typedDate)) {
        problems.push({ lineNo, text: line.trim(), kind: 'unparsable', message: `line ${lineNo}: bad date: ${line.trim()}` });
        return;
      }
      const sm = SETTLE_RE.exec(rest);
      if (sm) {
        pushSettle(id, sm[1], (sm[2] || '').trim(), lineNo, typedDate);
        return;
      }
      const c = CALL_RE.exec(rest);
      if (c && !VERBS.has(c[1])) {
        pushCall(id, c[1], c[2].trim(), lineNo, typedDate, line);
        return;
      }
      problems.push({ lineNo, text: line.trim(), kind: 'unparsable', message: `line ${lineNo}: unparsable c-line: ${line.trim()}` });
      return;
    }
    const bs = BARE_SETTLE_RE.exec(line);
    if (bs) {
      const typedDate = bs[1] || null;
      if (typedDate && !isValidDate(typedDate)) {
        problems.push({ lineNo, text: line.trim(), kind: 'unparsable', message: `line ${lineNo}: bad date: ${line.trim()}` });
        return;
      }
      const target = [...calls].reverse().find((c) => !settledSoFar.has(c.id));
      if (!target) {
        problems.push({ lineNo, text: line.trim(), kind: 'orphan', message: `settle on line ${lineNo} has no open call above it` });
        return;
      }
      pushSettle(target.id, bs[2], (bs[3] || '').trim(), lineNo, typedDate);
      assigned.push({ lineNo, id: target.id, kind: 'settle' });
      return;
    }
    const bc = BARE_CALL_RE.exec(line);
    if (bc) {
      const typedDate = bc[1] || null;
      if (typedDate && !isValidDate(typedDate)) {
        problems.push({ lineNo, text: line.trim(), kind: 'unparsable', message: `line ${lineNo}: bad date: ${line.trim()}` });
        return;
      }
      const id = nextAssigned++;
      if (pushCall(id, bc[2], bc[3].trim(), lineNo, typedDate, line)) assigned.push({ lineNo, id, kind: 'call' });
    }
  });
  if (fence) {
    problems.push({ lineNo: fence.lineNo, text: '', kind: 'fence', message: `code fence opened at line ${fence.lineNo} never closes; lines after it were ignored` });
  }
  for (const st of settles) {
    if (!ids.has(st.id)) {
      problems.push({ lineNo: st.lineNo, text: st.text, kind: 'unknown', id: st.id, message: `line ${st.lineNo}: settle for unknown id c${st.id}` });
    }
  }
  for (const item of [...calls, ...settles]) {
    for (const m of item.citations) {
      if (!ids.has(m)) {
        problems.push({ lineNo: item.lineNo, text: item.text, kind: 'badcite', id: item.id, cites: m, message: `c${item.id} cites c${m}, which does not exist` });
      }
    }
  }
  problems.sort((a, b) => a.lineNo - b.lineNo);
  return { calls, settles, problems, assigned };
}

// Puts "c<N> " in front of the domain token or verb of every id-less line, changing nothing else:
// same line endings, BOM kept, trailing newline untouched. Returns { text, inserted: [{ lineNo, id }] }.
// Removing every inserted token gives the original text back.
export function numberLedger(text) {
  const src = String(text || '');
  const ledger = parseLedger(src);
  if (!ledger.assigned.length) return { text: src, inserted: [] };
  const lines = src.split('\n'); // keeps any '\r' on the line, so CRLF files stay CRLF
  const inserted = [];
  for (const a of [...ledger.assigned].sort((x, y) => x.lineNo - y.lineNo)) {
    const i = a.lineNo - 1;
    const prefix = PREFIX_RE.exec(lines[i])[1]; // \s* also covers the BOM on line 1
    lines[i] = `${prefix}c${a.id} ${lines[i].slice(prefix.length)}`;
    inserted.push({ lineNo: a.lineNo, id: a.id });
  }
  return { text: lines.join('\n'), inserted };
}

// lineDates: Map lineNo -> 'YYYY-MM-DD' | null (null = uncommitted), or null when git failed.
// Sets .date and .dateSource on every call and settle. Returns counts.
export function assignDates(ledger, lineDates, today) {
  const counts = { typed: 0, git: 0, today: 0 };
  for (const item of [...ledger.calls, ...ledger.settles]) {
    if (item.typedDate) {
      item.date = item.typedDate;
      item.dateSource = 'typed';
      counts.typed++;
      continue;
    }
    const fromGit = lineDates ? lineDates.get(item.lineNo) : null;
    if (fromGit) {
      item.date = fromGit;
      item.dateSource = 'git';
      counts.git++;
    } else {
      item.date = today;
      item.dateSource = 'today';
      counts.today++;
    }
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Git helpers (pure parsers; the callers live in the CLI section)

// git blame --line-porcelain output -> Map finalLineNo -> date | null (null = uncommitted).
// Accepts 40-hex (SHA-1) and 64-hex (SHA-256) commit hashes.
export function parseBlame(porcelain) {
  const map = new Map();
  let lineNo = null;
  let hash = null;
  let time = null;
  for (const line of String(porcelain).split(/\r?\n/)) {
    const h = /^([0-9a-f]{40}|[0-9a-f]{64}) \d+ (\d+)(?: \d+)?$/.exec(line);
    if (h) {
      hash = h[1];
      lineNo = Number(h[2]);
      time = null;
      continue;
    }
    if (line.startsWith('author-time ')) {
      time = Number(line.slice('author-time '.length));
      continue;
    }
    if (line.startsWith('\t') && lineNo !== null) {
      const uncommitted = /^0+$/.test(hash) || !Number.isFinite(time);
      map.set(lineNo, uncommitted ? null : epochToDate(time));
      lineNo = null;
    }
  }
  return map;
}

// git log --format=%ct --name-only output -> Map weekMonday -> commit count.
export function parseCommitWeeks(logText) {
  const map = new Map();
  for (const line of String(logText).split(/\r?\n/)) {
    if (/^\d+$/.test(line.trim())) {
      const wk = weekStart(epochToDate(Number(line.trim())));
      map.set(wk, (map.get(wk) || 0) + 1);
    }
  }
  return map;
}

// ---------------------------------------------------------------------------
// Readout model

const MATH_FROM = '2026-11-09';
const ARRIVAL_BY = '2027-01-18';
const TEST_DOMAIN_DATES = { mie312: '2026-11-12', putnam: '2026-12-05', asic: '2027-01-18' };
const SYSTEM_DOMAIN = 'system'; // calls about the system itself; never dormant, never a test domain
const MIN_N = 5;

// Ordering of calls: "earlier" means by date, then by id. A call dated earlier is earlier; on the
// same date the lower id is earlier. Ids alone do not order calls because dates can be typed in
// later than the line (the Putnam day, say) and git dates follow the commit, not the thought.
export function isBefore(a, b) {
  return a.date < b.date || (a.date === b.date && a.id < b.id);
}

function pct(num, den) {
  return den ? Math.round((100 * num) / den) : null;
}

function mean(xs) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}

function median(xs) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function fmtNum(x, digits = 0) {
  if (x === null || x === undefined) return '-';
  return Number(x).toFixed(digits);
}

// ledger: from parseLedger + assignDates. opts: { today, commitWeeks (Map|null), dateCounts, gitNote, knobProblems }.
export function buildReadout(ledger, knobs, opts) {
  const today = opts.today;
  const commitWeeks = opts.commitWeeks || null;
  const gitOk = commitWeeks !== null;
  const problems = [...ledger.problems.map((p) => p.message), ...(opts.knobProblems || [])];

  const calls = [...ledger.calls].sort((a, b) => a.id - b.id);
  const byId = new Map(calls.map((c) => [c.id, c]));
  // last settle wins (file order)
  for (const s of ledger.settles) {
    const c = byId.get(s.id);
    if (c) c.settle = s;
  }
  const settled = calls.filter((c) => c.settle);
  const open = calls.filter((c) => !c.settle);
  const nonMoot = settled.filter((c) => c.settle.verdict !== 'moot');
  const isMiss = (c) => c.settle && MISS_VERBS.has(c.settle.verdict);
  const window = knobs['settle window days'];

  // Knob since cells that cite a call must cite a system call
  for (const ref of knobs.sinceRefs || []) {
    const c = byId.get(ref.id);
    if (!c || c.domain !== SYSTEM_DOMAIN) problems.push(`knob ${ref.name} since cites c${ref.id}, which is not a system call`);
  }

  // Settle dated before its call: a problem; days to settle clamped to 0.
  for (const c of settled) {
    const raw = daysBetween(c.date, c.settle.date);
    if (raw < 0) {
      problems.push(`c${c.id} settled ${c.settle.date} before it was called ${c.date}`);
      c.daysToSettle = 0;
      c.settledOn = c.date;
    } else {
      c.daysToSettle = raw;
      c.settledOn = c.settle.date;
    }
  }

  // Open calls
  for (const c of open) c.age = daysBetween(c.date, today);
  const openPast = open.filter((c) => c.age > window);

  // First call per domain, by (date, id)
  const firstCall = new Map();
  for (const c of calls) {
    const cur = firstCall.get(c.domain);
    if (!cur || isBefore(c, cur)) firstCall.set(c.domain, c);
  }

  // Made known: a missed or blind call whose id is cited in the call text of a later call
  // (by date, then id) that settled held.
  for (const c of calls) {
    if (!isMiss(c)) continue;
    c.madeKnownBy = calls.filter((x) => isBefore(c, x) && x.settle && x.settle.verdict === 'held' && x.citations.includes(c.id)).map((x) => x.id);
  }

  // Weeks
  const thisWeek = weekStart(today);
  const weekList = [];
  for (let k = 7; k >= 0; k--) weekList.push(addDays(thisWeek, -7 * k));
  const weeks = weekList.map((wk) => {
    const wcalls = calls.filter((c) => weekStart(c.date) === wk);
    const wsettles = settled.filter((c) => weekStart(c.settle.date) === wk);
    const domains = [...new Set([...wcalls, ...wsettles].map((c) => c.domain))].sort();
    return {
      week: wk,
      calls: wcalls.length,
      settles: wsettles.length,
      domains,
      commits: gitOk ? commitWeeks.get(wk) || 0 : null,
    };
  });

  // Arrivals: X is the first call in its domain by (date, id); its call text cites an existing
  // call M that is earlier by (date, id), in another domain, settled on or before X's date;
  // and X itself settled held.
  const arrivals = [];
  for (const x of calls) {
    if (!x.settle || x.settle.verdict !== 'held') continue;
    if (firstCall.get(x.domain) !== x) continue;
    for (const mId of x.citations) {
      const m = byId.get(mId);
      if (!m || !isBefore(m, x) || m.domain === x.domain || !m.settle || m.settle.date > x.date) continue;
      arrivals.push({ domain: x.domain, date: x.date, id: x.id, cites: m.id, citedDomain: m.domain });
      break;
    }
  }

  // Misses: missed and blind, newest settle first
  const misses = settled
    .filter(isMiss)
    .sort((a, b) => (a.settle.date === b.settle.date ? b.id - a.id : a.settle.date < b.settle.date ? 1 : -1));

  // Domains
  const domainNames = [...new Set(calls.map((c) => c.domain))].sort();
  const domains = domainNames.map((d) => {
    const dc = calls.filter((c) => c.domain === d);
    const ds = dc.filter((c) => c.settle);
    const held = ds.filter((c) => c.settle.verdict === 'held').length;
    const missed = ds.filter((c) => c.settle.verdict === 'missed').length;
    const blind = ds.filter((c) => c.settle.verdict === 'blind').length;
    const moot = ds.filter((c) => c.settle.verdict === 'moot').length;
    return {
      domain: d,
      firstCall: firstCall.get(d).date,
      calls: dc.length,
      open: dc.length - ds.length,
      held,
      missed,
      blind,
      moot,
      medianDays: median(ds.map((c) => c.daysToSettle)),
      meanConf: mean(dc.filter((c) => c.conf !== null).map((c) => c.conf)),
      heldPct: pct(held, held + missed + blind),
    };
  });

  // Known: held calls per domain, newest first by call date (then higher id first), with lineage
  const newestFirst = (a, b) => (a.date === b.date ? b.id - a.id : a.date < b.date ? 1 : -1);
  for (const c of calls) {
    c.lineage = c.citations.filter((id) => byId.has(id)).map((id) => ({ id, verb: byId.get(id).settle ? byId.get(id).settle.verdict : 'open' }));
  }
  const known = domainNames
    .map((d) => ({ domain: d, calls: settled.filter((c) => c.domain === d && c.settle.verdict === 'held').sort(newestFirst) }))
    .filter((k) => k.calls.length);

  // Dormant: domains whose last call is older than the knob (system excluded), and misses no
  // later call cites within it
  const dormantWeeks = knobs['dormant weeks'];
  const dormantDays = dormantWeeks * 7;
  const dormantDomains = domainNames
    .filter((d) => d !== SYSTEM_DOMAIN)
    .map((d) => {
      const last = calls.filter((c) => c.domain === d).map((c) => c.date).sort().pop();
      const days = daysBetween(last, today);
      return { domain: d, lastCall: last, days, weeks: Math.floor(days / 7) };
    })
    .filter((d) => d.days > dormantDays)
    .sort((a, b) => (a.lastCall === b.lastCall ? a.domain.localeCompare(b.domain) : a.lastCall < b.lastCall ? -1 : 1));
  const dormantMisses = misses.filter((miss) => {
    const citing = calls.filter((c) => isBefore(miss, c) && c.citations.includes(miss.id)).map((c) => c.date).sort();
    if (!citing.length) return true;
    return daysBetween(citing[citing.length - 1], today) > dormantDays;
  });

  // Verdict rows
  const verdict = [];
  const row = (check, value, target, state) => verdict.push({ check, value: String(value), target, state });

  const callsThisWeek = calls.filter((c) => weekStart(c.date) === thisWeek).length;
  row('calls this week any', callsThisWeek, '>= 1', callsThisWeek >= 1 ? 'ok' : 'not yet');

  const mathWeek = calls.filter((c) => weekStart(c.date) === thisWeek && (c.domain === 'math' || c.domain === 'putnam')).length;
  const mathKnob = knobs['math calls per week'];
  if (thisWeek < weekStart(MATH_FROM)) row('math+putnam this week', mathWeek, `>= ${mathKnob} from ${MATH_FROM}`, 'n/a');
  else row('math+putnam this week', mathWeek, `>= ${mathKnob}`, mathWeek >= mathKnob ? 'ok' : 'not yet');

  row('open past window', openPast.length, `0 (window ${window} d)`, openPast.length === 0 ? 'ok' : 'off');

  const mootN = settled.filter((c) => c.settle.verdict === 'moot').length;
  const mootShare = pct(mootN, settled.length);
  const mootMax = knobs['moot share max'];
  if (settled.length < MIN_N) row('moot share', `${settled.length} settled`, `<= ${mootMax} % (n/a under ${MIN_N} settled)`, 'n/a');
  else row('moot share', `${mootShare} % of ${settled.length}`, `<= ${mootMax} %`, mootShare <= mootMax ? 'ok' : 'off');

  const lo = knobs['miss rate low'];
  const hi = knobs['miss rate high'];
  const missRow = (label, set) => {
    const missed = set.filter(isMiss).length;
    if (set.length < MIN_N) {
      row(label, `${set.length} settled non-moot`, `${lo} to ${hi} % (n/a under ${MIN_N})`, 'n/a');
      return;
    }
    const rate = pct(missed, set.length);
    row(label, `${rate} % of ${set.length}`, `${lo} to ${hi} %`, rate >= lo && rate <= hi ? 'ok' : 'off');
  };
  missRow('miss rate all time', nonMoot);
  const since30 = addDays(today, -30);
  missRow('miss rate last 30 d', nonMoot.filter((c) => c.settledOn >= since30));

  const withConf = nonMoot.filter((c) => c.conf !== null);
  const gapKnob = knobs['calibration gap points'];
  if (withConf.length < MIN_N) {
    row('calibration gap', `${withConf.length} settled with conf`, `<= ${gapKnob} (n/a under ${MIN_N})`, 'n/a');
  } else {
    const meanConf = mean(withConf.map((c) => c.conf));
    const heldPct = pct(withConf.filter((c) => c.settle.verdict === 'held').length, withConf.length);
    const gap = Math.abs(meanConf - heldPct);
    row('calibration gap', `${fmtNum(gap)} (mean conf ${fmtNum(meanConf)}, held ${heldPct} %)`, `<= ${gapKnob}`, gap <= gapKnob ? 'ok' : 'off');
  }

  const citeKnob = knobs['citations per month'];
  const thisMonth = monthOf(today);
  const firstMonth = calls.length ? monthOf(calls.map((c) => c.date).sort()[0]) : null;
  let citations = 0;
  for (const c of calls) {
    if (monthOf(c.date) !== thisMonth || !c.settle || c.settle.verdict !== 'held') continue;
    citations += c.citations.filter((id) => byId.has(id) && isBefore(byId.get(id), c)).length;
  }
  if (firstMonth === null || firstMonth === thisMonth) {
    row('citations this month', citations, `>= ${citeKnob} (n/a in the first month)`, 'n/a');
  } else {
    row('citations this month', citations, `>= ${citeKnob}`, citations >= citeKnob ? 'ok' : 'not yet');
  }

  row('arrivals', arrivals.length, `>= 1 by ${ARRIVAL_BY}`, arrivals.length >= 1 ? 'ok' : 'not yet');

  const blinds = settled.filter((c) => c.settle.verdict === 'blind');
  const blindKnown = blinds.filter((c) => c.madeKnownBy.length).length;
  row(
    'blind made known',
    `${blindKnown} of ${blinds.length} blind`,
    'every blind cited later by a call that held',
    blinds.length === 0 ? 'n/a' : blindKnown === blinds.length ? 'ok' : 'not yet'
  );

  const testDomains = (knobs['test domains'] || DEFAULT_KNOBS['test domains']).filter((d) => d !== SYSTEM_DOMAIN);
  const testValue = testDomains.map((d) => `${d} ${firstCall.has(d) ? firstCall.get(d).date : 'none'}`).join('; ');
  const testTarget = `a call in each before its date (${testDomains.map((d) => `${d} ${TEST_DOMAIN_DATES[d] || 'no date'}`).join(', ')})`;
  row('test domains first call', testValue, testTarget, testDomains.every((d) => firstCall.has(d)) ? 'ok' : 'not yet');

  const dormantState = settled.length === 0 ? 'not yet' : dormantDomains.length === 0 && dormantMisses.length === 0 ? 'ok' : 'off';
  row('dormant', `${dormantDomains.length} domains, ${dormantMisses.length} misses`, `0 (over ${dormantWeeks} weeks)`, dormantState);

  if (!gitOk) {
    row('silent weeks in last 8', '?', '0 (n/a, no git)', 'n/a');
  } else {
    // Only completed weeks (Sunday before today) from the system's start week on.
    const startWeek = weekStart(knobs.since || '2026-11-07');
    const silent = weeks.filter((w) => w.week >= startWeek && addDays(w.week, 6) < today && w.commits > 0 && w.calls === 0).length;
    row('silent weeks in last 8', silent, `0 (completed weeks from ${startWeek})`, silent === 0 ? 'ok' : 'off');
  }

  const nextId = calls.length ? Math.max(...calls.map((c) => c.id)) + 1 : 1;

  return {
    today,
    dateCounts: opts.dateCounts || { typed: 0, git: 0, today: 0 },
    gitNote: opts.gitNote || '',
    verdict,
    nextId,
    calls,
    byId,
    open,
    openPast: new Set(openPast.map((c) => c.id)),
    arrivals,
    misses,
    known,
    dormant: { weeks: dormantWeeks, domains: dormantDomains, misses: dormantMisses },
    domains,
    firstCalls: firstCall,
    weeks,
    problems,
    window,
  };
}

// ---------------------------------------------------------------------------
// Rendering

function table(headers, rows) {
  const out = [`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`];
  for (const r of rows) out.push(`| ${r.join(' | ')} |`);
  return out.join('\n');
}

export function renderVerdict(model) {
  return table(['check', 'value', 'target', 'state'], model.verdict.map((r) => [r.check, r.value, r.target, r.state]));
}

function lineageSuffix(c) {
  return c.lineage && c.lineage.length ? ` via ${c.lineage.map((l) => `c${l.id} (${l.verb})`).join(', ')}` : '';
}

export function renderReadout(model) {
  const dc = model.dateCounts;
  const out = [];
  out.push(`Generated by tally.mjs on ${model.today}. Not Adit's words. Delete freely.`);
  out.push(`Dates: ${dc.typed} typed, ${dc.git} from git, ${dc.today} assumed today.${model.gitNote ? ' ' + model.gitNote : ''}`);
  out.push('');
  out.push('## Verdict');
  out.push(renderVerdict(model));
  out.push('');
  out.push('## Next id');
  out.push(`c${model.nextId}`);
  out.push('');
  out.push('## Open');
  if (!model.open.length) out.push('none');
  else {
    const sorted = [...model.open].sort((a, b) => (isBefore(a, b) ? -1 : 1));
    for (const c of sorted) {
      const head = `c${c.id} ${c.domain} (${c.date}, ${c.age} d)`;
      out.push(model.openPast.has(c.id) ? `- ask: ${head} held, missed or moot? ${c.text}` : `- ${head}: ${c.text}`);
    }
  }
  out.push('');
  out.push('## Arrivals');
  if (!model.arrivals.length) out.push('none');
  else for (const a of model.arrivals) out.push(`- ${a.domain} ${a.date} c${a.id} cites c${a.cites} (${a.citedDomain})`);
  out.push('');
  out.push('## Misses');
  if (!model.misses.length) out.push('none');
  else for (const c of model.misses) out.push(`- c${c.id} ${c.domain} (${c.date}) ${c.settle.verdict}: ${c.text} -> ${c.settle.text || '(no text)'}`);
  out.push('');
  out.push('## Known');
  if (!model.known.length) out.push('none');
  else {
    for (const k of model.known) {
      out.push(k.domain);
      for (const c of k.calls) out.push(`- c${c.id} (${c.date}): ${c.text}${lineageSuffix(c)}`);
    }
  }
  out.push('');
  out.push('## Dormant');
  out.push(`Domains quiet for more than ${model.dormant.weeks} weeks:`);
  if (!model.dormant.domains.length) out.push('none');
  else for (const d of model.dormant.domains) out.push(`- ${d.domain}: last call ${d.lastCall}, ${d.weeks} weeks`);
  out.push(`Misses not cited by a later call in ${model.dormant.weeks} weeks:`);
  if (!model.dormant.misses.length) out.push('none');
  else for (const c of model.dormant.misses) out.push(`- c${c.id} ${c.domain} (settled ${c.settle.date}): ${c.settle.text}`);
  out.push('');
  out.push('## Domains');
  if (!model.domains.length) out.push('no calls yet');
  else {
    out.push(
      table(
        ['domain', 'first call', 'calls', 'open', 'held', 'missed', 'blind', 'moot', 'median days to settle', 'mean conf', 'held %'],
        model.domains.map((d) => [
          d.domain,
          d.firstCall,
          d.calls,
          d.open,
          d.held,
          d.missed,
          d.blind,
          d.moot,
          d.medianDays === null ? '-' : fmtNum(d.medianDays, Number.isInteger(d.medianDays) ? 0 : 1),
          fmtNum(d.meanConf),
          d.heldPct === null ? '-' : String(d.heldPct),
        ])
      )
    );
  }
  out.push('');
  out.push('## Weeks');
  out.push(
    table(
      ['week', 'calls', 'settles', 'domains touched', 'project commits'],
      model.weeks.map((w) => [w.week, w.calls, w.settles, w.domains.length ? w.domains.join(', ') : '-', w.commits === null ? '?' : w.commits])
    )
  );
  out.push('');
  out.push('## Problems');
  if (!model.problems.length) out.push('none');
  else for (const p of model.problems) out.push(`- ${p}`);
  out.push('');
  return out.join('\n');
}

// One-shot for tests and the CLI: text in, readout out. No git, no files.
// opts: { today, lineDates (Map|null), commitWeeks (Map|null), gitNote }
export function tally(callsText, readmeText, opts = {}) {
  const today = opts.today || localToday();
  const ledger = parseLedger(callsText);
  const dateCounts = assignDates(ledger, opts.lineDates ?? null, today);
  const { knobs, problems: knobProblems } = parseKnobs(readmeText);
  const model = buildReadout(ledger, knobs, {
    today,
    commitWeeks: opts.commitWeeks ?? null,
    dateCounts,
    gitNote: opts.gitNote || '',
    knobProblems,
  });
  return { model, text: renderReadout(model), problems: model.problems, knobs, ledger };
}

// ---------------------------------------------------------------------------
// Nudges: the only interruptions the system may make. Two shapes, quoting his lines only.
//   N1 "dormant: ..." once per calendar day, when there are new calls and something is dormant.
//   N2 "c<new> resembles c<old> (...). Not cited." per new call that reads like an earlier miss.

const STOP_WORDS = new Set(('that this with from when then than will would have been into over under only also just more most same each ' +
  'which what where enough before after about between because while their there these those your mine').split(' '));

export function tokens(text) {
  const out = new Set();
  for (const w of String(text || '').toLowerCase().match(/[a-z0-9]+/g) || []) {
    if (w.length < 4 || /^\d+$/.test(w) || STOP_WORDS.has(w)) continue;
    out.add(w);
  }
  return out;
}

export function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
}

// "## Next id" of a previous readout.md, or null.
export function parseReadoutNextId(text) {
  const m = /^## Next id\r?\nc(\d+)/m.exec(String(text || ''));
  return m ? Number(m[1]) : null;
}

// Header date of a previous nudge.md, or null.
export function parseNudgeDate(text) {
  const m = /^Generated by tally\.mjs on (\d{4}-\d{2}-\d{2})/.exec(String(text || ''));
  return m ? m[1] : null;
}

// model: from buildReadout. prev: { nextId: number|null, nudgeDate: 'YYYY-MM-DD'|null }.
// opts: { today }. Returns the nudge lines (possibly empty).
export function computeNudges(model, prev, knobs, opts = {}) {
  const today = opts.today || model.today;
  const prevNext = prev && Number.isFinite(prev.nextId) ? prev.nextId : null;
  const newCalls = prevNext === null ? [] : model.calls.filter((c) => c.id >= prevNext);
  const lines = [];

  // N1: dormant, at most once per calendar day, only when something new was written
  if (newCalls.length && (!prev || prev.nudgeDate !== today)) {
    for (const d of model.dormant.domains) lines.push(`dormant: ${d.domain}: last call ${d.lastCall}, ${d.weeks} weeks`);
    for (const c of model.dormant.misses) lines.push(`dormant: c${c.id} ${c.domain} (${c.settle.verdict} ${c.settle.date}): ${c.settle.text}`);
  }

  // N2: resemblance to an earlier missed or blind call that the new call does not cite
  const threshold = Number(knobs['resemblance'] ?? DEFAULT_KNOBS['resemblance']);
  const old = model.calls.filter((c) => c.settle && MISS_VERBS.has(c.settle.verdict));
  for (const n of newCalls) {
    const nt = tokens(n.text);
    const hits = [];
    for (const o of old) {
      if (o.id === n.id || n.citations.includes(o.id)) continue;
      const score = jaccard(nt, tokens(`${o.text} ${o.settle.text}`)) * 100;
      if (score >= threshold) hits.push({ o, score });
    }
    hits.sort((a, b) => b.score - a.score || a.o.id - b.o.id);
    for (const { o } of hits.slice(0, 2)) {
      lines.push(`c${n.id} resembles c${o.id} (${o.settle.verdict} ${o.settle.date}: ${o.settle.text}). Not cited.`);
    }
  }
  return lines;
}

export function renderNudge(lines, now) {
  return `Generated by tally.mjs on ${now}. Not Adit's words. Delete freely.\n${lines.length ? lines.join('\n') : 'nothing'}\n`;
}

// What --check prints: the problems, then the id-less lines (informational, not problems).
export function renderCheck(problems, ledger, callsText) {
  const out = [problems.length ? problems.map((p) => `- ${p}`).join('\n') : 'none'];
  const assigned = (ledger && ledger.assigned) || [];
  if (assigned.length) {
    const lines = String(callsText || '').replace(/^\uFEFF/, '').split(/\r?\n/);
    out.push('Unnumbered (will be numbered on the next run):');
    for (const a of [...assigned].sort((x, y) => x.lineNo - y.lineNo)) out.push(`- line ${a.lineNo}: ${(lines[a.lineNo - 1] || '').trim()}`);
  }
  return out.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// CLI

const USAGE = 'usage: node tally.mjs [--check | --stdout | --nudge | --watch [--no-toast]] [--today=YYYY-MM-DD]';
const BLAME_NOTE = 'calls.md is not committed yet, or git is unavailable; undated lines assumed today.';
const TOAST_APP_ID = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\\WindowsPowerShell\\v1.0\\powershell.exe';

function findRepoRoot(start) {
  let dir = start;
  for (;;) {
    if (existsSync(path.join(dir, '.git'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
}

// Returns { check, stdout, nudge, watch, noToast, today } or { error }.
export function parseArgs(argv, env = {}) {
  const opts = { check: false, stdout: false, nudge: false, watch: false, noToast: false, today: env.TALLY_TODAY || null };
  for (const a of argv) {
    if (a === '--check') opts.check = true;
    else if (a === '--stdout') opts.stdout = true;
    else if (a === '--nudge') opts.nudge = true;
    else if (a === '--watch') opts.watch = true;
    else if (a === '--no-toast') opts.noToast = true;
    else if (a.startsWith('--today=')) opts.today = a.slice('--today='.length);
    else return { error: `unknown argument: ${a}` };
  }
  if (opts.today && !isValidDate(opts.today)) return { error: `bad --today value: ${opts.today}` };
  return opts;
}

function showToast(title, body) {
  const script = [
    '[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null',
    '[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null',
    '$t = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)',
    "$n = $t.GetElementsByTagName('text')",
    '$n.Item(0).AppendChild($t.CreateTextNode($env:CALLS_TOAST_TITLE)) | Out-Null',
    '$n.Item(1).AppendChild($t.CreateTextNode($env:CALLS_TOAST_BODY)) | Out-Null',
    '$toast = [Windows.UI.Notifications.ToastNotification]::new($t)',
    '[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($env:CALLS_TOAST_APPID).Show($toast)',
  ].join('; ');
  try {
    execFile(
      'powershell',
      ['-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden', '-Command', script],
      { env: { ...process.env, CALLS_TOAST_TITLE: title, CALLS_TOAST_BODY: body, CALLS_TOAST_APPID: TOAST_APP_ID }, windowsHide: true },
      () => {}
    );
  } catch {
    // toasts are best effort
  }
}

function readCalls(here) {
  const callsPath = path.join(here, 'calls.md');
  return existsSync(callsPath) ? readFileSync(callsPath, 'utf8') : '';
}

function sha1(text) {
  return createHash('sha1').update(text, 'utf8').digest('hex');
}

// Reads git, builds the model from callsText. Returns { model, text, problems, knobs, ledger }.
function runTally(here, today, callsText) {
  const callsPath = path.join(here, 'calls.md');
  const readmePath = path.join(here, 'README.md');
  const readmeText = existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : null;

  const repoRoot = findRepoRoot(here);
  const notes = [];
  let lineDates = null;
  let commitWeeks = null;
  if (!repoRoot) {
    notes.push(BLAME_NOTE);
  } else {
    try {
      const rel = path.relative(repoRoot, callsPath).split(path.sep).join('/');
      lineDates = parseBlame(git(['blame', '--line-porcelain', '--', rel], repoRoot));
    } catch {
      notes.push(BLAME_NOTE);
    }
    try {
      commitWeeks = parseCommitWeeks(git(['log', '--since=9 weeks ago', '--format=%ct', '--name-only', '--', 'content/projects'], repoRoot));
    } catch {
      notes.push('git log failed; project commits unknown.');
    }
  }
  return tally(callsText, readmeText, { today, lineDates, commitWeeks, gitNote: notes.join(' ') });
}

// Numbers id-less lines in calls.md when asked. Returns { callsText, numbered, wrote }.
function numberCalls(here, writeBack) {
  const callsPath = path.join(here, 'calls.md');
  let callsText = readCalls(here);
  const numbered = numberLedger(callsText);
  let wrote = false;
  if (writeBack && numbered.inserted.length) {
    writeFileSync(callsPath, numbered.text, 'utf8');
    callsText = numbered.text;
    wrote = true;
  }
  return { callsText, numbered, wrote };
}

// One --nudge pass: write readout.md, compute nudges against the previous readout and nudge.md,
// write nudge.md. Returns { lines, body, callsText, numbered, prev }. The watcher passes the
// `prev` of the pass it is redoing after a write-back, so the same calls still count as new.
function runNudge(here, today, { writeBack, prev: prevGiven }) {
  const readoutPath = path.join(here, 'readout.md');
  const nudgePath = path.join(here, 'nudge.md');
  const prev = prevGiven || {
    nextId: existsSync(readoutPath) ? parseReadoutNextId(readFileSync(readoutPath, 'utf8')) : null,
    nudgeDate: existsSync(nudgePath) ? parseNudgeDate(readFileSync(nudgePath, 'utf8')) : null,
  };
  const { callsText, numbered } = numberCalls(here, writeBack);
  const { model, text, knobs } = runTally(here, today, callsText);
  writeFileSync(readoutPath, text, 'utf8');
  const lines = computeNudges(model, prev, knobs, { today });
  const body = renderNudge(lines, localNow());
  writeFileSync(nudgePath, body, 'utf8');
  return { lines, body, callsText, numbered, prev };
}

function runWatch(here, today, noToast) {
  const callsPath = path.join(here, 'calls.md');
  let lastShown = null;
  let passTimer = null;
  let writeTimer = null;
  let lastWrittenHash = null; // our own write of calls.md, so its change event is ignored
  let lastParsed = null; // { text, numbered, prev } from the last pass
  // force: 'start' for the first pass, 'redo' to redo the last pass on the written-back file
  const pass = (force) => {
    passTimer = null;
    if (!force && lastWrittenHash && sha1(readCalls(here)) === lastWrittenHash) return;
    let result;
    try {
      result = runNudge(here, today || localToday(), { writeBack: false, prev: force === 'redo' && lastParsed ? lastParsed.prev : null });
    } catch (e) {
      process.stdout.write(`${localClock()} error: ${e && e.message ? e.message : e}\n`);
      return;
    }
    lastParsed = { text: result.callsText, numbered: result.numbered, prev: result.prev };
    const { lines } = result;
    process.stdout.write(`${localClock()} ${lines.length} nudge${lines.length === 1 ? '' : 's'}\n`);
    const bodyKey = lines.join('\n');
    if (lines.length && bodyKey !== lastShown) {
      lastShown = bodyKey;
      if (!noToast) showToast('Calls', lines[0]);
    }
  };
  // Write ids back only after 2 s without change events, and only if the file still reads as
  // what was parsed; otherwise the next change handles it.
  const writeBack = () => {
    writeTimer = null;
    if (!lastParsed || !lastParsed.numbered.inserted.length) return;
    if (readCalls(here) !== lastParsed.text) return;
    const out = lastParsed.numbered.text;
    lastWrittenHash = sha1(out);
    try {
      writeFileSync(callsPath, out, 'utf8');
    } catch (e) {
      process.stdout.write(`${localClock()} error: ${e && e.message ? e.message : e}\n`);
      return;
    }
    const n = lastParsed.numbered.inserted.length;
    process.stdout.write(`${localClock()} numbered ${n} line${n === 1 ? '' : 's'}\n`);
    pass('redo');
  };
  const schedule = () => {
    if (passTimer) clearTimeout(passTimer);
    passTimer = setTimeout(() => pass(false), 500);
    if (writeTimer) clearTimeout(writeTimer);
    writeTimer = setTimeout(writeBack, 2000);
  };
  let watcher = null;
  try {
    watcher = watch(here, { persistent: true }, (_event, filename) => {
      if (!filename || String(filename).toLowerCase() === 'calls.md') schedule();
    });
    watcher.on('error', () => {
      watchFile(callsPath, { interval: 1000 }, schedule);
    });
  } catch {
    watchFile(callsPath, { interval: 1000 }, schedule);
  }
  process.stdout.write(`watching ${callsPath} (Ctrl-C to stop)\n`);
  pass('start');
  if (lastParsed && lastParsed.numbered.inserted.length) writeTimer = setTimeout(writeBack, 2000);
  process.on('SIGINT', () => {
    if (watcher) watcher.close();
    process.exit(0);
  });
}

function main(argv) {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const readoutPath = path.join(here, 'readout.md');

  const args = parseArgs(argv, process.env);
  if (args.error) {
    process.stderr.write(`${args.error}\n${USAGE}\n`);
    return 2;
  }

  if (args.watch) {
    runWatch(here, args.today, args.noToast);
    return 0;
  }

  const today = args.today || localToday();

  if (args.nudge) {
    const { body } = runNudge(here, today, { writeBack: true });
    process.stdout.write(body);
    return 0;
  }

  if (args.check || args.stdout) {
    const callsText = readCalls(here);
    const { text, problems, ledger } = runTally(here, today, callsText);
    if (args.check) {
      process.stdout.write(renderCheck(problems, ledger, callsText));
      return problems.length ? 1 : 0;
    }
    process.stdout.write(text);
    return 0;
  }

  const { callsText } = numberCalls(here, true);
  const { model, text } = runTally(here, today, callsText);
  writeFileSync(readoutPath, text, 'utf8');
  process.stdout.write(renderVerdict(model) + '\n');
  return 0;
}

function isEntryPoint() {
  try {
    if (!process.argv[1]) return false;
    const a = realpathSync(process.argv[1]);
    const b = realpathSync(fileURLToPath(import.meta.url));
    return process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
  } catch {
    return false;
  }
}

if (isEntryPoint()) {
  process.exitCode = main(process.argv.slice(2));
}
