---
title: "What the chip computes: the ASIC puzzle's Star Battle checker"
description: Using the gate-level simulator from part 1 to work out what the Jane Street puzzle chip checks, an 11 by 11 two-star Star Battle, and recovering its region map by running the netlist rather than reading the layout.
status: built-and-tested
start: 2026-09-05
end: 2026-09-10
cover: regions.png
cover_on_page: false
publish: true
---
[Part 1](/EngineeringPortfolio/projects/asicpuzzle2026) found the 121 bits that make the Jane Street puzzle chip print `(* TWO STARS *)`. This post is about what those bits mean.

Start with the puzzle itself. The rules:

- Two stars in every row.
- Two stars in every column.
- Two stars in every region. The regions are the outlined areas.
- No two stars touch, not even at a corner.

<div id="sb-widget" class="not-content" style="margin:1.5rem 0">
<svg viewBox="-2 -2 264 264" width="264" height="264" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Interactive 11 by 11 Star Battle grid with the recovered regions. Each cell is a button that toggles a star." style="display:block;margin:0 auto;max-width:100%;height:auto">
<rect data-i="0" x="1" y="1" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 0, column 0" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="1" x="23" y="1" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 0, column 1" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="2" x="45" y="1" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 0, column 2" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="3" x="67" y="1" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 0, column 3" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="4" x="89" y="1" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 0, column 4" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="5" x="111" y="1" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 0, column 5" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="6" x="133" y="1" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 0, column 6" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="7" x="155" y="1" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 0, column 7" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="8" x="177" y="1" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 0, column 8" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="9" x="199" y="1" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 0, column 9" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="10" x="221" y="1" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 0, column 10" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="11" x="1" y="23" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 1, column 0" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="12" x="23" y="23" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 1, column 1" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="13" x="45" y="23" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 1, column 2" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="14" x="67" y="23" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 1, column 3" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="15" x="89" y="23" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 1, column 4" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="16" x="111" y="23" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 1, column 5" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="17" x="133" y="23" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 1, column 6" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="18" x="155" y="23" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 1, column 7" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="19" x="177" y="23" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 1, column 8" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="20" x="199" y="23" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 1, column 9" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="21" x="221" y="23" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 1, column 10" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="22" x="1" y="45" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 2, column 0" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="23" x="23" y="45" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 2, column 1" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="24" x="45" y="45" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 2, column 2" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="25" x="67" y="45" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 2, column 3" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="26" x="89" y="45" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 2, column 4" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="27" x="111" y="45" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 2, column 5" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="28" x="133" y="45" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 2, column 6" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="29" x="155" y="45" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 2, column 7" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="30" x="177" y="45" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 2, column 8" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="31" x="199" y="45" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 2, column 9" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="32" x="221" y="45" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 2, column 10" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="33" x="1" y="67" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 3, column 0" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="34" x="23" y="67" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 3, column 1" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="35" x="45" y="67" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 3, column 2" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="36" x="67" y="67" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 3, column 3" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="37" x="89" y="67" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 3, column 4" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="38" x="111" y="67" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 3, column 5" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="39" x="133" y="67" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 3, column 6" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="40" x="155" y="67" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 3, column 7" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="41" x="177" y="67" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 3, column 8" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="42" x="199" y="67" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 3, column 9" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="43" x="221" y="67" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 3, column 10" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="44" x="1" y="89" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 4, column 0" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="45" x="23" y="89" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 4, column 1" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="46" x="45" y="89" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 4, column 2" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="47" x="67" y="89" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 4, column 3" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="48" x="89" y="89" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 4, column 4" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="49" x="111" y="89" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 4, column 5" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="50" x="133" y="89" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 4, column 6" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="51" x="155" y="89" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 4, column 7" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="52" x="177" y="89" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 4, column 8" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="53" x="199" y="89" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 4, column 9" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="54" x="221" y="89" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 4, column 10" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="55" x="1" y="111" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 5, column 0" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="56" x="23" y="111" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 5, column 1" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="57" x="45" y="111" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 5, column 2" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="58" x="67" y="111" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 5, column 3" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="59" x="89" y="111" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 5, column 4" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="60" x="111" y="111" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 5, column 5" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="61" x="133" y="111" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 5, column 6" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="62" x="155" y="111" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 5, column 7" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="63" x="177" y="111" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 5, column 8" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="64" x="199" y="111" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 5, column 9" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="65" x="221" y="111" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 5, column 10" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="66" x="1" y="133" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 6, column 0" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="67" x="23" y="133" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 6, column 1" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="68" x="45" y="133" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 6, column 2" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="69" x="67" y="133" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 6, column 3" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="70" x="89" y="133" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 6, column 4" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="71" x="111" y="133" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 6, column 5" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="72" x="133" y="133" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 6, column 6" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="73" x="155" y="133" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 6, column 7" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="74" x="177" y="133" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 6, column 8" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="75" x="199" y="133" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 6, column 9" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="76" x="221" y="133" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 6, column 10" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="77" x="1" y="155" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 7, column 0" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="78" x="23" y="155" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 7, column 1" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="79" x="45" y="155" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 7, column 2" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="80" x="67" y="155" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 7, column 3" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="81" x="89" y="155" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 7, column 4" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="82" x="111" y="155" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 7, column 5" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="83" x="133" y="155" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 7, column 6" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="84" x="155" y="155" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 7, column 7" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="85" x="177" y="155" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 7, column 8" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="86" x="199" y="155" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 7, column 9" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="87" x="221" y="155" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 7, column 10" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="88" x="1" y="177" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 8, column 0" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="89" x="23" y="177" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 8, column 1" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="90" x="45" y="177" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 8, column 2" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="91" x="67" y="177" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 8, column 3" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="92" x="89" y="177" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 8, column 4" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="93" x="111" y="177" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 8, column 5" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="94" x="133" y="177" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 8, column 6" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="95" x="155" y="177" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 8, column 7" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="96" x="177" y="177" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 8, column 8" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="97" x="199" y="177" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 8, column 9" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="98" x="221" y="177" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 8, column 10" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="99" x="1" y="199" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 9, column 0" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="100" x="23" y="199" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 9, column 1" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="101" x="45" y="199" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 9, column 2" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="102" x="67" y="199" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 9, column 3" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="103" x="89" y="199" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 9, column 4" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="104" x="111" y="199" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 9, column 5" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="105" x="133" y="199" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 9, column 6" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="106" x="155" y="199" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 9, column 7" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="107" x="177" y="199" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 9, column 8" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="108" x="199" y="199" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 9, column 9" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="109" x="221" y="199" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 9, column 10" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="110" x="1" y="221" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 10, column 0" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="111" x="23" y="221" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 10, column 1" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="112" x="45" y="221" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 10, column 2" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="113" x="67" y="221" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 10, column 3" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="114" x="89" y="221" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 10, column 4" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="115" x="111" y="221" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 10, column 5" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="116" x="133" y="221" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 10, column 6" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="117" x="155" y="221" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 10, column 7" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="118" x="177" y="221" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 10, column 8" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="119" x="199" y="221" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 10, column 9" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<rect data-i="120" x="221" y="221" width="20" height="20" rx="3" tabindex="0" role="button" aria-pressed="false" aria-label="row 10, column 10" style="fill:var(--sl-color-gray-6);cursor:pointer;outline-offset:2px"/>
<line x1="0" y1="0" x2="0" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="0" y1="0" x2="22" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="22" y1="0" x2="44" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="44" y1="0" x2="66" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="44" y1="22" x2="66" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="66" y1="0" x2="88" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="0" x2="110" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="110" y1="0" x2="110" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="110" y1="0" x2="132" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="132" y1="0" x2="154" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="154" y1="0" x2="154" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="132" y1="22" x2="154" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="154" y1="0" x2="176" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="176" y1="0" x2="176" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="176" y1="0" x2="198" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="198" y1="0" x2="220" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="220" y1="0" x2="220" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="220" y1="0" x2="242" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="242" y1="0" x2="242" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="0" y1="22" x2="0" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="44" y1="22" x2="44" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="66" y1="22" x2="66" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="66" y1="44" x2="88" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="110" y1="22" x2="110" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="44" x2="110" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="132" y1="22" x2="132" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="132" y1="44" x2="154" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="176" y1="22" x2="176" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="176" y1="44" x2="198" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="220" y1="22" x2="220" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="242" y1="22" x2="242" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="0" y1="44" x2="0" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="44" y1="44" x2="44" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="66" y1="44" x2="66" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="66" x2="110" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="110" y1="66" x2="132" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="154" y1="44" x2="154" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="132" y1="66" x2="154" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="154" y1="66" x2="176" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="198" y1="44" x2="198" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="220" y1="44" x2="220" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="198" y1="66" x2="220" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="242" y1="44" x2="242" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="0" y1="66" x2="0" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="0" y1="88" x2="22" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="44" y1="66" x2="44" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="66" y1="66" x2="66" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="66" x2="88" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="110" y1="88" x2="132" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="154" y1="66" x2="154" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="132" y1="88" x2="154" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="176" y1="66" x2="176" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="176" y1="88" x2="198" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="220" y1="66" x2="220" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="198" y1="88" x2="220" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="242" y1="66" x2="242" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="0" y1="88" x2="0" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="22" y1="88" x2="22" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="44" y1="88" x2="44" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="22" y1="110" x2="44" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="66" y1="88" x2="66" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="88" x2="88" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="110" y1="88" x2="110" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="110" y1="110" x2="132" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="132" y1="110" x2="154" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="176" y1="110" x2="198" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="198" y1="110" x2="220" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="242" y1="88" x2="242" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="220" y1="110" x2="242" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="0" y1="110" x2="0" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="0" y1="132" x2="22" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="22" y1="132" x2="44" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="66" y1="110" x2="66" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="44" y1="132" x2="66" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="110" x2="88" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="132" x2="110" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="110" y1="132" x2="132" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="154" y1="110" x2="154" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="176" y1="110" x2="176" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="198" y1="132" x2="220" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="242" y1="110" x2="242" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="220" y1="132" x2="242" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="0" y1="132" x2="0" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="22" y1="154" x2="44" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="44" y1="154" x2="66" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="66" y1="154" x2="88" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="154" x2="110" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="132" y1="132" x2="132" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="110" y1="154" x2="132" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="154" y1="132" x2="154" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="176" y1="132" x2="176" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="198" y1="132" x2="198" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="242" y1="132" x2="242" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="0" y1="154" x2="0" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="22" y1="154" x2="22" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="154" x2="88" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="66" y1="176" x2="88" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="176" x2="110" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="110" y1="176" x2="132" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="154" y1="154" x2="154" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="132" y1="176" x2="154" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="176" y1="154" x2="176" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="198" y1="154" x2="198" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="242" y1="154" x2="242" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="0" y1="176" x2="0" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="22" y1="176" x2="22" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="22" y1="198" x2="44" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="66" y1="176" x2="66" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="176" x2="88" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="198" x2="110" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="176" y1="176" x2="176" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="198" y1="176" x2="198" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="198" y1="198" x2="220" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="242" y1="176" x2="242" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="220" y1="198" x2="242" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="0" y1="198" x2="0" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="44" y1="198" x2="44" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="22" y1="220" x2="44" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="66" y1="198" x2="66" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="110" y1="198" x2="110" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="220" x2="110" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="176" y1="198" x2="176" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="176" y1="220" x2="198" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="198" y1="220" x2="220" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="242" y1="198" x2="242" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="220" y1="220" x2="242" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="0" y1="220" x2="0" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="22" y1="220" x2="22" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="0" y1="242" x2="22" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="22" y1="242" x2="44" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="66" y1="220" x2="66" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="44" y1="242" x2="66" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="220" x2="88" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="66" y1="242" x2="88" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="88" y1="242" x2="110" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="110" y1="242" x2="132" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="132" y1="242" x2="154" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="154" y1="242" x2="176" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="176" y1="242" x2="198" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="198" y1="242" x2="220" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="242" y1="220" x2="242" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<line x1="220" y1="242" x2="242" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square;pointer-events:none"/>
<text data-row="0" x="254" y="15" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-row="1" x="254" y="37" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-row="2" x="254" y="59" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-row="3" x="254" y="81" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-row="4" x="254" y="103" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-row="5" x="254" y="125" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-row="6" x="254" y="147" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-row="7" x="254" y="169" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-row="8" x="254" y="191" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-row="9" x="254" y="213" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-row="10" x="254" y="235" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-col="0" x="11" y="258" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-col="1" x="33" y="258" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-col="2" x="55" y="258" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-col="3" x="77" y="258" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-col="4" x="99" y="258" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-col="5" x="121" y="258" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-col="6" x="143" y="258" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-col="7" x="165" y="258" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-col="8" x="187" y="258" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-col="9" x="209" y="258" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
<text data-col="10" x="231" y="258" style="font-family:var(--font-mono);font-size:11px;fill:var(--sl-color-gray-3);pointer-events:none" text-anchor="middle" aria-hidden="true">0</text>
</svg>
<p style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;margin:1rem 0 0">
<button type="button" data-act="check" style="font:inherit;font-size:0.85rem;line-height:1.2;padding:0.3rem 0.7rem;border:1px solid var(--sl-color-gray-5);border-radius:0.35rem;background:var(--sl-color-bg-nav);color:var(--sl-color-text);cursor:pointer">Check</button>
<button type="button" data-act="hint" style="font:inherit;font-size:0.85rem;line-height:1.2;padding:0.3rem 0.7rem;border:1px solid var(--sl-color-gray-5);border-radius:0.35rem;background:var(--sl-color-bg-nav);color:var(--sl-color-text);cursor:pointer">Hint</button>
<button type="button" data-act="miss" style="font:inherit;font-size:0.85rem;line-height:1.2;padding:0.3rem 0.7rem;border:1px solid var(--sl-color-gray-5);border-radius:0.35rem;background:var(--sl-color-bg-nav);color:var(--sl-color-text);cursor:pointer">Near miss</button>
<button type="button" data-act="key" style="font:inherit;font-size:0.85rem;line-height:1.2;padding:0.3rem 0.7rem;border:1px solid var(--sl-color-gray-5);border-radius:0.35rem;background:var(--sl-color-bg-nav);color:var(--sl-color-text);cursor:pointer">Solution</button>
<button type="button" data-act="reset" style="font:inherit;font-size:0.85rem;line-height:1.2;padding:0.3rem 0.7rem;border:1px solid var(--sl-color-gray-5);border-radius:0.35rem;background:var(--sl-color-bg-nav);color:var(--sl-color-text);cursor:pointer">Reset</button>
</p>
<p style="text-align:center;min-height:1.75rem;margin:0.75rem 0 0;font-family:var(--font-mono);font-size:0.9rem;color:var(--sl-color-text)" aria-live="polite"><span data-out></span></p>
</div>

