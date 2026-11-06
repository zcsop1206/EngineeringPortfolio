# The dare

## My first chip, from the wrong end

Jane Street published a chip's layout and asked what it prints for the right input.

I am a mechanical engineering student. I thought knowing 3D printing file formats would help. It did not, but it got me started.

![](#fig-1)

## What you are given

Polygons on layers, nothing labelled. One input bit per clock, eight output bits, one success pin.

And a few hints, most of which I misread.

![The die image from the puzzle](asiclayout.png)

# The plan

## Undo the factory, one step at a time

Making a chip throws away structure at every stage. I chose to reverse the stages, and to build each tool on the small warmup chip, where the answer is known.

![The warmup's placement, coloured by module](asicplacement.png)

## Polygons back into wires

Overlapping metal is one wire. A via joins two layers. Each cell is a named black box.

Names do not survive, so I checked shape: my circuit and the true one are the same graph.

![](#fig-4)

# Wrong turns

## Three guesses, three misses

- I sized the key at about 780 bits. It is 121.
- I guessed a stored answer and a comparator. There is no stored answer.
- I planned to read the circuit by hand. I never did.

## Stuck

I tried to sort 728 cells back into modules. Best case 16 wrong out of 79, with every setting tuned on the warmup.

On the real chip that is a confident wrong answer with no way to tell. I dropped it.

# The clue

## It had been in the repo for a week

The sample recording fits on one screen. The output is text, one letter per clock. Each attempt is 121 bits and ends in TRY AGAIN.

That is the protocol, the key length, and a free test.

![The sample waveform. The cursor is on a G.](asicsurfer.png)

## So I never needed to understand the chip

Simulate the wires I had already extracted. If the simulation prints TRY AGAIN on the same clock edges as the recording, it is the chip.

It did.

# The answer

## Ask a solver instead of guessing

The same circuit as constraints, with one demand: success goes high. Z3 returns one key, and proves there is no other.

![](#fig-6)

## What it prints

(* TWO STARS *)

All zeros prints EMPTY SKY. All ones prints BIG BANG. The chip checks an 11 by 11 Star Battle grid, and the key is the solved puzzle.

## Ask me about

- How I know the extraction is right
- How I worked out it was Star Battle
- What the hints meant in hindsight
- What I would do first next time
