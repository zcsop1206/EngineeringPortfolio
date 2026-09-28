// Strips the raw stroke data from a notebook-ink/1 page SVG before it is published.
// The page's <metadata> holds every stroke's points as JSON (the editor's source of truth),
// which is about half of a page's bytes and plays no part in how the page looks. Everything
// else, including the <style> that switches colours for dark mode and the template layer,
// is left byte for byte as it was.

const FORMAT = 'notebook-ink/1';

// One <metadata> element with its contents, plus the spaces or tabs before it on its line
// and the ones after it with a single line break, so no blank line is left behind. The
// writer escapes `]]>` inside the JSON, so the CDATA section cannot end early, and
// `</metadata>` cannot occur inside it (ids, tools and colours are validated).
const METADATA_RE = /[ \t]*<metadata(?:\s[^>]*)?>[\s\S]*?<\/metadata\s*>[ \t]*(?:\r?\n)?/g;

/** Whether the text is a notebook-ink/1 page that still carries its stroke data. */
export function isInkSvg(text) {
  if (typeof text !== 'string' || !text.includes(FORMAT)) return false;
  for (const m of text.matchAll(METADATA_RE)) if (m[0].includes(FORMAT)) return true;
  return false;
}

/**
 * The page without its <metadata> element. Returns the input unchanged if it is not a
 * notebook-ink/1 page. Only a <metadata> element that names the format is removed.
 */
export function stripInkSvg(text) {
  if (!isInkSvg(text)) return text;
  return text.replace(METADATA_RE, m => (m.includes(FORMAT) ? '' : m));
}
