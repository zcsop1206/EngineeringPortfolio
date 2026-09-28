import { getCollection, type CollectionEntry } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

export type Project = CollectionEntry<'projects'>;
export type Entry = CollectionEntry<'entries'>;

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const SITE_NAME = 'Adit Bhargava';

/** Site-relative path to a URL under the base, e.g. url('/projects/x/'). */
export function url(p = '/'): string {
  return `${BASE}${p.startsWith('/') ? p : `/${p}`}`;
}

/** Absolute URL for Open Graph and RSS. */
export function absoluteUrl(p: string, site: URL | undefined): string {
  return new URL(p, site ?? 'https://zcsop1206.github.io').href;
}

/** ISO date, YYYY-MM-DD. Frontmatter dates are parsed as UTC midnight. */
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export const STATUS_LABEL: Record<string, string> = {
  'built-and-tested': 'built and tested',
  'design-study': 'design study',
  'in-progress': 'in progress',
  abandoned: 'abandoned',
};

export function isVisibleProject(p: Project): boolean {
  return p.data.publish !== false && p.data.status !== 'abandoned';
}

export function entryProject(e: Entry): string {
  return e.id.split('/')[0];
}

export function entryStem(e: Entry): string {
  return e.id.split('/').at(-1)!;
}

/** Title from frontmatter, else the file stem without its date, e.g. "Turntable rebuild". */
export function entryTitle(e: Entry): string {
  if (e.data.title) return e.data.title;
  const rest = entryStem(e).replace(/^\d{4}-\d{2}-\d{2}-?/, '').replace(/[-_]+/g, ' ').trim();
  return rest ? rest[0].toUpperCase() + rest.slice(1) : isoDate(e.data.date);
}

export function projectDate(p: Project): Date {
  return p.data.end ?? p.data.start;
}

/** Visible projects: ongoing first, then end date descending, then start descending. */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', isVisibleProject);
  const t = (d?: Date) => (d ? d.getTime() : Infinity);
  return all.sort(
    (a, b) =>
      t(b.data.end) - t(a.data.end) ||
      b.data.start.getTime() - a.data.start.getTime() ||
      a.id.localeCompare(b.id),
  );
}

/** Visible entries of visible projects, newest first. */
export async function getEntries(projects?: Project[]): Promise<Entry[]> {
  const visible = new Set((projects ?? (await getProjects())).map((p) => p.id));
  const all = await getCollection(
    'entries',
    (e) => e.data.publish !== false && visible.has(entryProject(e)),
  );
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || b.id.localeCompare(a.id));
}

/** Newest entry per project slug. Expects entries sorted newest first. */
export function latestEntryByProject(entries: Entry[]): Map<string, Entry> {
  const m = new Map<string, Entry>();
  for (const e of entries) if (!m.has(entryProject(e))) m.set(entryProject(e), e);
  return m;
}

export function entryUrl(e: Entry): string {
  return url(`/projects/${entryProject(e)}/log/${entryStem(e)}/`);
}

export function projectUrl(p: Project | string): string {
  return url(`/projects/${typeof p === 'string' ? p : p.id}/`);
}

function contentDir(): string {
  return process.env.CONTENT_DIR_ABS || path.resolve(process.cwd(), process.env.CONTENT_DIR || '../content');
}

/** Absolute path of an entry's markdown file. */
export function entryFile(e: Entry): string {
  return path.join(contentDir(), 'projects', ...e.id.split('/')) + '.md';
}

/** Absolute path of the first relative image embedded in an entry body, if it exists. */
export function firstImageFile(e: Entry): string | undefined {
  const body = e.body ?? '';
  const re = /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;
  for (const m of body.matchAll(re)) {
    const src = m[1];
    if (src.startsWith('/') || /^[a-z]+:/i.test(src)) continue;
    let rel = src;
    try { rel = decodeURI(src); } catch { /* keep raw */ }
    const abs = path.resolve(path.dirname(entryFile(e)), rel);
    if (fs.existsSync(abs)) return abs;
  }
  return undefined;
}

/**
 * Whether a writeup's body opens with its cover image (the first markdown image
 * embed has the cover's file name). Then the page does not render the cover again.
 */
export function bodyOpensWithCover(p: Project): boolean {
  const cover = p.data.cover?.src;
  if (!cover) return false;
  // Astro rewrites the src to /_astro/<name>.<hash>.<ext>; keep the name before the hash.
  const coverName = path.posix.basename(cover.split('?')[0]).replace(/\.[A-Za-z0-9_-]+(\.[a-z0-9]+)$/i, '$1');
  const m = /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/.exec(p.body ?? '');
  if (!m) return false;
  return path.posix.basename(m[1].replace(/^\.\//, '')) === coverName;
}

/** First paragraph of plain text from a markdown body, for descriptions. */
export function excerpt(body: string | undefined, max = 200): string {
  const paras = (body ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('#') && !p.startsWith('![') && !p.startsWith('|'));
  const text = (paras[0] ?? '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : text;
}
