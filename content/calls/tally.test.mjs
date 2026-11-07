// node --test content/calls/tally.test.mjs  (no git, no files: fixtures are inline and dates are typed)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseLedger, parseKnobs, DEFAULT_KNOBS, weekStart, tally, parseBlame, parseCommitWeeks, assignDates, parseArgs, isBefore } from './tally.mjs';

const TODAY = '2026-11-07';
const README = `
| knob | value | since |
| --- | --- | --- |
| settle window days | 14 | 2026-11-07 |
| math calls per week | 6 | 2026-11-07 |
| miss rate low | 20 | 2026-11-07 |
| miss rate high | 60 | 2026-11-07 |
| calibration gap points | 15 | 2026-11-07 |
| citations per month | 1 | 2026-11-07 |
| moot share max | 25 | 2026-11-07 |
| test domains | putnam, asic | 2026-11-07 |
`;

const HEADINGS = ['## Verdict', '## Next id', '## Open', '## Arrivals', '## Misses', '## Domains', '## Weeks', '## Problems'];

function verdictRow(text, check) {
  const line = text.split('\n').find((l) => l.startsWith(`| ${check} |`));
  assert.ok(line, `verdict row "${check}" present`);
  const cells = line.split('|').slice(1, -1).map((s) => s.trim());
  return { check: cells[0], value: cells[1], target: cells[2], state: cells[3] };
}

test('weekStart on known dates', () => {
  assert.equal(weekStart('2026-11-07'), '2026-11-02'); // Saturday -> Monday
  assert.equal(weekStart('2026-11-09'), '2026-11-09'); // Monday is its own start
  assert.equal(weekStart('2026-11-08'), '2026-11-02'); // Sunday belongs to the previous Monday
  assert.equal(weekStart('2026-01-01'), '2025-12-29'); // year boundary
});

test('both line forms, with and without list markers and dates; text kept as typed', () => {
  const led = parseLedger([
    'c1 furnace: one-D along the axis. 70',
    '- c2 math: pigeonhole on residues. 55%',
    '* 2026-10-01 c3 asic: behavioural inside, as in c1.',
    '  2026-10-02 c4 retro-x: something',
    'c1 missed: radiation matters above 900 C',
    '- c2 held',
    '* 2026-10-05 c3 moot: nobody checked',
    '2026-10-06 c4 held: fine',
  ].join('\n'));
  assert.equal(led.problems.length, 0);
  assert.deepEqual(led.calls.map((c) => [c.id, c.domain, c.conf, c.typedDate]), [
    [1, 'furnace', 70, null],
    [2, 'math', 55, null],
    [3, 'asic', null, '2026-10-01'],
    [4, 'retro-x', null, '2026-10-02'],
  ]);
  assert.equal(led.calls[0].text, 'one-D along the axis. 70');
  assert.equal(led.calls[1].text, 'pigeonhole on residues. 55%');
  assert.deepEqual(led.settles.map((s) => [s.id, s.verdict, s.text, s.typedDate]), [
    [1, 'missed', 'radiation matters above 900 C', null],
    [2, 'held', '', null],
    [3, 'moot', 'nobody checked', '2026-10-05'],
    [4, 'held', 'fine', '2026-10-06'],
  ]);
});

test('conf with and without %, and no conf; text is never re-serialised', () => {
  const led = parseLedger('c1 a: text 70\nc2 a: text 70%\nc3 a: text\nc4 a: text 150\nc5 a: 100');
  assert.deepEqual(led.calls.map((c) => [c.conf, c.text]), [
    [70, 'text 70'],
    [70, 'text 70%'],
    [null, 'text'],
    [null, 'text 150'],
    [100, '100'],
  ]);
});

test('CRLF and BOM tolerated', () => {
  const led = parseLedger('﻿# Calls\r\n\r\nc1 math: a thing 50\r\nc1 held\r\n');
  assert.equal(led.problems.length, 0);
  assert.equal(led.calls.length, 1);
  assert.equal(led.calls[0].conf, 50);
  assert.equal(led.calls[0].text, 'a thing 50');
  assert.equal(led.settles.length, 1);
});