<script>
(function () {
  var root = document.getElementById("sb-widget");
  if (!root) return;
  var N = 11;
  var REGIONS = ["AAAAABBCDDE","AAFAABCCDDE","AAFBBBBCCDE","AAFBGGGECCE","FAFBGEEEEEE","FFFBGGGEHHH",
    "BBBBBBGEHII","BJJJGGGEHII","BJJKEEEEHII","BBJKKEEEHHH","BJJKEEEEEEE"];
  var KEY = "0000000101010000100000000000010101010000000000001010000001000001000000100000101000010000000100000010000010010001010000000";
  var MISS = "0000000101001000100000000000010101010000000000001010000001000001001000000000100010100000010000000010000100010000010010000";
  // forced deductions in a natural solving order: region K first, then D, C, J, I, then the cascade
  var HINTS = [[8,3],[10,3],[2,9],[0,7],[2,7],[0,9],[10,1],[6,10],[8,10],[9,5],[9,8],[7,1],[1,5],[1,0],[3,0],[3,2],[5,2],[4,4],[6,4],[4,6],[7,6],[5,8]];
  var EMPTY = "var(--sl-color-gray-6)", STAR = "var(--sl-color-accent)", BAD = "var(--sl-color-red)", DIM = "var(--sl-color-gray-3)", TXT = "var(--sl-color-text)";
  var grid = new Array(N * N).fill(0);
  var cells = [], rows = [], cols = [];
  root.querySelectorAll("rect[data-i]").forEach(function (el) { cells[+el.getAttribute("data-i")] = el; });
  root.querySelectorAll("text[data-row]").forEach(function (el) { rows[+el.getAttribute("data-row")] = el; });
  root.querySelectorAll("text[data-col]").forEach(function (el) { cols[+el.getAttribute("data-col")] = el; });
  var out = root.querySelector("[data-out]");
  // What the chip prints after 121 enabled cycles. Same rules as the netlist; agreed on 214 grids.
  function checkGrid(g) {
    var total = 0, row = new Array(N).fill(0), col = new Array(N).fill(0), reg = {}, touch = false;
    for (var i = 0; i < N * N; i++) {
      if (!g[i]) continue;
      var r = Math.floor(i / N), c = i % N;
      total++; row[r]++; col[c]++;
      var L = REGIONS[r][c]; reg[L] = (reg[L] || 0) + 1;
      // the chip looks 1, 10, 11 and 12 cells back: left, up-right, up, up-left, no wrap across rows
      if (c > 0 && g[i - 1]) touch = true;
      if (r > 0 && g[i - N]) touch = true;
      if (r > 0 && c > 0 && g[i - N - 1]) touch = true;
      if (r > 0 && c < N - 1 && g[i - N + 1]) touch = true;
    }
    if (total === 0) return { message: "EMPTY SKY", success: false };
    if (total === N * N) return { message: "BIG BANG", success: false };
    var two = function (x) { return x === 2; };
    var counts = row.every(two) && col.every(two) && "ABCDEFGHIJK".split("").every(function (L) { return two(reg[L] || 0); });
    if (counts && touch) return { message: 'TWO"NOT TOUCH', success: false };
    if (counts && !touch && total === 22) return { message: "(* TWO STARS *)", success: true };
    return { message: "TRY AGAIN", success: false };
  }
  function render() {
    var bad = new Array(N * N).fill(false), rc = new Array(N).fill(0), cc = new Array(N).fill(0);
    for (var i = 0; i < N * N; i++) {
      if (!grid[i]) continue;
      var r = Math.floor(i / N), c = i % N;
      rc[r]++; cc[c]++;
      // helpers only: mark both cells of every touching pair
      var nb = [[r, c + 1], [r + 1, c - 1], [r + 1, c], [r + 1, c + 1]];
      for (var k = 0; k < 4; k++) {
        var rr = nb[k][0], c2 = nb[k][1];
        if (rr < N && c2 >= 0 && c2 < N && grid[rr * N + c2]) { bad[i] = true; bad[rr * N + c2] = true; }
      }
    }
    for (var j = 0; j < N * N; j++) {
      cells[j].style.fill = grid[j] ? (bad[j] ? BAD : STAR) : EMPTY;
      cells[j].setAttribute("aria-pressed", grid[j] ? "true" : "false");
    }
    var tint = function (n) { return n > 2 ? BAD : n === 2 ? TXT : DIM; };
    for (var r2 = 0; r2 < N; r2++) { rows[r2].textContent = rc[r2]; rows[r2].style.fill = tint(rc[r2]); }
    for (var c3 = 0; c3 < N; c3++) { cols[c3].textContent = cc[c3]; cols[c3].style.fill = tint(cc[c3]); }
  }
  function setGrid(bits) { for (var i = 0; i < N * N; i++) grid[i] = +bits[i]; out.textContent = ""; render(); }
  function toggle(i) { grid[i] ^= 1; out.textContent = ""; render(); }
  cells.forEach(function (el, i) {
    el.addEventListener("click", function () { toggle(i); });
    el.addEventListener("keydown", function (e) {
      var r = Math.floor(i / N), c = i % N, t = -1;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(i); return; }
      if (e.key === "ArrowLeft" && c > 0) t = i - 1;
      if (e.key === "ArrowRight" && c < N - 1) t = i + 1;
      if (e.key === "ArrowUp" && r > 0) t = i - N;
      if (e.key === "ArrowDown" && r < N - 1) t = i + N;
      if (t >= 0) { e.preventDefault(); cells[t].focus(); }
    });
    el.addEventListener("focus", function () { el.style.stroke = TXT; el.style.strokeWidth = "2"; });
    el.addEventListener("blur", function () { el.style.stroke = "none"; });
  });
  root.querySelectorAll("button[data-act]").forEach(function (b) {
    b.addEventListener("click", function () {
      var act = b.getAttribute("data-act");
      if (act === "reset") setGrid(new Array(N * N).fill(0));
      if (act === "key") setGrid(KEY);
      if (act === "miss") setGrid(MISS);
      if (act === "hint") {
        for (var k = 0; k < HINTS.length; k++) {
          var i = HINTS[k][0] * N + HINTS[k][1];
          if (!grid[i]) { toggle(i); break; }
        }
      }
      if (act === "check") {
        var v = checkGrid(grid);
        out.textContent = v.message + "   success=" + (v.success ? "1" : "0");
      }
    });
  });
  render();
})();
</script>

