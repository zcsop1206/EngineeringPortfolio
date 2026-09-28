import type { APIRoute, GetStaticPaths } from 'astro';
import { firstImageFile, getEntries } from '../../lib/content';
import { DEFAULT_OG, entryOgFile, renderDefaultOg, renderImageOg } from '../../lib/og';

export const getStaticPaths = (async () => {
  const paths: { params: { file: string }; props: { src?: string } }[] = [
    { params: { file: DEFAULT_OG }, props: {} },
  ];
  for (const e of await getEntries()) {
    const file = entryOgFile(e);
    if (file) paths.push({ params: { file }, props: { src: firstImageFile(e) } });
  }
  return paths;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const src = (props as { src?: string }).src;
  const body = src ? await renderImageOg(src) : await renderDefaultOg();
  const type = src && !/\.svg$/i.test(src) ? 'image/jpeg' : 'image/png';
  return new Response(new Uint8Array(body), { headers: { 'Content-Type': type } });
};