test('fenced code is ignored; prose, headings and blank lines are ignored', () => {
  const led = parseLedger(['# heading', '', 'some prose about calls', '```', 'c9 math: inside a fence 50', 'c9 held', '```', 'c1 math: real 50'].join('\n'));
  assert.equal(led.calls.length, 1);
  assert.equal(led.calls[0].id, 1);
  assert.equal(led.settles.length, 0);
  assert.equal(led.problems.length, 0);
});

test('fences: ~~~ opens too, only the same marker closes, unclosed fence is a problem', () => {
  const led = parseLedger(['c1 a: before', '~~~', 'c2 a: inside', '```', 'c3 a: still inside', '~~~', 'c4 a: after'].join('\n'));
  assert.deepEqual(led.calls.map((c) => c.id), [1, 4]);
  assert.equal(led.problems.length, 0);
  const open = parseLedger(['c1 a: before', '```js', 'c2 a: inside', 'c3 a: inside too'].join('\n'));
  assert.deepEqual(open.calls.map((c) => c.id), [1]);
  assert.deepEqual(open.problems.map((p) => p.message), ['code fence opened at line 2 never closes; lines after it were ignored']);
  const mixed = parseLedger(['```', 'c1 a: x', '~~~', 'c2 a: y'].join('\n'));
  assert.equal(mixed.calls.length, 0);
  assert.equal(mixed.problems.length, 1);
});

test('unparsable c-lines, duplicate ids and unknown-id settles are problems with line numbers', () => {
  const led = parseLedger(['c1 math: fine', 'c1 math: again', 'c2 held', 'c3 nothing here', 'c4 Math: capital domain'].join('\n'));
  assert.equal(led.calls.length, 1);
  const kinds = led.problems.map((p) => [p.lineNo, p.kind]);
  assert.deepEqual(kinds, [
    [2, 'duplicate'],
    [3, 'unknown'],
    [4, 'unparsable'],
    [5, 'unparsable'],
  ]);
  const { text, problems } = tally('c1 math: fine\nc1 math: again\nc2 held', README, { today: TODAY });
  assert.ok(problems.some((p) => p.includes('duplicate id c1')));
  assert.ok(problems.some((p) => p.includes('unknown id c2')));
  assert.ok(text.includes('## Problems\n- line 2: duplicate id c1'));
});

test('anything that starts like a c-line and does not parse is a problem', () => {
  const bad = ['c12held', 'c12held: text', '2026-11-01 c2', '-c2 math: x', 'c01 math: x', 'c1234567890 math: x', 'c3po was here', '* c7', '- 2026-11-01 c8'];
  const led = parseLedger(bad.join('\n'));
  assert.equal(led.calls.length, 0);
  assert.equal(led.settles.length, 0);
  assert.deepEqual(led.problems.map((p) => p.lineNo), bad.map((_, i) => i + 1));
  assert.ok(led.problems.every((p) => p.kind === 'unparsable'));
  assert.equal(led.problems[0].message, 'line 1: unparsable c-line: c12held');
  // the strict forms still parse
  const ok = parseLedger(['c12 math: w', 'c12 held', 'c12 held: text', '- c2 math: x', '* 2026-11-01 c8 math: y', 'c999999999 math: nine digits'].join('\n'));
  assert.equal(ok.problems.length, 0);
  assert.deepEqual(ok.calls.map((c) => c.id), [12, 2, 8, 999999999]);
  assert.equal(ok.settles.length, 2);
  // lines that do not start like a c-line are ignored, not problems
  const ignored = parseLedger(['call c1 was fine', 'see `c<id> domain: ...`', 'cx1 nope', 'c', '2026-11-01c2 x: y'].join('\n'));
  assert.equal(ignored.problems.length, 0);
  assert.equal(ignored.calls.length, 0);
});

test('last settle wins', () => {
  const src = ['2026-10-01 c1 math: thing 50', '2026-10-02 c1 missed: first', '2026-10-03 c1 held: second'].join('\n');
  const { model } = tally(src, README, { today: TODAY });
  assert.equal(model.misses.length, 0);
  assert.equal(model.domains[0].held, 1);
  assert.equal(model.domains[0].missed, 0);
});

