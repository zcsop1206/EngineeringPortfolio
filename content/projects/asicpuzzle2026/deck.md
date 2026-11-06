# Why

## A puzzle, and a wrong assumption

Jane Street posted a chip's layout and asked what it prints for the right input.

I am a mechanical engineering student and this was my first ASIC. I thought knowing 3D printing file formats would help. It did not, but it got me started.

![](#fig-1)

# What it is

## A chip with no labels

A layout file: polygons on layers. One input bit per clock, an 8-bit output, a success pin.

I turned the polygons back into a circuit, simulated it, and solved for the 121-bit key.

![The die image from the puzzle](asiclayout.png)

# The problem

## Everything is there and nothing is named

Each step of making a chip throws away structure. The layout is the last step.

Brute force is out: the key is 121 bits.

## What makes it hard

- No answer to check against on the real chip.
- 728 cells of 69 types, 92 flip-flops.
- I did not know what the chip was checking.

# The work

## Test the tools where the answer is known

The puzzle ships a small warmup chip at every stage, source to layout. In it, cells of the same module sit together, so placement is evidence.

![The warmup's placement, coloured by module](asicplacement.png)

## Polygons back into wires

Trace connectivity through metal and vias, treat each cell as a named black box.

Names do not survive into a layout, so I compared shape: my circuit and the true one as graphs, and checked they are the same graph.

![](#fig-4)

## Where I got stuck

I tried to cluster the circuit back into modules so a person could read it. Best case 16 wrong out of 79, and every parameter was tuned on the warmup.

On the real chip that gives a confident wrong answer with no way to tell. I dropped it.

## The waveform had the shape of the answer

The sample recording had been in the repo for a week. The output is text, one character per clock. Each attempt is exactly 121 bits and ends in TRY AGAIN.

That is the protocol, the key length, and a free test for a simulator.

![The sample waveform. The cursor is on a G.](asicsurfer.png)

## A software twin, then a solver

A Python model of the extracted circuit, checked by replaying the recording: it prints TRY AGAIN at the same clock edges.

Then the same circuit as constraints for Z3, asking for success high. One key. It is unique.

![](#fig-6)

## What it prints

(* TWO STARS *). The chip is an 11 by 11 Star Battle checker, and the key is the solved grid.

All zeros prints EMPTY SKY. All ones prints BIG BANG.

## Ask me about

- How I know the extraction is right
- Why the key is unique
- How I found out it was Star Battle
- What I would do differently