*Click or tap a cell to place a star. Check prints what the chip prints for the grid as drawn. The counts in the margins and the red cells are helpers; the chip itself only prints the message. Near miss loads a grid that breaks only the touching rule. Solution loads the key.*

Those 121 cells are the chip's 121 input bits, top left first, one row at a time. The chip is a checker for this exact puzzle, and the region map is baked into its gates. The rest of this post is how I found that out.
## Two stray messages

After the solve I tried the two inputs anyone would try. 121 zeros prints `EMPTY SKY`. 121 ones prints `BIG BANG`. Everything else I tried printed `TRY AGAIN`.

I didn't know what these meant, nor did I know what the chip computed. But another person who solved the puzzle asked me whether I recovered the Star Battle game. A published puzzle genre, two-star on 11 by 11 is a standard size, and the rules are the four at the top of this post.

Read the three messages again. An empty sky: no stars. A big bang: every cell a star. `(* TWO STARS *)`: the rule. That pushed me to experiment more.

## Counting the key

Lay the key out 11 wide, first bit top left.

<svg viewBox="-2 -2 246 246" width="246" height="246" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The 121-bit key as an 11 by 11 grid" style="display:block;margin:0 auto 1.5rem">
<rect x="1" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="177" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="221" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="23" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="133" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="177" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="221" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="23" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="67" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="111" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="155" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="67" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="199" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="111" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="1" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="45" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="155" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="89" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="1" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="133" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="199" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="45" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="89" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
</svg>