test('citations are collected from call text and settle text separately', () => {
  const led = parseLedger('c1 a: base\nc2 b: like c1 and c1 again, not c2 itself\nc2 held: see c1 and c3');
  assert.deepEqual(led.calls[1].citations, [1]);
  assert.deepEqual(led.settles[0].citations, [1, 3]);
});

test('citations to ids that do not exist are problems; self-citation is silent', () => {
  const led = parseLedger(['c1 a: base, unlike c1 itself', 'c2 b: as in c1 and c7', 'c2 held: also c9', 'c3 b: c03 is not a citation'].join('\n'));
  assert.deepEqual(led.calls[0].citations, []);
  assert.deepEqual(led.calls[2].citations, []);
  assert.deepEqual(led.problems.map((p) => p.message), ['c2 cites c7, which does not exist', 'c2 cites c9, which does not exist']);
  const { text } = tally(led.calls.length ? 'c1 a: base\nc2 b: as in c7' : '', README, { today: TODAY });
  assert.ok(text.includes('## Problems\n- c2 cites c7, which does not exist\n'));
});

test('settle dated before its call is a problem and days to settle clamp to 0', () => {
  const src = ['2026-11-01 c1 a: x 50', '2026-10-20 c1 missed: y', '2026-10-01 c2 a: x 50', '2026-10-11 c2 held'].join('\n');
  const { text, model, problems } = tally(src, README, { today: TODAY });
  assert.deepEqual(problems, ['c1 settled 2026-10-20 before it was called 2026-11-01']);
  assert.ok(text.includes('| a | 2026-10-01 | 2 | 0 | 1 | 1 | 0 | 5 | 50 | 50 |')); // median of (0, 10) = 5
  // the clamped settle counts as settled on its call date, inside the last 30 d
  const five = [src, '2026-10-01 c3 a: x', '2026-10-02 c3 held', '2026-10-01 c4 a: x', '2026-10-02 c4 held', '2026-10-01 c5 a: x', '2026-10-02 c5 held'].join('\n');
  const t = tally(five, README, { today: TODAY }).text;
  assert.equal(verdictRow(t, 'miss rate last 30 d').value, '2 settled non-moot');
  assert.equal(model.verdict.length, 11);
});

const ARRIVAL_BASE = ['2026-10-01 c1 furnace: lumped inside 70', '2026-10-05 c1 held'];

test('arrival: positive case', () => {
  const src = [...ARRIVAL_BASE, '2026-10-10 c2 asic: behavioural inside as in c1 60', '2026-10-12 c2 held'].join('\n');
  const { model, text } = tally(src, README, { today: TODAY });
  assert.deepEqual(model.arrivals, [{ domain: 'asic', date: '2026-10-10', id: 2, cites: 1, citedDomain: 'furnace' }]);
  assert.ok(text.includes('## Arrivals\n- asic 2026-10-10 c2 cites c1 (furnace)'));
  assert.equal(verdictRow(text, 'arrivals').state, 'ok');
});

test('arrival negatives: same domain cited', () => {
  const src = [...ARRIVAL_BASE, '2026-10-10 c2 furnace: as in c1 60', '2026-10-12 c2 held'].join('\n');
  assert.equal(tally(src, README, { today: TODAY }).model.arrivals.length, 0);
});

test('arrival negatives: cited call unsettled, or settled after X was called', () => {
  const src = ['2026-10-01 c1 furnace: lumped inside 70', '2026-10-10 c2 asic: as in c1 60', '2026-10-12 c2 held'].join('\n');
  assert.equal(tally(src, README, { today: TODAY }).model.arrivals.length, 0);
  const late = ['2026-10-01 c1 furnace: lumped inside 70', '2026-10-11 c1 held', '2026-10-10 c2 asic: as in c1 60', '2026-10-12 c2 held'].join('\n');
  assert.equal(tally(late, README, { today: TODAY }).model.arrivals.length, 0);
  const sameDay = ['2026-10-01 c1 furnace: lumped inside 70', '2026-10-10 c1 held', '2026-10-10 c2 asic: as in c1 60', '2026-10-12 c2 held'].join('\n');
  assert.equal(tally(sameDay, README, { today: TODAY }).model.arrivals.length, 1);
});

