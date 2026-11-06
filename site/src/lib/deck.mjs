// A project's deck: content/projects/<slug>/deck.md, a linear walk through the
// project for telling it to someone. Plain JS so node --test can import it.
//
//   # Why                      a section; names the part of the story
//   ## I took on the rework    a beat: one headline
//   A sentence or two, or a short list.
//   ![optional caption](furnace_v1_section.png)
//
// A beat's visual is a line holding only an image embed. The target is a file
// in the project folder (an image, or a video by extension) or "#fig-3", a
// figure of the writeup by its anchor. A beat without one keeps the previous
// beat's visual on screen, so the talk never has to go back for a picture.

const VISUAL = /^!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?\s*\)\s*$/;

/** deck.md text to { beats: [{ section, headline, body, visual, shown }] }. */
export function parseDeck(text) {
  const lines = text.replace(/^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n/, '').split(/\r?\n/);
  const beats = [];
  let section = '';
  let beat = null;
  for (const line of lines) {
    const h1 = line.match(/^#\s+(.+?)\s*$/);
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h1) { section = h1[1]; beat = null; continue; }
    if (h2) { beat = { section, headline: h2[1], body: [], visual: null }; beats.push(beat); continue; }
    if (!beat) continue;
    const v = line.match(VISUAL);
    if (v && !beat.visual) { beat.visual = { caption: v[1].trim(), src: v[2] }; continue; }
    beat.body.push(line);
  }
  // `shown` is the index of the beat whose visual is on screen: its own, else the last one before it.
  let shown = -1;
  return {
    beats: beats.map((b, i) => {
      if (b.visual) shown = i;
      return { ...b, body: b.body.join('\n').trim(), shown };
    }),
  };
}

/** The section names in order, without repeats. */
export function deckSections(beats) {
  return [...new Set(beats.map((b) => b.section).filter(Boolean))];
}

/** 'figure' for "#fig-3", 'video' or 'image' for a file. */
export function visualKind(src) {
  if (src.startsWith('#')) return 'figure';
  return /\.(mp4|webm|mov)$/i.test(src) ? 'video' : 'image';
}