Two per row. Two per column. No two sharing an edge or a corner. The grid under the key was the decoding the whole time.

There's more constraints on the puzzle than these rules though. The solver finds more than a thousand grids meeting the criteria above. We know from Z3 in part 1 the chip has a unique solution. What shrinks the solution space is the Star Battle regions. [Multiple regions satisfy the correct input](#appendix-why-the-key-does-not-fix-the-regions), so I tried recovering them from the chip.
## Where the regions live

A flip-flop is one bit of memory; it takes a new value on every clock edge. A gate computes a value from the wires feeding it and remembers nothing. This chip has 92 flip-flops and 636 gates. Everything it knows between one input bit and the next lives in those 92 bits.

That already kills the design I guessed in part 1, a stored answer compared against the input. 92 bits cannot hold a 121-bit key, or the 121-cell grid being checked. The chip has to judge the grid as it streams past, keeping running counts.

<svg viewBox="0 0 640 236" width="640" height="236" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left, the 121-cell grid that arrives one bit per clock. Right, the chip's 92 flip-flops drawn as squares and grouped by role: 9 for position, 22 column tallies, 22 region tallies, 12 for the last input bits plus a touch flag, 3 for the row tally and its error latch, 8 for the total, 15 for the output generator." style="display:block;margin:0 auto 1rem;max-width:100%;height:auto">
<text x="20" y="16" text-anchor="start" style="font-family:var(--font-sans);font-size:11px;fill:var(--sl-color-text);font-weight:600">What comes in</text>
<rect x="20" y="30" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="35" y="30" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="50" y="30" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="65" y="30" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="80" y="30" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="95" y="30" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="110" y="30" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="125" y="30" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="140" y="30" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="30" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="170" y="30" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="20" y="45" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="35" y="45" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="50" y="45" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="65" y="45" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="80" y="45" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="95" y="45" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="110" y="45" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="125" y="45" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="140" y="45" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="45" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="170" y="45" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="20" y="60" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="35" y="60" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="50" y="60" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="65" y="60" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="80" y="60" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="95" y="60" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="110" y="60" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="125" y="60" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="140" y="60" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="60" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="170" y="60" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="20" y="75" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="35" y="75" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="50" y="75" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="65" y="75" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="80" y="75" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="95" y="75" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="110" y="75" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="125" y="75" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="140" y="75" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="75" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="170" y="75" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="20" y="90" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="35" y="90" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="50" y="90" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="65" y="90" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="80" y="90" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="95" y="90" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="110" y="90" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="125" y="90" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="140" y="90" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="90" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="170" y="90" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="20" y="105" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="35" y="105" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="50" y="105" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="65" y="105" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="80" y="105" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="95" y="105" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="110" y="105" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="125" y="105" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="140" y="105" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="105" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="170" y="105" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="20" y="120" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="35" y="120" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="50" y="120" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="65" y="120" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="80" y="120" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="95" y="120" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="110" y="120" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="125" y="120" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="140" y="120" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="120" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="170" y="120" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="20" y="135" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="35" y="135" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="50" y="135" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="65" y="135" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="80" y="135" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="95" y="135" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="110" y="135" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="125" y="135" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="140" y="135" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="135" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="170" y="135" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="20" y="150" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="35" y="150" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="50" y="150" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="65" y="150" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="80" y="150" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="95" y="150" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="110" y="150" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="125" y="150" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="140" y="150" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="150" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="170" y="150" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="20" y="165" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="35" y="165" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="50" y="165" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="65" y="165" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="80" y="165" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="95" y="165" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="110" y="165" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="125" y="165" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="140" y="165" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="165" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="170" y="165" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="20" y="180" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="35" y="180" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="50" y="180" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="65" y="180" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="80" y="180" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="95" y="180" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="110" y="180" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="125" y="180" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="140" y="180" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="180" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="170" y="180" width="13" height="13" rx="2" style="fill:var(--sl-color-gray-6)"/>
<text x="101.5" y="211" text-anchor="middle" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-gray-3)">121 cells, one bit each, one per clock</text>
<text x="222" y="16" text-anchor="start" style="font-family:var(--font-sans);font-size:11px;fill:var(--sl-color-text);font-weight:600">What the chip can remember</text>
<rect x="222" y="30" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="231" y="30" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="240" y="30" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="249" y="30" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="258" y="30" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="267" y="30" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="276" y="30" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="285" y="30" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="294" y="30" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<text x="428" y="38" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text)"> 9</text>
<text x="448" y="38" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-gray-3)">position: row and column</text>
<rect x="222" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="231" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="240" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="249" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="258" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="267" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="276" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="285" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="294" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="303" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="312" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="321" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="330" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="339" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="348" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="357" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="366" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="375" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="384" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="393" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="402" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="411" y="54" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<text x="428" y="62" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text)">22</text>
<text x="448" y="62" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-gray-3)">column tallies, 11 × 2 bits</text>
<rect x="222" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="231" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="240" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="249" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="258" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="267" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="276" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="285" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="294" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="303" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="312" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="321" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="330" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="339" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="348" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="357" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="366" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="375" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="384" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="393" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="402" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="411" y="78" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<text x="428" y="86" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text)">22</text>
<text x="448" y="86" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-gray-3)">region tallies, 11 × 2 bits</text>
<rect x="222" y="102" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="231" y="102" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="240" y="102" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="249" y="102" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="258" y="102" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="267" y="102" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="276" y="102" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="285" y="102" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="294" y="102" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="303" y="102" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="312" y="102" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="321" y="102" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="330" y="102" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<text x="428" y="110" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text)">13</text>
<text x="448" y="110" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-gray-3)">last 12 input bits + touch flag</text>
<rect x="222" y="126" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="231" y="126" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="240" y="126" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<text x="428" y="134" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text)"> 3</text>
<text x="448" y="134" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-gray-3)">row tally + row-error latch</text>
<rect x="222" y="150" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="231" y="150" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="240" y="150" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="249" y="150" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="258" y="150" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="267" y="150" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="276" y="150" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="285" y="150" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<text x="428" y="158" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text)"> 8</text>
<text x="448" y="158" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-gray-3)">total star count</text>
<rect x="222" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="231" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="240" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="249" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="258" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="267" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="276" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="285" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="294" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="303" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="312" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="321" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="330" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="339" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<rect x="348" y="174" width="7" height="7" rx="1.5" style="fill:var(--sl-color-gray-6)"/>
<text x="428" y="182" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text)">15</text>
<text x="448" y="182" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-gray-3)">output generator</text>
<line x1="222" y1="192" x2="418" y2="192" style="stroke:var(--sl-color-gray-3);stroke-width:0.8"/>
<text x="428" y="204" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text)">92</text>
<text x="448" y="204" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-gray-3)">flip-flops. 121 does not fit.</text>
</svg>