test('arrival negatives: X not held', () => {
  for (const verdict of ['missed: nope', 'moot', '']) {
    const src = [...ARRIVAL_BASE, '2026-10-10 c2 asic: as in c1 60', verdict ? `2026-10-12 c2 ${verdict}` : ''].join('\n');
    assert.equal(tally(src, README, { today: TODAY }).model.arrivals.length, 0, verdict || 'open');
  }
});

test('arrival negatives: X not the first call in its domain', () => {
  const src = [...ARRIVAL_BASE, '2026-10-08 c2 asic: earlier asic call', '2026-10-10 c3 asic: as in c1 60', '2026-10-12 c3 held'].join('\n');
  assert.equal(tally(src, README, { today: TODAY }).model.arrivals.length, 0);
});

test('arrival negatives: citation only in settle text, or citing a later call', () => {
  const src = [...ARRIVAL_BASE, '2026-10-10 c2 asic: no citation 60', '2026-10-12 c2 held: as in c1'].join('\n');
  assert.equal(tally(src, README, { today: TODAY }).model.arrivals.length, 0);
  const src2 = ['2026-10-01 c2 asic: as in c5', '2026-10-02 c2 held', '2026-10-03 c5 furnace: later', '2026-10-04 c5 held'].join('\n');
  assert.equal(tally(src2, README, { today: TODAY }).model.arrivals.length, 0);
});

test('earlier means by date then id: first call per domain and arrivals follow it', () => {
  assert.equal(isBefore({ date: '2026-10-01', id: 9 }, { date: '2026-10-02', id: 1 }), true);
  assert.equal(isBefore({ date: '2026-10-01', id: 1 }, { date: '2026-10-01', id: 2 }), true);
  assert.equal(isBefore({ date: '2026-10-01', id: 2 }, { date: '2026-10-01', id: 1 }), false);
  // c3 has a higher id than c2 but an earlier date, so c3 is the first asic call and c2 is not
  const src = ['2026-10-01 c1 furnace: base 70', '2026-10-02 c1 held', '2026-10-20 c2 asic: as in c1 60', '2026-10-22 c2 held', '2026-10-10 c3 asic: typed in later'].join('\n');
  const { model } = tally(src, README, { today: TODAY });
  assert.equal(model.firstCalls.get('asic').id, 3);
  assert.equal(model.firstCalls.get('furnace').id, 1);
  assert.equal(model.arrivals.length, 0);
  // the cited call may have a higher id as long as it is earlier by date and settled by X's date
  const src2 = ['2026-10-20 c1 asic: as in c5 60', '2026-10-22 c1 held', '2026-10-01 c5 furnace: dated earlier, typed later', '2026-10-02 c5 held'].join('\n');
  const r = tally(src2, README, { today: TODAY }).model;
  assert.deepEqual(r.arrivals, [{ domain: 'asic', date: '2026-10-20', id: 1, cites: 5, citedDomain: 'furnace' }]);
});

test('knobs parse from the README table, with fallback and problems when absent', () => {
  const full = parseKnobs(README);
  assert.equal(full.problems.length, 0);
  assert.equal(full.knobs['settle window days'], 14);
  assert.deepEqual(full.knobs['test domains'], ['putnam', 'asic']);

  const changed = parseKnobs('| settle window days | 21 | 2026-12-01 |\n| test domains | asic |  |');
  assert.equal(changed.knobs['settle window days'], 21);
  assert.deepEqual(changed.knobs['test domains'], ['asic']);
  assert.equal(changed.knobs['miss rate low'], DEFAULT_KNOBS['miss rate low']);
  assert.equal(changed.problems.length, Object.keys(DEFAULT_KNOBS).length - 2);
  assert.ok(changed.problems.includes('knob miss rate low missing, using default 20'));

  const none = parseKnobs(null);
  assert.deepEqual(none.knobs, { ...DEFAULT_KNOBS, since: '2026-11-07' });
  assert.equal(full.knobs.since, '2026-11-07');
  assert.equal(changed.knobs.since, '2026-12-01');
  assert.equal(none.problems.length, 8);
  assert.ok(none.problems.includes('knob test domains missing, using default putnam, asic'));

  const bad = parseKnobs('| miss rate low | abc | 2026-11-07 |');
  assert.equal(bad.knobs['miss rate low'], 20);
  assert.ok(bad.problems.some((p) => p.startsWith('knob miss rate low value "abc"')));
});

