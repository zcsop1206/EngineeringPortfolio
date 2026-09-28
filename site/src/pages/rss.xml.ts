import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import {
  SITE_NAME,
  entryProject,
  entryTitle,
  entryUrl,
  excerpt,
  getEntries,
  getProjects,
  projectDate,
  projectUrl,
  url,
} from '../lib/content';

export const GET: APIRoute = async (context) => {
  const projects = await getProjects();
  const entries = await getEntries(projects);
  const titles = new Map(projects.map((p) => [p.id, p.data.title]));
  const items = [
    ...projects.map((p) => ({
      title: p.data.title,
      link: projectUrl(p),
      pubDate: projectDate(p),
      description: p.data.description,
    })),
    ...entries.map((e) => ({
      title: `${titles.get(entryProject(e))}: ${entryTitle(e)}`,
      link: entryUrl(e),
      pubDate: e.data.date,
      description: excerpt(e.body) || `${e.data.type} entry`,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: SITE_NAME,
    description: 'Project writeups and working notes.',
    site: new URL(url('/'), context.site),
    items,
    trailingSlash: true,
  });
};