*The whole state of the chip is the 92 squares on the right. The grouping is what the rest of this section works out.*

So think about what a Star Battle checker has to keep, and look for it. Where the current cell sits: a row number and a column number. Stars per row, per column, per region. Whether a star has landed next to another. The total.

During the solve I had sorted the 92 flip-flops by their input cones, the gates between a flip-flop's input and the flip-flops and pins that feed it. The size of a cone says how much logic decides that bit; its sources say what the bit depends on. With the checklist above, the groups read off:

- 9 flip-flops that depend only on `enable` and each other. A 5-bit counter that runs 0 to 10 and wraps, and a 4-bit counter that steps on each wrap. The column and row of the current cell.
- 22 flip-flops in eleven pairs, a handful of gates each, fed by the input bit and the column counter. A 2-bit tally per column.
- 22 flip-flops in eleven pairs, about 150 gates each, fed by the input bit and both counters. A 2-bit tally per region. The 150 gates in front of each pair decide, from row and column, whether the current cell belongs to that region. Eleven of those is a 121-entry lookup table. The region map, written in gates.
- 12 flip-flops in a chain fed from the input pin, plus one flag. The last twelve bits, and a bit that remembers whether a star ever landed next to another. Why twelve is [below](#the-touch-check-in-12-bits).
- 3 flip-flops: a row tally, cleared at each row end, and a latch that remembers if a row ever ended with a count other than 2.
- 8 flip-flops: the total star count.
- 15 flip-flops at the far end of the die: the output generator. A character counter, the 8-bit register that drives `O`, and `success`.

Placement backs the reading. Across the die, about 180 um wide:

| Role                                   | Flops | x (um)  | Gates per flop |
| -------------------------------------- | ----- | ------- | -------------- |
| column position, 0 to 10               | 5     | 26-31   | 3-5            |
| row position, 0 to 10                  | 4     | 29-33   | 4-8            |
| last 12 input bits                     | 12    | 75-85   | 2              |
| touch flag                             | 1     | 88      | 8              |
| row tally (2 bits) and row-error latch | 3     | 79-82   | 6-8            |
| total star count (7 bits used)         | 8     | 76-83   | 4-7            |
| column tallies, 11 x 2 bits            | 22    | 113-116 | 4-7            |
| region tallies, 11 x 2 bits            | 22    | 114-123 | 151-154        |
| success and done                       | 3     | 168-172 | 1-48           |
| character counter                      | 4     | 168-170 | 2-3            |
| character register, drives `O`         | 8     | 167-175 | 9-15           |

Left to right: position, then the window and counts, then the tallies, then the output generator. The roles came from the cones. The placement agrees with them.

## Watching it run

The simulator can print every flip-flop after every clock, so I fed the key and watched the groups. The bit order inside each counter was unknown, so the script tries every permutation of a group's flops and keeps the one under which it counts up by one most often.

<div style="margin:0 auto 1rem;max-width:420px">
<video controls autoplay muted loop playsinline style="display:block;width:100%;border-radius:6px" src="/EngineeringPortfolio/projects/asicpuzzle2026-starbattle/key_streaming.mp4" aria-label="The key entering the chip one bit per frame. Beside the grid the column tally, region tally, 12-bit window, touch flag and total are read from the flip-flops after every clock edge, ending at total 22 and the success message."></video>
</div>

*The key going in one bit per frame. Every number beside the grid is read from the flip-flops after that clock edge, nothing is computed by the animation.*

The first two rows in detail:

| Edge | Cell    | Bit | Column tally | Region tally | Last 12 bits, newest left | Row tally   | Total |
| ---- | ------- | --- | ------------ | ------------ | ------------------------- | ----------- | ----- |
| 11   | (0, 7)  | 1   | column 7: 1  | C: 1         | `100000000000`            | 1           | 1     |
| 12   | (0, 8)  | 0   |              |              | `010000000000`            | 1           | 1     |
| 13   | (0, 9)  | 1   | column 9: 1  | D: 1         | `101000000000`            | 2           | 2     |
| 14   | (0, 10) | 0   |              |              | `010100000000`            | 0, row done | 2     |
| 15   | (1, 0)  | 1   | column 0: 1  | A: 1         | `101010000000`            | 1           | 3     |
| 20   | (1, 5)  | 1   | column 5: 1  | B: 1         | `100001010100`            | 2           | 4     |
| 25   | (2, 0)  | 0   |              |              | `000001000010`            | 0, row done | 4     |

*Decoded state while the key's first two rows go in. Region letters are the ones assigned when the [regions are recovered](#recovering-the-regions).*

The position counters behave as read. After cell 120 the column counter jumps to 16 and stays: done.

On every star the column tally, the region tally, the row tally and the total go up together, and the bit enters the chain. The row tally is checked against 2 and cleared at each row end. The total reads 22 at the end.

The key never puts a third star anywhere, so it cannot show what a 2-bit tally does past 2. A grid with row 0 and column 0 filled does. Column 0 takes eleven stars and reads 1, 2, 3, then 3 for the rest. The region and row tallies do the same. The tallies saturate. Otherwise six stars in a column would wrap round to 2 and pass.

Edge 125: `enable` has dropped, `success` goes high, and `O` shows `(`. One character per clock after that.

## The touch check in 12 bits

The no-touching rule looks like it needs the whole grid. It needs twelve bits.

<svg viewBox="0 0 640 248" width="640" height="248" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three rows of an 11-wide grid read one cell per clock. The current cell is marked. Every earlier cell is numbered by how many bits back it sits in the stream. The four earlier neighbours of the current cell are 1, 10, 11 and 12 back, all inside the 12-bit window the chip keeps; the four later neighbours are checked when their own star arrives. Below, the 12-bit chain with positions 1, 10, 11 and 12 outlined." style="display:block;margin:0 auto 1rem;max-width:100%;height:auto">
<text x="20" y="16" text-anchor="start" style="font-family:var(--font-sans);font-size:11px;fill:var(--sl-color-text);font-weight:600">Reading the grid one cell per clock</text>
<rect x="20" y="30" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<text x="32.0" y="45.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">16</text>
<rect x="46" y="30" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<text x="58.0" y="45.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">15</text>
<rect x="72" y="30" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<text x="84.0" y="45.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">14</text>
<rect x="98" y="30" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<text x="110.0" y="45.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">13</text>
<rect x="124" y="30" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5);stroke:var(--sl-color-accent);stroke-width:1.5"/>
<text x="136.0" y="45.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text);font-weight:600">12</text>
<rect x="150" y="30" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5);stroke:var(--sl-color-accent);stroke-width:1.5"/>
<text x="162.0" y="45.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text);font-weight:600">11</text>
<rect x="176" y="30" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5);stroke:var(--sl-color-accent);stroke-width:1.5"/>
<text x="188.0" y="45.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text);font-weight:600">10</text>
<rect x="202" y="30" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="214.0" y="45.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">9</text>
<rect x="228" y="30" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="240.0" y="45.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">8</text>
<rect x="254" y="30" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="266.0" y="45.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">7</text>
<rect x="280" y="30" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="292.0" y="45.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">6</text>
<rect x="20" y="56" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="32.0" y="71.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">5</text>
<rect x="46" y="56" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="58.0" y="71.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">4</text>
<rect x="72" y="56" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="84.0" y="71.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">3</text>
<rect x="98" y="56" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="110.0" y="71.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">2</text>
<rect x="124" y="56" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5);stroke:var(--sl-color-accent);stroke-width:1.5"/>
<text x="136.0" y="71.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text);font-weight:600">1</text>
<rect x="150" y="56" width="24" height="24" rx="2" style="fill:var(--sl-color-accent);stroke:var(--sl-color-text);stroke-width:2"/>
<rect x="176" y="56" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6);stroke:var(--sl-color-gray-3);stroke-width:1;stroke-dasharray:3 2"/>
<rect x="202" y="56" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="228" y="56" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="254" y="56" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="280" y="56" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="20" y="82" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="46" y="82" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="72" y="82" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="98" y="82" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="124" y="82" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6);stroke:var(--sl-color-gray-3);stroke-width:1;stroke-dasharray:3 2"/>
<rect x="150" y="82" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6);stroke:var(--sl-color-gray-3);stroke-width:1;stroke-dasharray:3 2"/>
<rect x="176" y="82" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6);stroke:var(--sl-color-gray-3);stroke-width:1;stroke-dasharray:3 2"/>
<rect x="202" y="82" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="228" y="82" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="254" y="82" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="280" y="82" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6)"/>
<rect x="322" y="32" width="12" height="12" rx="2" style="fill:var(--sl-color-accent);stroke:var(--sl-color-text);stroke-width:1.5"/>
<text x="340" y="42" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text)">the star arriving now</text>
<rect x="322" y="52" width="12" height="12" rx="2" style="fill:var(--sl-color-gray-5);stroke:var(--sl-color-accent);stroke-width:1.5"/>
<text x="340" y="62" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text)">its earlier neighbours: 1, 10, 11, 12 back</text>
<rect x="322" y="72" width="12" height="12" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="340" y="82" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-gray-3)">still in the 12-bit window</text>
<rect x="322" y="92" width="12" height="12" rx="2" style="fill:var(--sl-color-gray-6);stroke:var(--sl-color-gray-3);stroke-width:1;stroke-dasharray:3 2"/>
<text x="340" y="102" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-gray-3)">later neighbours: checked when their star arrives</text>
<text x="20" y="122" text-anchor="start" style="font-family:var(--font-mono);font-size:8.5px;fill:var(--sl-color-gray-3)">numbers: how many bits back each cell sits in the stream. shifting one row up is 11 back, so up-left, up, up-right are 12, 11, 10.</text>
<text x="20" y="156" text-anchor="start" style="font-family:var(--font-sans);font-size:11px;fill:var(--sl-color-text);font-weight:600">What the chip keeps</text>
<text x="170" y="156" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-gray-3)">the last 12 bits, newest on the left, plus one flag</text>
<rect x="20" y="166" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5);stroke:var(--sl-color-accent);stroke-width:1.5"/>
<text x="32.0" y="181.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text);font-weight:600">1</text>
<rect x="46" y="166" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="58.0" y="181.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">2</text>
<rect x="72" y="166" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="84.0" y="181.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">3</text>
<rect x="98" y="166" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="110.0" y="181.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">4</text>
<rect x="124" y="166" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="136.0" y="181.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">5</text>
<rect x="150" y="166" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="162.0" y="181.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">6</text>
<rect x="176" y="166" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="188.0" y="181.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">7</text>
<rect x="202" y="166" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="214.0" y="181.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">8</text>
<rect x="228" y="166" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5)"/>
<text x="240.0" y="181.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:8px;fill:var(--sl-color-gray-3)">9</text>
<rect x="254" y="166" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5);stroke:var(--sl-color-accent);stroke-width:1.5"/>
<text x="266.0" y="181.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text);font-weight:600">10</text>
<rect x="280" y="166" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5);stroke:var(--sl-color-accent);stroke-width:1.5"/>
<text x="292.0" y="181.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text);font-weight:600">11</text>
<rect x="306" y="166" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-5);stroke:var(--sl-color-accent);stroke-width:1.5"/>
<text x="318.0" y="181.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-text);font-weight:600">12</text>
<rect x="346" y="166" width="24" height="24" rx="2" style="fill:var(--sl-color-gray-6);stroke:var(--sl-color-red);stroke-width:1.5"/>
<text x="358.0" y="181.5" text-anchor="middle" style="font-family:var(--font-mono);font-size:7.5px;fill:var(--sl-color-text)">flag</text>
<text x="380" y="176" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-gray-3)">sets when a star arrives and</text>
<text x="380" y="188" text-anchor="start" style="font-family:var(--font-mono);font-size:9px;fill:var(--sl-color-gray-3)">any outlined bit holds one. never clears.</text>
<text x="20" y="208" text-anchor="start" style="font-family:var(--font-mono);font-size:8.5px;fill:var(--sl-color-gray-3)">a star in column 10 followed by one in column 0 is 1 bit back but not a neighbour; the column counter rules it out.</text>
</svg>

