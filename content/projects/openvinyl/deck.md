# Why

## Can a hobby printer make a record that plays?

A project with two collaborators: print a record on an FDM printer and play it on a turntable we built for it.

v1 worked, barely. This year I went back to first principles and reversed its central decision.

![The v1 record](openvinyl_v1_record.jpg)

# What it is

## Audio in, groove geometry out

Software that turns a sound file into the path the printer's nozzle follows. Every groove parameter comes from three hardware facts: bead width, stylus contact and printer acceleration.

# The problem

## The bead is 10 to 20 times too wide

A printed bead is 0.48 mm. A real vinyl groove is far narrower. A sideways wiggle looked impossible, so v1 stored the audio as depth.

![](openvinyl_v1_mesh_build.mp4)

## What makes it hard

- The stylus presses at several times the yield stress of PLA. First play deforms the groove.
- Amplitude times frequency is capped by groove slope, and the cap changes with radius.
- The printer's acceleration caps the same product.

# The work

## The constraint was the slicer, not the bead

A slicer can only reproduce a mesh at bead resolution. Write the G-code directly and the same 0.48 mm bead can be placed to about 0.01 mm.

So v2 cuts sideways, on the printer's fast and precise axes.

## The v2 groove

Two beads per turn, side by side. A crease forms between them. Both wiggle together and the stylus rides the crease.

![Decoded from the G-code file itself](openvinyl_v2_preview_melody.png)

## Print speed follows the music

Each segment's speed is set from its curvature. Loud passages print slowly, quiet ones fast. The groove pass takes about 25 minutes.

![The file as the printer will run it](openvinyl_v2_toolpath_melody.mp4)

## Prove the file, not the code

The tool decodes the G-code it just wrote back into audio. A 440 Hz tone at 100 µm commanded comes back at 100.5 µm.

That round trip caught a bug that had scaled every record to 79%.

## Break it on purpose

A stress disc: a tone ladder from 300 to 680 Hz that pushes the slope limit and the speed schedule.

![The stress disc](openvinyl_v2_preview_stress_ladder.png)

## What is not known yet

v2 is verified in software and not printed. The main risk is tracking: whether a stylus stays in a crease between two round beads for 40 turns.

So the first prints are small coupons, one question each.

## Ask me about

- The contact mechanics and why first play does not matter in v2
- What v1 actually printed and played
- Constant speed or slowing the platter as the needle moves in
- What play time the sideways cut costs
