Written by a model for Adit. Not Adit's words.

# Putnam

First iteration, 2026-11-07, for the sitting on 2026-12-05. Every section is a topic you can mark with `%% lost %%`, `%% easy %%` or `%% forgot %%`; the next `/teach` run rewrites it to your level. Problems are referred to by source and number and never copied here: the archive at https://kskedlaya.org/putnam-archive/ has every paper from 1985 and solutions from 1995 (files `2024.pdf` and `2024s.pdf`), and the MIT seminar 18.A34, Fall 2018, by Yufei Zhao, has eleven topic problem sets at https://ocw.mit.edu/courses/18-a34-mathematical-problem-solving-putnam-seminar-fall-2018/pages/assignments/ (CC BY-NC-SA 4.0). PS n below means that seminar's problem set n.

## The plan to 2026-12-05

Four weeks, six problems a week, domain math in calls.md. Each problem: read it, type the call line before anything else (the object, the technique you expect, the first assumption, the time you will give it, a confidence), then work. The time box is 25 minutes for an A1, A2, B1 or B2 and 45 for anything harder; when it runs out, open the solution in the archive and settle the call the same sitting. A problem you solve is still settled: held if the technique you named carried it, missed if a different one from your list did, blind if the solution uses something you did not consider. Three problems a week come from the seminar set for that week's topic, three from the A1, A2, B1, B2 of a year you have not seen, newest first.