*Where a star's earlier neighbours sit in the stream. Moving up one row is eleven cells back, so the three cells above are 10, 11 and 12 back, and the cell to the left is 1 back.*

The 12-flop chain is that window. When a star arrives, the flag sets if there is a star 1, 10, 11 or 12 cells back. Two stars that touch are always seen from whichever comes second, so those four directions cover all eight. A star in column 10 followed by one in column 0 of the next row is 1 bit back but not a neighbour, and the column counter excludes it. I probed two stars at every offset up to 13 against the plain rule, 1542 inputs: no disagreements. For the key the flag never sets. What the chip says when it does is in [an appendix](#appendix-the-fifth-message).

## Recovering the regions

Reading the 150-gate lookups was unnecessary. Feeding the chip a grid with a single star shows which region tally moves, so that cell belongs to that region. 121 runs, one per cell, gave the whole map.

<div style="margin:0 auto 1rem;max-width:420px">
<video controls autoplay muted loop playsinline style="display:block;width:100%;border-radius:6px" src="/EngineeringPortfolio/projects/asicpuzzle2026-starbattle/region_recovery.mp4" aria-label="121 simulator runs with one star each. After every run the one region tally that moved lights up and the cell takes that region's letter, until all eleven regions are coloured in."></video>
</div>

*One star per cell, 121 runs. After each run the tally that moved names the cell's region.*

```text
AAAAABBCDDE
AAFAABCCDDE
AAFBBBBCCDE
AAFBGGGECCE
FAFBGEEEEEE
FFFBGGGEHHH
BBBBBBGEHII
BJJJGGGEHII
BJJKEEEEHII
BBJKKEEEHHH
BJJKEEEEEEE
```

| Region | A  | B  | C | D | E  | F | G  | H | I | J | K |
| ------ | -- | -- | - | - | -- | - | -- | - | - | - | - |
| Cells  | 14 | 21 | 7 | 5 | 28 | 8 | 11 | 9 | 6 | 8 | 4 |

Eleven regions, all edge-contiguous. These are the outlines in the grid at the top of this post. The key has two stars in each.

Then close the loop without the chip. Write down only the rules, two per row, column and region, no two stars sharing an edge or a corner, over this map, and ask Z3 for every solution. One. It is the key.

The uniqueness proof in part 1 unrolled 636 gates over 129 cycles. This one never mentions a gate. Two encodings that share nothing, one answer. The regions are the puzzle, and they are the one part of the chip a person designed by hand.

## What I learnt

Step 3 of my plan in part 1 was "reconstruct chip function by hand, Minesweeper on steroids". I never did it by hand, and the function turned out to be a cousin of Minesweeper.

The tools were enough on the day of the solve. The question was not. Once a comment on a post supplied the hypothesis, the same simulator gave the counters, the touch window, the message table and the region map, one experiment at a time. None of it came from reading the layout.

Each step was checked against something that did not depend on it. The extractor against the warmup and the simulator against the waveform in part 1. Here, the flop roles against the trace, the touch flag against the plain rule, and the regions against a solve that never mentions a gate.

## Appendix: why the key does not fix the regions

Write the region rule as arithmetic. The key is a set $K$ of 22 cells. A region map is a partition of the 121 cells into eleven connected pieces $R_1, \ldots, R_{11}$. The map agrees with the key when $|R_i \cap K| = 2$ for every $i$, and it is a puzzle when the key is its only solution.

The first condition is not a very useful constraint. It says nothing about the 99 empty cells beyond keeping each region connected. The real map is one way to split them. Move one empty cell across a boundary and you have another map that agrees with the key just as well.

Uniqueness is a better condition, so the question is whether it singles out the real map. The test: take every empty cell, move it into each neighbouring region, discard any map where a region comes apart, and ask Z3 for all solutions of the altered puzzle under the four rules.

<div style="display:flex;flex-wrap:wrap;gap:1.5rem;justify-content:center;margin:0 auto 1.5rem">
<svg viewBox="-2 -2 246 246" width="246" height="246" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The real region map with the key's stars" style="display:block;max-width:100%;height:auto">
<rect x="1" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="177" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="221" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="23" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="133" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="177" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="221" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="23" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="67" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="111" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="155" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="67" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="199" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="111" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="1" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="45" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="155" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="89" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="1" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="133" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="199" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="45" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="89" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<line x1="0" y1="0" x2="0" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="0" x2="22" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="0" x2="44" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="0" x2="66" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="22" x2="66" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="0" x2="88" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="0" x2="110" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="0" x2="110" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="0" x2="132" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="0" x2="154" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="0" x2="154" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="22" x2="154" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="0" x2="176" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="0" x2="176" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="0" x2="198" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="0" x2="220" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="0" x2="220" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="0" x2="242" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="0" x2="242" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="22" x2="0" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="22" x2="44" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="22" x2="66" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="44" x2="88" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="22" x2="110" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="44" x2="110" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="22" x2="132" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="44" x2="154" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="22" x2="176" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="44" x2="198" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="22" x2="220" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="22" x2="242" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="44" x2="0" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="44" x2="44" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="44" x2="66" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="66" x2="110" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="66" x2="132" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="44" x2="154" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="66" x2="154" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="66" x2="176" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="44" x2="198" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="44" x2="220" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="66" x2="220" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="44" x2="242" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="66" x2="0" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="88" x2="22" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="66" x2="44" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="66" x2="66" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="66" x2="88" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="88" x2="132" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="66" x2="154" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="88" x2="154" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="66" x2="176" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="88" x2="198" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="66" x2="220" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="88" x2="220" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="66" x2="242" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="88" x2="0" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="88" x2="22" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="88" x2="44" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="110" x2="44" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="88" x2="66" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="88" x2="88" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="88" x2="110" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="110" x2="132" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="110" x2="154" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="110" x2="198" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="110" x2="220" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="88" x2="242" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="110" x2="242" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="110" x2="0" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="132" x2="22" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="132" x2="44" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="110" x2="66" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="132" x2="66" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="110" x2="88" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="132" x2="110" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="132" x2="132" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="110" x2="154" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="110" x2="176" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="132" x2="220" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="110" x2="242" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="132" x2="242" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="132" x2="0" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="154" x2="44" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="154" x2="66" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="154" x2="88" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="154" x2="110" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="132" x2="132" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="154" x2="132" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="132" x2="154" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="132" x2="176" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="132" x2="198" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="132" x2="242" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="154" x2="0" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="154" x2="22" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="154" x2="88" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="176" x2="88" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="176" x2="110" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="176" x2="132" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="154" x2="154" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="176" x2="154" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="154" x2="176" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="154" x2="198" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="154" x2="242" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="176" x2="0" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="176" x2="22" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="198" x2="44" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="176" x2="66" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="176" x2="88" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="198" x2="110" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="176" x2="176" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="176" x2="198" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="198" x2="220" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="176" x2="242" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="198" x2="242" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="198" x2="0" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="198" x2="44" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="220" x2="44" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="198" x2="66" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="198" x2="110" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="220" x2="110" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="198" x2="176" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="220" x2="198" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="220" x2="220" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="198" x2="242" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="220" x2="242" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="220" x2="0" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="220" x2="22" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="242" x2="22" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="242" x2="44" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="220" x2="66" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="242" x2="66" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="220" x2="88" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="242" x2="88" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="242" x2="110" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="242" x2="132" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="242" x2="154" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="242" x2="176" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="242" x2="198" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="242" x2="220" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="220" x2="242" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="242" x2="242" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
</svg>
<svg viewBox="-2 -2 246 246" width="246" height="246" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A region map that differs from the real one by one cell, row 0 column 4, moved from region A to region B, shown in red, with the key's stars" style="display:block;max-width:100%;height:auto">
<rect x="1" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-red)"/>
<rect x="111" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="177" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="221" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="23" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="133" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="177" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="221" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="23" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="67" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="111" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="155" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="67" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="199" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="111" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="1" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="45" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="155" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="89" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="1" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="133" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="199" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="45" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="89" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<line x1="0" y1="0" x2="0" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="0" x2="22" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="0" x2="44" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="0" x2="66" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="22" x2="66" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="0" x2="88" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="0" x2="88" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="0" x2="110" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="22" x2="110" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="0" x2="132" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="0" x2="154" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="0" x2="154" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="22" x2="154" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="0" x2="176" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="0" x2="176" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="0" x2="198" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="0" x2="220" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="0" x2="220" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="0" x2="242" y2="0" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="0" x2="242" y2="22" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="22" x2="0" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="22" x2="44" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="22" x2="66" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="44" x2="88" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="22" x2="110" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="44" x2="110" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="22" x2="132" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="44" x2="154" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="22" x2="176" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="44" x2="198" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="22" x2="220" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="22" x2="242" y2="44" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="44" x2="0" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="44" x2="44" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="44" x2="66" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="66" x2="110" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="66" x2="132" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="44" x2="154" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="66" x2="154" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="66" x2="176" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="44" x2="198" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="44" x2="220" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="66" x2="220" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="44" x2="242" y2="66" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="66" x2="0" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="88" x2="22" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="66" x2="44" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="66" x2="66" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="66" x2="88" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="88" x2="132" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="66" x2="154" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="88" x2="154" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="66" x2="176" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="88" x2="198" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="66" x2="220" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="88" x2="220" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="66" x2="242" y2="88" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="88" x2="0" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="88" x2="22" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="88" x2="44" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="110" x2="44" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="88" x2="66" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="88" x2="88" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="88" x2="110" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="110" x2="132" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="110" x2="154" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="110" x2="198" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="110" x2="220" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="88" x2="242" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="110" x2="242" y2="110" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="110" x2="0" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="132" x2="22" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="132" x2="44" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="110" x2="66" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="132" x2="66" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="110" x2="88" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="132" x2="110" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="132" x2="132" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="110" x2="154" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="110" x2="176" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="132" x2="220" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="110" x2="242" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="132" x2="242" y2="132" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="132" x2="0" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="154" x2="44" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="154" x2="66" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="154" x2="88" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="154" x2="110" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="132" x2="132" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="154" x2="132" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="132" x2="154" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="132" x2="176" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="132" x2="198" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="132" x2="242" y2="154" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="154" x2="0" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="154" x2="22" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="154" x2="88" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="176" x2="88" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="176" x2="110" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="176" x2="132" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="154" x2="154" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="176" x2="154" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="154" x2="176" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="154" x2="198" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="154" x2="242" y2="176" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="176" x2="0" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="176" x2="22" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="198" x2="44" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="176" x2="66" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="176" x2="88" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="198" x2="110" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="176" x2="176" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="176" x2="198" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="198" x2="220" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="176" x2="242" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="198" x2="242" y2="198" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="198" x2="0" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="198" x2="44" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="220" x2="44" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="198" x2="66" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="198" x2="110" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="220" x2="110" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="198" x2="176" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="220" x2="198" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="220" x2="220" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="198" x2="242" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="220" x2="242" y2="220" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="220" x2="0" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="220" x2="22" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="0" y1="242" x2="22" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="22" y1="242" x2="44" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="220" x2="66" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="44" y1="242" x2="66" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="220" x2="88" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="66" y1="242" x2="88" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="88" y1="242" x2="110" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="110" y1="242" x2="132" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="132" y1="242" x2="154" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="154" y1="242" x2="176" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="176" y1="242" x2="198" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="198" y1="242" x2="220" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="242" y1="220" x2="242" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
<line x1="220" y1="242" x2="242" y2="242" style="stroke:var(--sl-color-text);stroke-width:2.5;stroke-linecap:square"/>
</svg>
</div>

