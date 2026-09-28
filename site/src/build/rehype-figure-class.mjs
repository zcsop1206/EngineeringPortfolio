// Rehype plugin: mark paragraphs that hold only images (or a video) with
// class "figure", so site.css can let them extend past the text column
// without relying on :has().
function isBlank(n) {
  return n.type === 'text' && !n.value.trim();
}

function visit(node) {
  if (!node.children) return;
  for (const child of node.children) {
    if (child.type === 'element' && child.tagName === 'p') {
      const kids = child.children.filter((k) => !isBlank(k));
      const media = (k) => k.type === 'element' && (k.tagName === 'img' || k.tagName === 'video' || (k.tagName === 'br'));
      if (kids.length > 0 && kids.every(media) && kids.some((k) => k.tagName !== 'br')) {
        const cls = child.properties.className ?? [];
        child.properties.className = [...(Array.isArray(cls) ? cls : [cls]), 'figure'];
        // Relative images still go through Astro's pipeline after this plugin;
        // give their srcset the real display width (the wide column).
        for (const k of kids) {
          const src = k.properties?.src;
          if (k.tagName === 'img' && typeof src === 'string' && !src.startsWith('/') && !/^[a-z]+:/i.test(src)) {
            k.properties.sizes ??= '(min-width: 992px) 960px, calc(100vw - 32px)';
          }
        }
      }
    }
    visit(child);
  }
}

export default function rehypeFigureClass() {
  return (tree) => visit(tree);
}
