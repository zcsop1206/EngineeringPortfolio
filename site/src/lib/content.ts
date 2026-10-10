import type { MarkdownHeading } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
import { resolveContentDir } from '../build/visibility.mjs';
import { homeProjects as homeOrder, navOrder, shortTitle as shortTitleOf } from './order.mjs';

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

function isVisibleProject(p: Project): boolean {
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

/** Short title for home rows and the sidebar; the full title elsewhere. */
export function shortTitle(p: Project): string {
  return shortTitleOf(p);
}

/**
 * Home page split: featured projects in `featured` order, then the rest in the
 * given order, and each parent's parts. See lib/order.mjs.
 */
export function homeProjects(projects: Project[]): {
  featured: Project[];
  rest: Project[];
  children: Map<string, Project[]>;
} {
  return homeOrder(projects);
}

/** Sidebar list: each project followed by its parts, which are marked as children. */
export function projectNav(projects: Project[], currentSlug: string) {
  return (navOrder(projects) as { p: Project; child: boolean }[]).map(({ p, child }) => ({
    title: shortTitle(p),
    href: projectUrl(p),
    child,
    current: p.id === currentSlug,
  }));
}

/** The page outline for the right sidebar: h2 headings only. */
export function outline(headings: MarkdownHeading[]): { slug: string; text: string }[] {
  return headings.filter((h) => h.depth === 2).map((h) => ({ slug: h.slug, text: h.text }));
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

// astro.config.mjs sets CONTENT_DIR_ABS; the fallback assumes astro runs from site/.
function contentDir(): string {
  return process.env.CONTENT_DIR_ABS || resolveContentDir(process.cwd());
}

/** A markdown image embed; group 1 is the URL. */
const MD_IMAGE = /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;

/** Absolute path of an entry's markdown file. */
function entryFile(e: Entry): string {
  return path.join(contentDir(), 'projects', ...e.id.split('/')) + '.md';
}

/** Absolute path of the first relative image embedded in an entry body, if it exists. */
export function firstImageFile(e: Entry): string | undefined {
  const body = e.body ?? '';
  for (const m of body.matchAll(MD_IMAGE)) {
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
 * Whether a writeup's body opens with its cover image (the body's first
 * non-blank line starts with an embed of the cover's file name). Then the page
 * does not render the cover again.
 */
export function bodyOpensWithCover(p: Project): boolean {
  const cover = p.data.cover?.src;
  if (!cover) return false;
  // Astro rewrites the src to /_astro/<name>.<hash>.<ext>; keep the name before the hash.
  const coverName = path.posix.basename(cover.split('?')[0]).replace(/\.[A-Za-z0-9_-]+(\.[a-z0-9]+)$/i, '$1');
  const m = [...(p.body ?? '').trimStart().matchAll(MD_IMAGE)][0];
  if (!m || m.index !== 0) return false;
  return path.posix.basename(m[1].replace(/^\.\//, '')) === coverName;
}

/** Markdown emphasis (`*a*`, `**a**`, `_a_`, `__a__`) to its text; code spans keep theirs as is. */
function stripEmphasis(text: string): string {
  return text
    .split(/(`[^`]*`)/)
    .map((part, i) =>
      i % 2
        ? part.slice(1, -1)
        : part
            .replace(/\*\*?([^*\s](?:[^*]*[^*\s])?)\*\*?/g, '$1')
            .replace(/(^|\W)__?([^_\s](?:[^_]*[^_\s])?)__?(?=\W|$)/g, '$1$2'),
    )
    .join('');
}

/** First paragraph of plain text from a markdown body, for descriptions. */
export function excerpt(body: string | undefined, max = 200): string {
  const paras = (body ?? '')
    .replace(/<(script|style|svg)\b[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/^(```|\$\$)[\s\S]*?^\1/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p && !/^(#|!\[|\||```|\$\$)/.test(p));
  const text = stripEmphasis(
    (paras[0] ?? '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1'),
  )
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : text;
}
