import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { resolveContentDir, scanVisibility } from './build/visibility.mjs';

// astro.config.mjs sets CONTENT_DIR_ABS; the fallback assumes astro runs from site/.
const contentDir = process.env.CONTENT_DIR_ABS || resolveContentDir(process.cwd());
const projectsDir = path.join(contentDir, 'projects');
const base = pathToFileURL(projectsDir + path.sep);

// Hidden writeups and entries are excluded at the glob, so they never enter
// the content store or the image pipeline.
const { hiddenProjects, hiddenEntries } = scanVisibility(contentDir);
const excludeProjects = [...hiddenProjects].map((slug) => `!${slug}/**`);
const excludeEntries = [...hiddenEntries].map((id) => `!${id}.md`);

const optionalDate = z.preprocess(
  (v) => (v === null || v === '' ? undefined : v),
  z.coerce.date().optional(),
);

const projects = defineCollection({
  loader: glob({
    base,
    pattern: ['*/index.md', ...excludeProjects],
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        status: z.enum(['built-and-tested', 'design-study', 'in-progress', 'abandoned']),
        start: z.coerce.date(),
        end: optionalDate,
        cover: image().optional(),
        publish: z.boolean().default(true),
      })
      .passthrough(),
});

const entries = defineCollection({
  loader: glob({
    base,
    pattern: ['*/log/*.md', ...excludeProjects, ...excludeEntries],
    // id = "<slug>/log/<stem>"; lib/content.ts derives project and stem from it.
    generateId: ({ entry, data }) => {
      const id = entry.replace(/\.md$/, '');
      const slug = id.split('/')[0];
      if (data.project !== undefined && data.project !== null && data.project !== slug) {
        throw new Error(
          `${entry}: frontmatter "project: ${data.project}" does not match its folder "${slug}". ` +
            'Remove the project key; it is derived from the folder.',
        );
      }
      return id;
    },
  }),
  schema: z
    .object({
      date: z.coerce.date(),
      title: z.string().optional(),
      type: z.enum(['log', 'test', 'decision', 'sketch']).default('log'),
      publish: z.boolean().default(true),
      ink: z.number().optional(),
      project: z.string().optional(),
    })
    .passthrough(),
});

export const collections = { projects, entries };
