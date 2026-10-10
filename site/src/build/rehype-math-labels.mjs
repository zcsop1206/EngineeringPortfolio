// Rehype plugin: rehype-mathjax, with an accessible name on every formula.
//
// MathJax's SVG output is <mjx-container><svg role="img">, with no name. This
// plugin wraps each math element (as remark-math emits it) in a temporary
// element that remembers its TeX, runs rehype-mathjax, which renders into the
// wrapper, then copies the TeX to aria-label on the rendered <svg> and drops
// the wrapper. Options are passed to rehype-mathjax.
import rehypeMathJax from 'rehype-mathjax';

const MATH_CLASSES = ['language-math', 'math-inline', 'math-display'];
const WRAPPER = 'x-math-tex';

const classesOf = (n) => (Array.isArray(n.properties?.className) ? n.properties.className : []);
const isMath = (n) => n.type === 'element' && classesOf(n).some((c) => MATH_CLASSES.includes(c));
const textOf = (n) => (n.type === 'text' ? n.value : (n.children ?? []).map(textOf).join(''));

/** The element MathJax replaces: a math <code>, or the <pre> around a ```math block. */
function mathScope(n) {
  if (n.type !== 'element') return false;
  if (n.tagName === 'pre') return n.children.some((c) => c.tagName === 'code' && classesOf(c).includes('language-math'));
  return isMath(n);
}

function wrap(node) {
  if (!node.children) return;
  node.children = node.children.map((child) => {
    if (!mathScope(child)) {
      wrap(child);
      return child;
    }
    const tex = textOf(child).replace(/\s+/g, ' ').trim();
    return { type: 'element', tagName: WRAPPER, properties: {}, children: [child], data: { tex } };
  });
}

function label(node, tex) {
  for (const child of node.children ?? []) {
    if (child.type !== 'element') continue;
    if (tex && child.tagName === 'svg' && node.tagName === 'mjx-container') child.properties.ariaLabel = tex;
    label(child, tex);
  }
}

function unwrap(node) {
  if (!node.children) return;
  node.children = node.children.flatMap((child) => {
    if (child.type === 'element' && child.tagName === WRAPPER) {
      label(child, child.data.tex);
      unwrap(child);
      return child.children;
    }
    unwrap(child);
    return [child];
  });
}

export default function rehypeMathLabels(options) {
  const render = rehypeMathJax(options);
  return (tree, file) => {
    wrap(tree);
    render(tree, file);
    unwrap(tree);
  };
}
