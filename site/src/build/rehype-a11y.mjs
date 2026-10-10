// Rehype plugin: keyboard and screen reader fixes for markdown output.
// - <pre> and <table> scroll sideways when they are wide (site.css), so they
//   get tabindex="0" to be scrollable from the keyboard.
// - GFM task-list checkboxes get an aria-label: their list item's text.
// Raw HTML in a markdown body is not parsed here and is left as written.

/** Text of a node, without nested lists. */
function textOf(node) {
  if (node.type === 'text') return node.value;
  if (node.type === 'element' && (node.tagName === 'ul' || node.tagName === 'ol')) return '';
  return (node.children ?? []).map(textOf).join('');
}

function visit(node, li) {
  for (const child of node.children ?? []) {
    if (child.type !== 'element') continue;
    if (child.tagName === 'pre' || child.tagName === 'table') child.properties.tabIndex = 0;
    if (child.tagName === 'input' && child.properties.type === 'checkbox' && li) {
      const text = textOf(li).replace(/\s+/g, ' ').trim();
      if (text) child.properties.ariaLabel ??= text;
    }
    visit(child, child.tagName === 'li' ? child : li);
  }
}

export default function rehypeA11y() {
  return (tree) => visit(tree, null);
}