- Week of 2026-11-09: hidden independence and uniformity (PS 1), pigeonhole and extremal arguments (the seminar's pigeonhole set from an earlier year), sums and integrals (PS 2).
- Week of 2026-11-16: inequalities (PS 5), recurrences (PS 4), congruences (PS 9).
- Week of 2026-11-23: linear algebra (PS 7), probability (PS 6), combinatorial configurations (PS 10). On the Saturday, a timed half paper: one A session, three hours, six problems, from a year you have not seen, each with its call on paper first, typed in that evening with the date.
- Week of 2026-11-30: generating functions (PS 11), analysis and limits (PS 3), roots of polynomials (the earlier-year set). A second timed half paper on the Wednesday. Thursday and Friday: no new problems; read the Misses section of readout.md and the Known section once each.

On 2026-12-05: on each problem, before working, two lines on the paper, the call. That evening, type the twelve lines in with the date and the domain putnam. Settle each when the archive posts the solutions, usually within the week. Run `/profile` the following weekend.

## Reading a problem

A Putnam problem is the analogy puzzle at scale: find the relevant information, induce the rule, apply it. Three questions before any technique. What is the object: a number, a function, a set, a sequence, a matrix, a polynomial, a configuration. What is being asked: show one exists, show it holds for all, compute a value, decide yes or no. What is the smallest case: n equal to 1, 2, 3, the empty set, the zero polynomial, written out by hand. The smallest cases usually name the technique, and they are the cheapest thing you can do before the call line. A1 and B1 are built to be solved in this way; A6 and B6 are not, and the plan above never spends a call on them before December.

The call line for a problem names the technique as a model would be named at the furnace: "2023 B1: parity invariant on the board, assume the move count is what matters, 25 min. 60". The settle names what actually carried the solution.

## Hidden independence and uniformity

Recognise it when a problem has a symmetry it does not mention: points chosen at random, a sum over all permutations, a quantity that should not depend on a choice that was made. The model: find the random variable or the group action under which the thing asked for is invariant, then compute in the easiest representative. Uniformity means every element of a symmetric set is equally likely or equally weighted, so an average over the set equals the value at any one element. First assumption to try: the answer does not depend on the parameter the problem seems to care about. Trap: an independence that looks obvious and is false; check it on the smallest case. Practice: PS 1.

## Pigeonhole and extremal arguments

Pigeonhole: more objects than boxes forces two in one box. Recognise it when a problem asks to show two things coincide, or that some difference is divisible, or that a pattern repeats. The work is choosing the boxes: residues modulo n, intervals of length 1/n, subsets by size. The extremal argument: look at the largest, smallest, first or last object, and ask what its being extreme forces. Recognise it when a problem asks for existence with no construction in sight. First assumption: the obvious boxes, residues or intervals, before anything cleverer. Trap: counting the boxes wrong by one. Practice: the seminar's pigeonhole set; most B1 problems of the 2000s.

## Invariants and monovariants

An invariant is a quantity that a process leaves unchanged; a monovariant is one it moves in one direction. Recognise them when a problem describes moves, operations or a game and asks whether a state is reachable or whether the process stops. The model: find a number, often a parity, a sum or a product modulo something, that every move preserves, and compare its value at the start and at the target. For termination, find a quantity that strictly decreases in a well-ordered set. First assumption: parity. Trap: a quantity preserved by most moves and not by one. Practice: the A1 and B1 of recent years, where this appears every few years.

## Induction

Recognise it when the statement has a natural number in it and the n case is built from smaller ones. Ordinary induction uses n minus 1; strong induction uses every smaller case; a two-variable statement sometimes needs induction on one variable with the other fixed. The model choice inside induction is the strengthening: the statement as given is often too weak to pass from n minus 1 to n, and a stronger statement, with an extra term or a tighter bound, is what the step needs. First assumption: the statement as given; when the step fails, ask what extra fact about n minus 1 you wished you had, and add it to the claim. Trap: a base case that is not the one the step starts from. Practice: everywhere; the recurrences set (PS 4) is induction in disguise.

## Inequalities

Recognise them when a problem asks to bound a sum, product or integral, or to find the largest or smallest value of an expression. The three models that carry most Putnam inequalities: the arithmetic-geometric mean inequality (the arithmetic mean of positive numbers is at least their geometric mean, equal only when they are all equal), Cauchy-Schwarz (the square of a sum of products is at most the product of the sums of squares), and convexity through Jensen (for a convex function, the function of an average is at most the average of the function). Equality cases tell you which inequality the problem was built from: all terms equal points to AM-GM, proportional sequences to Cauchy-Schwarz. First assumption: the expression is symmetric and the extreme is at the symmetric point; check it, since the extreme is sometimes at a boundary. Trap: applying an inequality in the direction that gives a bound the wrong way. Practice: PS 5.

## Polynomials and their roots

Recognise them when a polynomial is given by a property of its roots or its values rather than its coefficients. Models: Vieta's formulas (coefficients are the elementary symmetric functions of the roots), the factor theorem (a root r means a factor x minus r), degree counting (a polynomial of degree n with more than n roots is zero), and the complex roots of unity for anything cyclic. A polynomial equal to another at infinitely many points is the same polynomial, which turns an identity into a finite check. First assumption: write the polynomial by its roots, not its coefficients. Trap: forgetting that roots may be complex or repeated. Practice: the earlier-year roots set; A2 and B2 problems often.

## Congruences and number theory

Recognise them when a problem is about integers, divisibility, remainders or primes. Models: arithmetic modulo n (the integers collapse to n classes and the operations respect them), Fermat's little theorem (a to the p minus 1 is 1 modulo a prime p not dividing a) and Euler's generalisation, the order of an element (the smallest exponent that returns 1, which divides every exponent that does), and the Chinese remainder theorem (congruences modulo coprime moduli can be solved together). First assumption: reduce modulo a small prime or modulo 4 and look at the cases. Trap: dividing both sides of a congruence by something not coprime to the modulus. Practice: PS 9.

## Recurrences

Recognise them when a sequence is defined from its earlier terms, or when a count for n is built from counts for smaller n. Models: a linear recurrence with constant coefficients is solved by its characteristic polynomial (the roots give the geometric sequences the solution is a combination of); a recurrence that looks nonlinear often linearises by a substitution; and a closed form guessed from the first few terms is proved by induction. First assumption: compute six terms by hand and look them up in your head; many Putnam sequences are Fibonacci, Catalan or a power in disguise. Trap: a characteristic root that is repeated, which brings in a factor of n. Practice: PS 4.

## Sums, integrals and limits

Recognise them when a sum or integral has to be evaluated or bounded, or a limit found. Models: telescoping (write the term as a difference so the sum collapses), swapping the order of a double sum or integral, a Riemann sum (a sum of n terms with 1 over n in front is an integral in the limit), and comparison with an integral to bound a sum. For limits, squeeze between two things you can compute, or recognise a derivative or an integral in the definition. First assumption: the sum telescopes, which means finding f with term equal to f of k plus 1 minus f of k. Trap: swapping an order of summation when the double sum does not converge absolutely. Practice: PS 2 and PS 3.

## Probability and expectation

Recognise it when a problem says random, expected, probability, or when a counting problem can be read as one. The model: linearity of expectation, the expected value of a sum is the sum of the expected values, with no independence needed. Most Putnam probability problems reduce to writing the quantity as a sum of indicator variables (1 if an event happens, 0 if not) and summing their probabilities. First assumption: indicators. Trap: assuming independence to multiply probabilities when the events share randomness. Practice: PS 6; this overlaps with the hidden independence set.

## Linear algebra

Recognise it when matrices, determinants, ranks or vector spaces appear, or when a problem about numbers or functions has a hidden vector space (polynomials of degree at most n, functions on a finite set). Models: rank and nullity (the dimension of the image plus the dimension of the kernel is the dimension of the source), eigenvalues (a matrix acts as a scalar on an eigenvector, and the trace and determinant are the sum and product of the eigenvalues), and the determinant as a polynomial in the entries. First assumption: the thing asked for is the trace or the determinant of something. Trap: a matrix that is not diagonalisable. Practice: PS 7.

## Combinatorial configurations

Recognise them when a problem is about arrangements, colourings, graphs, tilings or subsets with a property. Models: double counting (count the same set two ways and equate), bijection (match the objects to a set you can count), the probabilistic method (show an object exists by showing a random one works with positive probability), and graph language (points and lines become vertices and edges, and the question becomes about degrees, cycles or matchings). First assumption: a bijection to a known count. Trap: overcounting symmetric arrangements. Practice: PS 10.

## Generating functions

Recognise them when a sequence or a count has a convolution in it: the n term depends on sums of products of earlier terms. The model: encode the sequence as the coefficients of a power series, turn the recurrence into an equation for the series, solve it, and read the coefficients back. A product of series is a convolution of sequences, which is why they fit counting problems that split an object into parts. First assumption: the ordinary generating function, sum of a to the n times x to the n; the exponential one (divided by n factorial) when the objects are labelled. Trap: convergence does not matter for formal power series, but it does the moment you evaluate at a number. Practice: PS 11.

## Abstract algebra

Recognise it when a problem gives a set with an operation and some rules, or asks about functions that respect a structure. Models: a finite group's element orders divide the group order (Lagrange); a group of prime order is cyclic; in a ring, work with ideals and the units; a homomorphism is determined by where it sends generators. Putnam uses these lightly, often as a shortcut in a number theory problem (the multiplicative group modulo p is cyclic). First assumption: the structure is one you know, a cyclic group or the integers modulo n, in disguise. Trap: assuming commutativity. Practice: PS 8.

## Functional equations

Recognise them when a function is defined by an equation it satisfies for all inputs. Models: substitute special values (0, 1, x equal to y, y equal to minus x) to pin down values; look for the symmetric substitution that makes two terms cancel; guess the form (linear, constant, a power) from the special values and prove it is the only one; check whether the equation forces injectivity or surjectivity, which then lets you cancel. First assumption: the answer is a linear function, and the problem is about proving no other works. Trap: proving the guess satisfies the equation and forgetting to prove uniqueness.

## Sources

The seminar: MIT 18.A34 Mathematical Problem Solving (Putnam Seminar), Fall 2018, Yufei Zhao, problem sets 1 to 11 in the order of the plan above, under CC BY-NC-SA 4.0; its earlier editions add sets on the pigeonhole principle, the integer part, roots of polynomials and limit problems. The archive: Kiran Kedlaya's Putnam archive, problems 1985 to 2025, solutions 1995 to 2025 compiled by Manjul Bhargava, Kiran Kedlaya and Lenhard Ng, who ask that the solutions be linked to rather than copied. The book: Putnam and Beyond by Răzvan Gelca and Titu Andreescu, whose organisation (methods of proof, algebra, real analysis, geometry and trigonometry, number theory, combinatorics and probability) was used to check that the topics above cover the ground; its text is not reproduced here, and the copy linked from a WordPress site is not the publisher's.

## Changes
