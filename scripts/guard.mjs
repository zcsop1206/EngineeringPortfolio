#!/usr/bin/env node
// Fails when a file that must not be published could be pushed.
// Checks tracked files, plus untracked files that are not ignored when run
// outside CI. See scripts/README.md for the list of checks.

import { execFileSync } from 'node:child_process';
import { lstatSync, readFileSync, existsSync } from 'node:fs';
import { join, posix } from 'node:path';

const TOKEN_SCAN_LIMIT = 20 * 1024 * 1024;
const BINARY_EXT = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'pdf', 'glb', 'gltf',
  'woff', 'woff2', 'ttf', 'zip',
]);
const AUDIO_EXT = new Set(['m4a', 'webm', 'ogg', 'mp3', 'wav']);
const TOKEN_PATTERNS = [
  /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/g,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
];
const PLUGIN_DATA = /(^|\/)\.obsidian\/plugins\/[^/]+\/data\.json$/;
const PRIVATE_DIR = /(^|\/)private\//;

function parseArgs(argv) {
  let maxMb = 8;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    let value;
    if (arg === '--max-mb') value = argv[++i];
    else if (arg.startsWith('--max-mb=')) value = arg.slice('--max-mb='.length);
    else if (arg === '-h' || arg === '--help') {
      console.log('usage: node scripts/guard.mjs [--max-mb N]');
      process.exit(0);
    } else {
      console.error(`guard: unknown argument ${arg}`);
      process.exit(2);
    }
    maxMb = Number(value);
    if (!Number.isFinite(maxMb) || maxMb <= 0) {
      console.error(`guard: --max-mb needs a positive number, got ${value}`);
      process.exit(2);
    }
  }
  return { maxMb };
}

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
}

function listFiles(root, args) {
  return git(['ls-files', '-z', ...args], root).split('\0').filter(Boolean);
}

function readAllowList(root) {
  const file = join(root, 'scripts', 'guard-allow.txt');
  if (!existsSync(file)) return new Set();
  return new Set(
    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.replace(/#.*/, '').trim())
      .filter(Boolean),
  );
}

function ext(path) {
  const base = posix.basename(path);
  const dot = base.lastIndexOf('.');
  return dot > 0 ? base.slice(dot + 1).toLowerCase() : '';
}

function mask(token) {
  const prefix = token.startsWith('github_pat_') ? 'github_pat_' : token.slice(0, 4);
  return `${prefix}... (${token.length} chars)`;
}

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

const { maxMb } = parseArgs(process.argv.slice(2));
const maxBytes = maxMb * 1024 * 1024;
const inCI = Boolean(process.env.CI) && !['false', '0'].includes(process.env.CI.toLowerCase());

let root;
try {
  root = git(['rev-parse', '--show-toplevel'], process.cwd()).trim();
} catch {
  console.error('guard: not inside a git repository');
  process.exit(2);
}

const tracked = listFiles(root, []);
const untracked = inCI ? [] : listFiles(root, ['--others', '--exclude-standard']);
const paths = [...new Set([...tracked, ...untracked])].sort();
const allow = readAllowList(root);
const offenders = [];

for (const path of paths) {
  const base = posix.basename(path);
  const extension = ext(path);

  if (base.includes(' (conflict ')) {
    offenders.push(['sync conflict copy', path, 'resolve it and delete the copy']);
  }
  if (PLUGIN_DATA.test(path)) {
    offenders.push(['plugin data file', path, 'may hold a GitHub token']);
  }
  if (PRIVATE_DIR.test(path)) {
    offenders.push(['private folder', path, 'private/ is never published']);
  }
  if (AUDIO_EXT.has(extension)) {
    offenders.push(['audio file', path, 'audio is not published yet']);
  }

  let stat;
  try {
    stat = lstatSync(join(root, path));
  } catch {
    continue; // listed by git but deleted in the working tree
  }
  if (!stat.isFile()) continue;

  if (stat.size > maxBytes && !allow.has(path)) {
    const mb = (stat.size / 1024 / 1024).toFixed(1);
    offenders.push(['file too large', path, `${mb} MB, limit ${maxMb} MB`]);
  }

  if (BINARY_EXT.has(extension) || stat.size > TOKEN_SCAN_LIMIT) continue;
  const text = readFileSync(join(root, path), 'latin1');
  for (const pattern of TOKEN_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      offenders.push([
        'GitHub token',
        path,
        `line ${lineOf(text, match.index)}, ${mask(match[0])}`,
      ]);
    }
  }
}

const scope = inCI
  ? `${tracked.length} tracked files (CI)`
  : `${tracked.length} tracked and ${untracked.length} untracked files`;

if (offenders.length > 0) {
  console.error(`guard: ${offenders.length} problem(s) in ${scope}:`);
  for (const [reason, path, detail] of offenders) {
    console.error(`  ${reason}: ${path} (${detail})`);
  }
  process.exit(1);
}

console.log(`guard: ok, checked ${scope}, size limit ${maxMb} MB`);