test('knobs: invalid since and duplicate rows are problems; first row wins', () => {
  const r = parseKnobs(README + '| settle window days | 99 | 2026-12-01 |\n| miss rate low | 30 | soon |\n');
  assert.equal(r.knobs['settle window days'], 14);
  assert.deepEqual(r.problems, ['knob settle window days given twice, first wins', 'knob miss rate low given twice, first wins']);
  const since = parseKnobs('| miss rate low | 30 | soon |\n| miss rate high | 70 | 2026-13-01 |');
  assert.equal(since.knobs['miss rate low'], 30);
  assert.ok(since.problems.includes('knob miss rate low since "soon" is not a date'));
  assert.ok(since.problems.includes('knob miss rate high since "2026-13-01" is not a date'));
  assert.equal(since.knobs.since, '2026-11-07');
});

test('empty ledger: header, all nine sections, no problems with a full README', () => {
  const { text, problems, model } = tally('', README, { today: TODAY });
  assert.equal(problems.length, 0);
  assert.ok(text.startsWith("Generated by tally.mjs on 2026-11-07. Not Adit's words. Delete freely.\nDates: 0 typed, 0 from git, 0 assumed today."));
  for (const h of HEADINGS) assert.ok(text.includes(`\n${h}\n`), h);
  assert.ok(text.includes('## Next id\nc1\n'));
  assert.ok(text.includes('## Open\nnone\n'));
  assert.ok(text.includes('## Domains\nno calls yet\n'));
  assert.ok(text.includes('## Problems\nnone\n'));
  assert.equal(model.verdict.length, 11);
  assert.deepEqual(model.verdict.map((r) => r.check), [
    'calls this week any', 'math+putnam this week', 'open past window', 'moot share', 'miss rate all time', 'miss rate last 30 d',
    'calibration gap', 'citations this month', 'arrivals', 'test domains first call', 'silent weeks in last 8',
  ]);
  assert.equal(model.weeks.length, 8);
  assert.equal(model.weeks[7].week, '2026-11-02');
  assert.equal(model.weeks[0].week, '2026-09-14');
  assert.ok(text.includes('| 2026-11-02 | 0 | 0 | - | ? |'));
});

test('verdict n/a thresholds on an empty ledger', () => {
  const { text } = tally('', README, { today: TODAY });
  assert.equal(verdictRow(text, 'calls this week any').state, 'not yet');
  assert.equal(verdictRow(text, 'math+putnam this week').state, 'n/a'); // before 2026-11-09
  assert.equal(verdictRow(text, 'open past window').state, 'ok');
  assert.equal(verdictRow(text, 'moot share').state, 'n/a');
  assert.equal(verdictRow(text, 'miss rate all time').state, 'n/a');
  assert.equal(verdictRow(text, 'miss rate last 30 d').state, 'n/a');
  assert.equal(verdictRow(text, 'calibration gap').state, 'n/a');
  assert.equal(verdictRow(text, 'citations this month').state, 'n/a');
  assert.equal(verdictRow(text, 'arrivals').state, 'not yet');
  assert.equal(verdictRow(text, 'test domains first call').state, 'not yet');
  const silent = verdictRow(text, 'silent weeks in last 8');
  assert.equal(silent.state, 'n/a'); // no git
  assert.equal(silent.target, '0 (n/a, no git)');
  assert.ok(verdictRow(text, 'moot share').target.includes('5'));
});