*Left, the real map. Right, one of the alternatives: cell (0, 4) moved from region A to region B. Both have the key as their only solution.*

| Variant of the real map                | Maps tried | Key is the unique solution |
| -------------------------------------- | ---------- | -------------------------- |
| one empty cell moved                   | 47        | 38                         |
| two of those moves applied together    | 677        | 671                        |

Uniqueness is a property most nearby maps share, not a fingerprint of the real one. Nothing in the 121 input bits separates these maps from each other, so the boundaries cannot be recovered from the key. They had to come from the chip.

## Appendix: the fifth message

The touch flag never set for the key. Rather than guess at grids that set it, ask for every message the chip can print.

The simulator can run with the 121 input bits symbolic, so the printed string is a formula over them. Ask Z3 for an input whose string is not `TRY AGAIN`. Run it, read what it printed, block that message, ask again. When Z3 answers unsat, every possible input prints one of the messages already found. It stopped at five:

| Message            | Inputs that print it                            |
| ------------------ | ----------------------------------------------- |
| `TRY AGAIN`        | almost everything                               |
| `EMPTY SKY`        | all zeros, only                                 |
| `BIG BANG`         | all ones, only                                  |
| `TWO"NOT TOUCH`    | a family of near misses, every one with 22 ones |
| `(* TWO STARS *)`  | the key, only                                   |

