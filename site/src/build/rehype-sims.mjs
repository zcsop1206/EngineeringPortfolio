// Rehype plugin: interactive simulations in plain-markdown writeups.
//
// A writeup marks the spot with an HTML comment on its own line,
//   <!-- stepper-sim -->
// which stays invisible in Obsidian and anywhere else the markdown is read.
// This plugin swaps the marker for the sim's static markup
// (src/sims/<name>/markup.mjs), sized so the page does not move when the
// script arrives. The project page's loader then imports
// src/sims/<name>/main.js once the markup comes near the screen.
//
// Runs before Astro's rehype-raw, so the marker is still a `raw` node. A marker
// with no sim of that name is left alone (an ordinary comment).
import { markup as stepper } from '../sims/stepper/markup.mjs';

export const SIMS = { stepper };
const MARKER = /^\s*<!--\s*([a-z0-9]+)-sim\s*-->\s*$/;

function visit(node) {
  for (const child of node.children ?? []) {
    if (child.type === 'raw') {
      const name = child.value.match(MARKER)?.[1];
      if (name && SIMS[name]) child.value = SIMS[name];
    } else {
      visit(child);
    }
  }
}

export default function rehypeSims() {
  return (tree) => visit(tree);
}