test('verdict: test domains first call', () => {
  const empty = verdictRow(tally('', README, { today: TODAY }).text, 'test domains first call');
  assert.equal(empty.value, 'putnam none; asic none');
  assert.equal(empty.target, 'a call in each before its date (putnam 2026-12-05, asic 2027-01-18)');
  const one = verdictRow(tally('2026-11-20 c2 asic: x\n2026-11-01 c1 asic: y', README, { today: TODAY }).text, 'test domains first call');
  assert.equal(one.value, 'putnam none; asic 2026-11-01');
  assert.equal(one.state, 'not yet');
  const both = verdictRow(tally('2026-11-01 c1 asic: y\n2026-12-05 c2 putnam: z', README, { today: '2026-12-06' }).text, 'test domains first call');
  assert.equal(both.value, 'putnam 2026-12-05; asic 2026-11-01');
  assert.equal(both.state, 'ok');
  const other = verdictRow(tally('c1 math: a', README.replace('putnam, asic', 'math'), { today: TODAY }).text, 'test domains first call');
  assert.equal(other.value, 'math 2026-11-07');
  assert.equal(other.target, 'a call in each before its date (math no date)');
  assert.equal(other.state, 'ok');
});

test('verdict: math+putnam becomes live from the week of 2026-11-09', () => {
  const src = ['2026-11-09 c1 math: a 50', '2026-11-10 c2 putnam: b 50', '2026-11-10 c3 asic: c 50'].join('\n');
  const { text } = tally(src, README, { today: '2026-11-11' });
  const r = verdictRow(text, 'math+putnam this week');
  assert.equal(r.value, '2');
  assert.equal(r.state, 'not yet');
  assert.equal(verdictRow(text, 'calls this week any').state, 'ok');
  const six = Array.from({ length: 6 }, (_, i) => `2026-11-09 c${i + 1} math: a 50`).join('\n');
  assert.equal(verdictRow(tally(six, README, { today: '2026-11-11' }).text, 'math+putnam this week').state, 'ok');
});

test('verdict: settled-count thresholds flip from n/a to a state at 5', () => {
  const four = ['2026-10-01 c1 a: x 50', '2026-10-01 c2 a: x 50', '2026-10-01 c3 a: x 50', '2026-10-01 c4 a: x 50', '2026-10-02 c1 held', '2026-10-02 c2 held', '2026-10-02 c3 missed: y', '2026-10-02 c4 held'];
  let t = tally(four.join('\n'), README, { today: TODAY }).text;
  assert.equal(verdictRow(t, 'moot share').state, 'n/a');
  assert.equal(verdictRow(t, 'miss rate all time').state, 'n/a');
  assert.equal(verdictRow(t, 'calibration gap').state, 'n/a');
  const five = [...four, '2026-10-01 c5 a: x 50', '2026-10-02 c5 held'];
  t = tally(five.join('\n'), README, { today: TODAY }).text;
  assert.equal(verdictRow(t, 'moot share').state, 'ok'); // 0 % moot
  assert.equal(verdictRow(t, 'miss rate all time').state, 'ok'); // 20 % is inside [20, 60]
  assert.equal(verdictRow(t, 'miss rate last 30 d').state, 'n/a'); // settled more than 30 d before today
  assert.equal(verdictRow(t, 'calibration gap').state, 'off'); // |50 - 80| = 30 > 15
  // all misses -> miss rate off
  const allMiss = five.map((l) => l.replace(/held$/, 'missed: z'));
  assert.equal(verdictRow(tally(allMiss.join('\n'), README, { today: TODAY }).text, 'miss rate all time').state, 'off');
  // moot share: 2 of 5 moot = 40 % > 25
  const moots = [...four.slice(0, 7), '2026-10-02 c4 moot', '2026-10-01 c5 a: x 50', '2026-10-02 c5 moot'];
  assert.equal(verdictRow(tally(moots.join('\n'), README, { today: TODAY }).text, 'moot share').state, 'off');
});