The quote mark is what the chip prints. Every input in the fourth row has two stars per row, column and region and at least one touching pair. This one has exactly one:

<svg viewBox="-2 -2 246 246" width="246" height="246" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A near miss as an 11 by 11 grid: 22 stars, two per row, column and region, with the touching pair at row 9 column 4 and row 10 column 3 in red" style="display:block;margin:0 auto 1.5rem">
<rect x="1" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="177" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="221" y="1" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="45" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="133" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="23" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="177" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="221" y="45" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="23" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="67" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="67" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="111" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="155" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="89" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="67" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="199" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="111" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="23" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="133" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="1" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="89" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="133" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="155" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="45" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="177" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="1" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="89" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-red)"/>
<rect x="111" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="155" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="199" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="199" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="1" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="23" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="45" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="67" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-red)"/>
<rect x="89" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="111" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="133" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-accent)"/>
<rect x="155" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="177" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="199" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
<rect x="221" y="221" width="20" height="20" rx="3" style="fill:var(--sl-color-gray-6)"/>
</svg>

*The near miss with the fewest touching pairs, found with Z3 and run through the simulator. The pair is in red.*

Compare the chip's flip-flops after the key and after this grid. A single one differs: the touch flag. Set it in the key's final state and the chip prints `TWO"NOT TOUCH`. Clear it here and it prints `(* TWO STARS *)`.

Traced, the star at (10, 3) arrives on edge 117 with a star ten cells back in the chain, at (9, 4), its up-right neighbour. The window reads `100000100010`. The flag sets on that edge and stays. Every other group matches the key's trace: every tally 2, total 22. On edge 125 `success` stays low and the output starts `T`, `W`, `O`.

The eight-flop total does one more job. It selects which of five fixed strings the output generator plays. Flip any one of those eight in the final state and the message turns into garbage like `,[.R..%>1...d`, because the generator is reading a string that does not exist. Patch the total properly and replay:

| State after 121 cells                                       | Message                    |
| ----------------------------------------------------------- | -------------------------- |
| total star count 0                                          | `EMPTY SKY`                |
| total star count 121                                        | `BIG BANG`                 |
| every row, column and region tally 2, touch flag set        | `TWO"NOT TOUCH`            |
| every tally 2, no touch, total 22                           | `(* TWO STARS *)`, success |
| anything else                                               | `TRY AGAIN`                |
