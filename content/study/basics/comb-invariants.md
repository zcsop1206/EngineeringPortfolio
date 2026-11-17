---
study: basic
id: comb-invariants
title: Invariants, monovariants and colourings
area: comb
needs: [found-induction]
build: 1
tracks: [putnam]
---

> Written by a model for Adit. Not Adit's words.

Needs: [induction, descent and well-ordering](found-induction.md). ^needs

A process has **states** and allowed **moves**, each taking a state to another state. Three questions get asked about it: can a given state be reached, must the process stop, and where does it end. An invariant answers the first negatively, a monovariant answers the second, and usually both together answer the third. A two-player game is a process in which the moves alternate between players, and the same ideas classify its positions. ^overview

## Invariants

> [!def] Invariant
> A function $I$ on the states is an **invariant** if $I(s') = I(s)$ whenever a move takes $s$ to $s'$.
^invariant-def

> [!thm] Theorem 1 (invariant principle)
> If $I$ is an invariant and $I(\text{target}) \ne I(\text{start})$, no finite sequence of moves leads from the start to the target.
^invariant

> [!proof]- Proof
> 1. By [induction](found-induction.md#^induction) on the number of moves, every reachable state has $I$ equal to $I(\text{start})$.
> 2. The target does not, so it is not reachable.
^p-invariant

An invariant proves only the negative half. "Which states can be reached" needs both halves: invariants that rule out every unreachable state, and a construction that reaches every state they allow. ^both-directions

The invariants that recur: a sum, a product or a count reduced mod a small number; a **weighted sum** $\sum_c w_c x_c$ with weights chosen so that every move's net change is zero (Theorem 4); the gcd of a multiset under moves that add or subtract elements; and a function $f$ with $f(\text{result}) = f(a) \star f(b)$ for some operation $\star$ that does not care about order, when a move merges $a$ and $b$. ^invariant-shapes

## Parity

> [!thm] Theorem 2 (parity)
> (a) If every move changes an integer quantity by an even amount, its parity is invariant. If every move changes it by an odd amount, then the parity of the number of moves between two given states is fixed.
> (b) Swapping two entries of a sequence of distinct numbers changes its number of **inversions** (pairs of positions $i < j$ whose entries are in decreasing order) by an odd amount. So a permutation cannot be written both as a product of an even number of transpositions and as a product of an odd number; its **sign** is $(-1)^{\text{inversions}}$.
^parity

> [!proof]- Proof (d 3)
> 1. (a) Apply Theorem 1 to the quantity mod $2$; in the odd case, to the quantity plus the number of moves made, mod $2$.
> 2. (b) Swap the entries $a$ (position $i$) and $b$ (position $j$), $i < j$. Pairs of positions that avoid $i$ and $j$ keep their order.
> 3. For a position $k$ outside $[i, j]$ holding $c$, the pairs $\{k, i\}$ and $\{k, j\}$ compare $c$ with $a$ and with $b$ before and after, so together they keep their inversion count.
> 4. For $i < k < j$ holding $c$, the pairs $(i, k)$ and $(k, j)$ contribute $[a > c] + [c > b]$ before and $[b > c] + [c > a]$ after; the two add to $2$, so their change is even.
> 5. The pair $(i, j)$ itself changes by $\pm 1$. Total change: odd.
> 6. Writing a permutation $\sigma$ of $[n]$ as the sequence $\sigma(1), \dots, \sigma(n)$, composing on the right with a transposition swaps two entries. A product of $t$ transpositions is reached from the identity sequence ($0$ inversions) by $t$ swaps, so $t \equiv$ inversions of $\sigma \pmod 2$.
^p-parity

## Monovariants and termination

> [!def] Monovariant
> A function $I$ on the states, with values in an ordered set, is a **monovariant** if every move strictly decreases it (or every move strictly increases it).
^monovariant

> [!thm] Theorem 3 (termination)
> (a) If a monovariant takes values in a **well-ordered** set (every nonempty subset has a least element) and strictly decreases at every move, every sequence of moves is finite.
> (b) $\mathbb N$ is well ordered, and so is the set of $k$-tuples of non-negative integers under lexicographic order (compare first coordinates; on a tie, the second; and so on).
> (c) If $I$ takes non-negative integer values and every move lowers it by at least $1$, there are at most $I(\text{start})$ moves.
^termination

> [!proof]- Proof (d 2.5)
> 1. (a) An infinite run would give an infinite strictly decreasing sequence of values; its set of values has a least element, and the next value is smaller ([descent](found-induction.md#^descent)).
> 2. (b) For $\mathbb N$ this is [well-ordering](found-induction.md#^well-ordering). For tuples, induct on $k$.
> 3. Given a nonempty set $W$ of $k$-tuples, let $m$ be the least first coordinate in $W$. Among the tuples of $W$ starting with $m$, the remaining $(k-1)$-tuples have a least element by the induction hypothesis; prepend $m$.
> 4. That tuple is least in $W$: a tuple with a larger first coordinate is larger, and among those starting with $m$ the rest decides.
> 5. (c) After $j$ moves, $0 \le I \le I(\text{start}) - j$.
^p-termination

Two ways termination arguments fail. A real-valued quantity can decrease strictly forever and stay positive ($1, \frac12, \frac13, \dots$), so a real monovariant needs a fixed minimum drop per move, or a finite set of possible values. And a quantity that some move leaves unchanged permits cycles; add a second coordinate that breaks the ties and compare lexicographically. ^termination-traps

## Potentials

> [!thm] Theorem 4 (potentials)
> Let a state be a placement of tokens on cells, let each cell $c$ carry a weight $w_c \ge 0$, and let $\Phi = \sum_{\text{tokens}} w_{\text{cell of the token}}$.
> (a) If every move leaves $\Phi$ unchanged, $\Phi$ is an invariant.
> (b) If every move lowers $\Phi$ by at least $\delta > 0$, there are at most $\Phi(\text{start})/\delta$ moves.
> (c) Suppose there are finitely many cells and each kind of move changes the vector $x$ of token counts by a fixed vector $v$ from a finite list. Then $\Phi = w \cdot x$ is invariant exactly when $w \cdot v = 0$ for every listed $v$. These $w$ form the null space of the matrix whose rows are the move vectors, of dimension (number of cells) $-$ (its rank).
^potential

> [!proof]- Proof
> 1. (a) is Theorem 1 for $\Phi$.
> 2. (b) After $j$ moves, $0 \le \Phi \le \Phi(\text{start}) - j\delta$.
> 3. (c) A move with vector $v$ changes $\Phi$ by $w \cdot v$. The set of $w$ orthogonal to all the rows is the null space, and [rank-nullity](la-core.md#^rank-nullity) gives its dimension.
^p-potential

Part (c) turns the search for an invariant into a linear system: write each move as a vector and solve for weights. On infinitely many cells the same idea works with weights like $q^{\text{cell}}$, where $q$ solves the equation that one move imposes. ^potential-use

## Colourings

> [!thm] Theorem 5 (colouring)
> Colour the cells of a board, and suppose every placement of a tile covers a vector of colour counts from a set $V$. If the board can be tiled with $N$ tiles, its own colour-count vector is a sum of $N$ vectors from $V$. In particular, if every placement covers exactly one cell of each of the $c$ colours, a tileable board has equally many cells of each colour. With a number written in each cell instead of a colour, and every placement covering a total of $s$, a tileable board has total $Ns$.
^colouring

> [!proof]- Proof
> 1. In a tiling each cell lies in exactly one tile.
> 2. So the number of cells of colour $i$ on the board is the sum, over tiles, of the cells of colour $i$ that each tile covers ([double counting](comb-binomial.md#^double-count)).
^p-colouring

A colouring proves impossibility only. A case it allows still needs an explicit tiling, or a second colouring that rules it out. ^colouring-limits

## Games

> [!def] Game, P-position, N-position
> Two players alternate moves on a finite set of positions; every play ends; the player who cannot move loses. A position is a **P-position** if the player about to move loses with best play on both sides (the Previous player wins), and an **N-position** otherwise (the Next player wins).
^game-def

> [!thm] Theorem 6 (classifying positions)
> Every position is P or N. A terminal position is P; a position is N exactly when some move leads to a P-position; it is P exactly when every move leads to an N-position. Moreover, a set $L$ of positions is exactly the set of P-positions if and only if (i) every terminal position is in $L$, (ii) no move leads from $L$ into $L$, and (iii) from every position outside $L$ some move leads into $L$.
^game-positions

> [!proof]- Proof (d 3)
> 1. Let $\ell(x)$ be the length of the longest play from $x$. It is finite: with finitely many positions, arbitrarily long plays would repeat a position and give a play that never ends.
> 2. Use [strong induction](found-induction.md#^strong-induction) on $\ell$. If $\ell(x) = 0$, $x$ is terminal and the player to move loses: P.
> 3. If $\ell(x) \ge 1$, every move leads to some $y$ with $\ell(y) < \ell(x)$, already classified. If some such $y$ is P, moving there wins, so $x$ is N; if all are N, every move hands the opponent a win, so $x$ is P.
> 4. For the set $L$, show by strong induction on $\ell$ that $x \in L$ exactly when $x$ is P. Terminal positions are in $L$ by (i) and are P.
> 5. If $\ell(x) \ge 1$ and $x \in L$, every move leaves $L$ by (ii), to positions that are N by the hypothesis, so $x$ is P. If $x \notin L$, by (iii) some move enters $L$, a P-position, so $x$ is N.
^p-game-positions

The second half is the practical one. Guess the losing set from small cases, then check (i), (ii) and (iii) for every position; how the guess was found never needs to be written down. Condition (ii) says the losing set is invariant from the mover's side, which is why games sit in this doc. ^game-use

> [!thm] Theorem 7 (pairing strategy)
> Suppose the moves of a game can be split into pairs $\{m, m'\}$ so that whenever one player makes $m$, the move $m'$ is then legal for the opponent, and after both are made the pairing of the remaining moves keeps this property. Then the second player wins by always answering $m$ with $m'$. If one move $m_0$ is left out of the pairing and the property holds after $m_0$, the first player wins by playing $m_0$ first.
^pairing

> [!proof]- Proof
> 1. The player following the pairing always has a legal reply: the opponent's last move came from a pair whose partner is still legal by hypothesis.
> 2. A player who always has a legal move is never the one who cannot move, and since every play ends, the opponent is.
^p-pairing

## Examples

> [!example] Merging fractions
> The numbers $\frac{k}{2k+1}$ for $k = 1, \dots, 10$ are written on a board. A move erases two numbers $x, y$ and writes $x + y - 2xy$. After nine moves one number remains. What is it?
^ex-merging-fractions

> [!solution]- Solution
> methods: invariant
> 1. $1 - 2(x + y - 2xy) = (1 - 2x)(1 - 2y)$, so the product $\Pi$ of $1 - 2z$ over the numbers $z$ on the board is invariant.
> 2. At the start $1 - \frac{2k}{2k+1} = \frac{1}{2k+1}$, so $\Pi = \dfrac{1}{3 \cdot 5 \cdot 7 \cdots 21} = \dfrac{1}{13749310575}$.
> 3. At the end, $1 - 2z = \Pi$ for the last number $z$, whatever the order of moves.
> Answer: $z = \dfrac{1 - \Pi}{2} = \dfrac{6874655287}{13749310575}$ (random orders of moves in exact arithmetic give the same number).

> [!example] T-shapes on a six-by-six board
> Can a $6 \times 6$ board be tiled by T-tetrominoes (four cells: three in a row and one attached to the middle one)?
^ex-t-six

> [!solution]- Solution
> methods: colouring, parity
> 1. Colour the board like a chessboard: $18$ black cells and $18$ white.
> 2. The middle cell of a T has the opposite colour to its three neighbours, so every placement covers $3$ cells of one colour and $1$ of the other: an odd number of black cells.
> 3. A tiling would use $36/4 = 9$ tiles, and a sum of $9$ odd numbers is odd, not $18$.
> Answer: no (an exhaustive search agrees). A $4 \times 4$ board can be tiled, with $4$ tiles.

> [!example] A splitting heap
> A heap is a multiset of positive integers. A move removes some $x \ge 2$ and adds two copies of $x - 1$. Show that every run of moves stops, and find the final heap and the number of moves when the start is $\{3, 1, 4\}$.
^ex-splitting-heap

> [!solution]- Solution
> methods: monovariant, invariant
> 1. Let $K$ be the largest value at the start and $c_j$ the number of copies of $j$. No value above $K$ ever appears. A move on $x$ lowers $c_x$ and changes only $c_{x-1}$ besides, so the tuple $(c_K, c_{K-1}, \dots, c_2)$ strictly decreases lexicographically.
> 2. By Theorem 3 every run stops, and it stops exactly when every element is $1$.
> 3. $\sum 2^{x-1}$ over the heap is invariant, because $2^{x-1} = 2 \cdot 2^{x-2}$.
> 4. At the end every element is $1$, so the final heap has $\sum 2^{x-1} = 4 + 1 + 8 = 13$ ones. Each move adds one element.
> Answer: thirteen $1$s, after $13 - 3 = 10$ moves, in every run.

> [!example] Taking one, four or five
> A pile has $n$ stones. Two players alternately remove $1$, $4$ or $5$ stones; the player who cannot move loses. For which $n$ does the first player win?
^ex-take-145

> [!solution]- Solution
> methods: comb-invariants/game-positions, small-cases
> 1. Classifying $n = 0, 1, \dots, 16$ from the bottom gives P-positions $0, 2, 8, 10, 16$; guess $L = \{n : n \bmod 8 \in \{0, 2\}\}$.
> 2. (i) The only terminal position is $0 \in L$.
> 3. (ii) From $n \equiv 0$ the moves reach residues $7, 4, 3$; from $n \equiv 2$ they reach $1, 6, 5$. None is in $L$.
> 4. (iii) Residue $1$ or $3$: take $1$. Residue $4$: take $4$. Residue $5$: take $5$. Residue $6$: take $4$. Residue $7$: take $5$. Each lands in $L$ and is legal, since $n$ is at least its residue.
> Answer: the first player wins exactly when $n \bmod 8 \notin \{0, 2\}$ (a computer classification to $n = 30$ agrees).

## Derive

> [!derive] Prove that an $m \times n$ board can be tiled by $1 \times k$ bars (either orientation) if and only if $k$ divides $m$ or $k$ divides $n$.
^d-bars

> [!derive] In Nim, there are heaps of $a_1, \dots, a_k$ stones; a move removes any positive number of stones from one heap; the player who cannot move loses. Prove that the player to move loses exactly when the binary XOR $a_1 \oplus \dots \oplus a_k$ is $0$.
^d-nim

> [!derive] On an $m \times n$ grid of cells whose bottom-left cell is poisoned, players alternately pick a remaining cell and remove it together with every remaining cell weakly above and weakly to the right of it; whoever removes the poisoned cell loses. Prove that the first player has a winning strategy whenever $mn > 1$.
^d-poisoned-grid

> [!derive] Tiles numbered $1$ to $15$ sit in a $4 \times 4$ frame with one empty cell, and a move slides a tile into the empty cell from a neighbouring cell. Prove that the arrangement with $14$ and $15$ exchanged, everything else in order and the empty cell in the corner, cannot be reached from the ordered arrangement.
^d-sliding-tiles

> [!derive] Prove that every sequence of swaps of adjacent entries that sorts a permutation into increasing order has length at least its number of inversions, and that this many swaps always suffice.
^d-adjacent-sorting

## Problems

> [!problem] Rows and columns of lamps (d 3.5)
> A $5 \times 5$ grid of lamps starts all off. A move toggles every lamp in one row, or every lamp in one column. How many of the $2^{25}$ on-off patterns can be reached?
^inv-comb-lamp-grid

> [!solution]- Solution
> methods: invariant, linear-algebra-mod-2
> 1. Moves commute and a move made twice cancels, so a reachable pattern is fixed by the set $R$ of rows and the set $C$ of columns toggled an odd number of times: lamp $(i, j)$ is on exactly when $[i \in R] + [j \in C]$ is odd.
> 2. If $(R, C)$ and $(R', C')$ give the same pattern, then $[i \in R] + [i \in R'] \equiv [j \in C] + [j \in C'] \pmod 2$ for all $i, j$; both sides are then one constant. So $(R', C')$ is $(R, C)$ or the pair of complements.
> 3. Each reachable pattern comes from exactly two of the $2^{10}$ pairs.
> 4. Invariant view: any two rows and two columns meet in four lamps with an even number on, so for instance a single lit lamp is unreachable.
> Answer: $2^{9} = 512$ (a breadth-first search agrees).

> [!problem] Taking powers of two (d 3)
> A pile has $n$ stones. Two players alternately remove a number of stones that is a power of $2$ ($1, 2, 4, 8, \dots$); the player who cannot move loses. For which $n$ does the first player win?
^inv-comb-binary-pile

> [!solution]- Solution
> methods: comb-invariants/game-positions
> 1. Let $L$ be the multiples of $3$. (i) The only terminal position, $0$, is in $L$.
> 2. (ii) No power of $2$ is a multiple of $3$, so every move from $L$ leaves $L$.
> 3. (iii) From $n \equiv 1$ take $1$; from $n \equiv 2$ take $2$.
> Answer: the first player wins exactly when $3 \nmid n$ (a computer classification to $n = 40$ agrees).

> [!problem] A square with one hole (d 4)
> One cell is removed from a $5 \times 5$ board. For which choices of the removed cell can the remaining $24$ cells be tiled by $1 \times 3$ bars?
^inv-comb-holed-square

> [!solution]- Solution
> methods: colouring
> 1. Index cells by $(i, j)$ with $0 \le i, j \le 4$. Colour by $(i + j) \bmod 3$: the counts are $8, 9, 8$ for colours $0, 1, 2$, and every bar, in either orientation, covers one cell of each colour.
> 2. A tiling uses $8$ bars, so each colour keeps $8$ cells: the removed cell has $i + j \equiv 1$.
> 3. Colour by $(i - j) \bmod 3$: the counts are $9, 8, 8$, and bars again cover one of each. So the removed cell has $i - j \equiv 0$.
> 4. Then $i \equiv j$ and $2i \equiv 1$, so $i \equiv j \equiv 2 \pmod 3$: the only such cell is the centre $(2, 2)$.
> 5. The centre works. With letters for bars and a dot for the hole, rows from the top: AAABC, DDDBC, EF.BC, EFGGG, EFHHH.
> Answer: only the centre cell (an exhaustive search over all $25$ choices agrees).

> [!problem] Flipping coins to the right (d 4.5)
> A row of $n$ coins all show heads. A move chooses a coin showing heads that is not the last coin of the row, and turns over both it and its right-hand neighbour. Show that the moves must stop, and find the largest possible number of moves.
^inv-comb-coin-row

> [!solution]- Solution
> methods: monovariant, comb-invariants/potential
> 1. Number the coins $1$ to $n$ from the left and read heads as tokens. If the right neighbour shows tails, the token steps one place right; if it shows heads, the two tokens vanish.
> 2. Let $\Phi = \sum (n - \text{position})$ over heads. A step right lowers $\Phi$ by $1$; a pair vanishing at $i, i+1$ lowers it by $2n - 2i - 1 \ge 1$.
> 3. $\Phi \ge 0$ and starts at $\sum_{i=1}^{n} (n - i) = \binom n2$, so there are at most $\binom n2$ moves.
> 4. To reach the bound, always move the rightmost head that is not at position $n$, say at $h$. If $h + 1$ shows tails it steps right; otherwise $h + 1 = n$ and the pair at $n - 1, n$ vanishes. Either way $\Phi$ drops by exactly $1$.
> 5. Such a move exists while $\Phi > 0$, so this play makes exactly $\binom n2$ moves.
> Answer: $\binom n2$ (an exhaustive search agrees for $n \le 12$).

> [!problem] Tokens splitting forward (d 5)
> Cells are numbered $0, 1, 2, \dots$ and may hold any number of tokens. At the start there is one token on cell $0$. A move removes a token from some cell $k$ and puts one token on cell $k+1$ and one on cell $k+2$. Show that no sequence of moves reaches a position in which every token is on a cell numbered $2$ or more and no two tokens share a cell.
^inv-comb-forward-split

> [!solution]- Solution
> methods: comb-invariants/potential, invariant
> 1. Look for weights $q^k$ with $q^k = q^{k+1} + q^{k+2}$, i.e. $q^2 + q - 1 = 0$: $q = (\sqrt5 - 1)/2$, which lies in $(0, 1)$.
> 2. With these weights $\Phi = \sum_{\text{tokens}} q^{\text{cell}}$ is invariant, and it starts at $1$.
> 3. $\sum_{k \ge 2} q^k = \dfrac{q^2}{1 - q} = 1$, because $1 - q = q^2$.
> 4. Finitely many tokens on distinct cells $\ge 2$ use only finitely many terms of that series, so their $\Phi$ is strictly less than $1$. Unreachable.
> 5. The distinctness matters: $0 \to \{1, 2\} \to \{2, 2, 3\}$ has every token on a cell $\ge 2$, and $\Phi = 2q^2 + q^3 = 1$.