test('open calls: oldest first, past-window ones carry the ask, text as typed', () => {
  const src = ['2026-10-01 c1 furnace: old one 60', '2026-11-05 c2 math: fresh one'].join('\n');
  const { text, model } = tally(src, README, { today: TODAY });
  assert.ok(text.includes('## Open\n- ask: c1 furnace (2026-10-01, 37 d) held, missed or moot? old one 60\n- c2 math (2026-11-05, 2 d): fresh one\n'));
  const r = verdictRow(text, 'open past window');
  assert.equal(r.value, '1');
  assert.equal(r.state, 'off');
  assert.equal(model.nextId, 3);
  // exactly at the window edge is not past it
  const edge = tally('2026-10-24 c1 a: x', README, { today: TODAY }).text;
  assert.equal(verdictRow(edge, 'open past window').state, 'ok');
});

test('misses newest first with call text as typed, arrow and settle text', () => {
  const src = ['2026-10-01 c1 furnace: first call 70', '2026-10-03 c1 missed: needed radiation', '2026-10-02 c2 math: second call', '2026-10-05 c2 missed: needed induction'].join('\n');
  const { text } = tally(src, README, { today: TODAY });
  assert.ok(text.includes('## Misses\n- c2 math (2026-10-02): second call -> needed induction\n- c1 furnace (2026-10-01): first call 70 -> needed radiation\n'));
});

test('citations this month: n/a in the first month, counted after', () => {
  const src = ['2026-10-01 c1 furnace: base 50', '2026-10-02 c1 held', '2026-11-03 c2 asic: as in c1 50', '2026-11-04 c2 held'].join('\n');
  const { text } = tally(src, README, { today: TODAY });
  const r = verdictRow(text, 'citations this month');
  assert.equal(r.value, '1');
  assert.equal(r.state, 'ok');
  const firstMonth = tally('2026-11-03 c1 a: x\n2026-11-04 c1 held', README, { today: TODAY }).text;
  assert.equal(verdictRow(firstMonth, 'citations this month').state, 'n/a');
  // a citation on a call that is not held does not count
  const open = tally(['2026-10-01 c1 furnace: base 50', '2026-10-02 c1 held', '2026-11-03 c2 asic: as in c1 50'].join('\n'), README, { today: TODAY }).text;
  assert.equal(verdictRow(open, 'citations this month').value, '0');
});

test('domains and weeks tables', () => {
  const src = ['2026-11-02 c1 math: a 40', '2026-11-04 c1 held', '2026-11-03 c2 math: b 60', '2026-11-05 c2 missed: c', '2026-11-06 c3 asic: d'].join('\n');
  const commitWeeks = new Map([['2026-10-26', 3], ['2026-11-02', 1]]);
  const { text, model } = tally(src, README, { today: TODAY, commitWeeks });
  assert.ok(text.includes('| domain | first call | calls | open | held | missed | moot | median days to settle | mean conf | held % |'));
  assert.ok(text.includes('| math | 2026-11-02 | 2 | 0 | 1 | 1 | 0 | 2 | 50 | 50 |'));
  assert.ok(text.includes('| asic | 2026-11-06 | 1 | 1 | 0 | 0 | 0 | - | - | - |'));
  assert.ok(text.includes('| 2026-11-02 | 3 | 2 | asic, math | 1 |'));
  assert.ok(text.includes('| 2026-10-26 | 0 | 0 | - | 3 |'));
  // The week of 2026-10-26 had commits and no calls, but it is before the system's start
  // week (2026-11-02), so it is not silent. The start week has commits and calls.
  const r = verdictRow(text, 'silent weeks in last 8');
  assert.equal(r.value, '0');
  assert.equal(r.state, 'ok');
  assert.equal(model.weeks.length, 8);
  const quiet = tally('2026-11-02 c1 math: a', README, {
    today: '2026-11-16', commitWeeks: new Map([['2026-10-26', 3], ['2026-11-09', 2]]) });
  const q = verdictRow(quiet.text, 'silent weeks in last 8');
  assert.equal(q.value, '1');
  assert.equal(q.state, 'off');
});

test('silent weeks: the current week is never counted', () => {
  const commitWeeks = new Map([['2026-11-09', 2]]);
  // Saturday 2026-11-14: the week of 11-09 is still running, so it is not silent yet
  const running = verdictRow(tally('2026-11-02 c1 math: a', README, { today: '2026-11-14', commitWeeks }).text, 'silent weeks in last 8');
  assert.equal(running.value, '0');
  assert.equal(running.state, 'ok');
  // Sunday 2026-11-15 is still inside the week
  assert.equal(verdictRow(tally('2026-11-02 c1 math: a', README, { today: '2026-11-15', commitWeeks }).text, 'silent weeks in last 8').value, '0');
  // Monday 2026-11-16: the week is over and it was silent
  assert.equal(verdictRow(tally('2026-11-02 c1 math: a', README, { today: '2026-11-16', commitWeeks }).text, 'silent weeks in last 8').value, '1');
});

test('date sources: typed wins, git next, today last; header counts them', () => {
  const led = parseLedger('2026-10-01 c1 a: x\nc2 a: y\nc3 a: z');
  const lineDates = new Map([[1, '2026-09-01'], [2, '2026-10-15'], [3, null]]);
  const counts = assignDates(led, lineDates, TODAY);
  assert.deepEqual(counts, { typed: 1, git: 1, today: 1 });
  assert.deepEqual(led.calls.map((c) => c.date), ['2026-10-01', '2026-10-15', TODAY]);
  const { text } = tally('2026-10-01 c1 a: x\nc2 a: y', README, { today: TODAY, lineDates: new Map([[2, '2026-10-15']]), gitNote: 'note.' });
  assert.ok(text.includes('Dates: 1 typed, 1 from git, 0 assumed today. note.\n'));
});

test('git parsers: blame porcelain (40 and 64 hex) and commit weeks', () => {
  const porcelain = [
    'abcdefabcdefabcdefabcdefabcdefabcdefabcd 1 1 2',
    'author A',
    'author-time 1761955200', // 2025-11-01 00:00 UTC -> local date near it
    'summary s',
    '\tline one',
    'abcdefabcdefabcdefabcdefabcdefabcdefabcd 2 2',
    'author A',
    'author-time 1761955200',
    '\tline two',
    '0000000000000000000000000000000000000000 3 3 1',
    'author Not Committed Yet',
    'author-time 1762473600',
    '\tline three',
    'a'.repeat(64) + ' 4 4 1',
    'author-time 1761955200',
    '\tline four',
    '0'.repeat(64) + ' 5 5 1',
    'author-time 1762473600',
    '\tline five',
  ].join('\n');
  const m = parseBlame(porcelain);
  assert.equal(m.size, 5);
  assert.match(m.get(1), /^2025-1[01]-\d{2}$/);
  assert.equal(m.get(1), m.get(2));
  assert.equal(m.get(3), null);
  assert.equal(m.get(4), m.get(1));
  assert.equal(m.get(5), null);
  const weeks = parseCommitWeeks('1762473600\n\ncontent/projects/a/index.md\n1762387200\n\ncontent/projects/b.md\n1761955200\n\nx\n');
  assert.equal([...weeks.values()].reduce((a, b) => a + b, 0), 3);
  for (const k of weeks.keys()) assert.equal(weekStart(k), k);
});

test('CLI arguments: only --check, --stdout and --today=YYYY-MM-DD are accepted', () => {
  assert.deepEqual(parseArgs([]), { check: false, stdout: false, today: null });
  assert.deepEqual(parseArgs(['--check', '--today=2026-11-07']), { check: true, stdout: false, today: '2026-11-07' });
  assert.deepEqual(parseArgs(['--stdout'], { TALLY_TODAY: '2026-11-01' }), { check: false, stdout: true, today: '2026-11-01' });
  assert.deepEqual(parseArgs(['--today=2026-11-02'], { TALLY_TODAY: '2026-11-01' }).today, '2026-11-02');
  for (const bad of [['--chekc'], ['--stdout', '--write'], ['calls.md'], ['--today'], ['--today=2026-13-40'], ['-c']]) {
    assert.ok(parseArgs(bad).error, bad.join(' '));
  }
});
