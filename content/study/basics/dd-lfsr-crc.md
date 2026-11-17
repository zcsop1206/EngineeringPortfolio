---
study: basic
id: dd-lfsr-crc
title: LFSRs and CRCs over GF(2)
area: dd
needs: [alg-polynomials, dd-sequential]
build: 1
tracks: [asic, interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [the division algorithm for polynomials](alg-polynomials.md#^poly-div), [linear algebra mod 2](la-core.md#^f2), [flip-flops](dd-sequential.md#^latch-ff).
^needs

A linear feedback shift register (LFSR) is a handful of flip-flops and XOR gates that steps through a long, fixed, noise-like sequence. A cyclic redundancy check (CRC) is the same hardware fed with a message, leaving a short check value that changes whenever the message is damaged in the ways that matter. Both are polynomial arithmetic with coefficients mod 2, and every question about them (how long the sequence is, which errors are caught) is a question about one polynomial.
^intro

## Arithmetic mod 2

> [!def] GF(2) and its polynomials
> GF(2) is the set $\{0, 1\}$ with addition XOR and multiplication AND. It is a field, and $1 + 1 = 0$, so subtracting is the same as adding. A polynomial over GF(2) is a bit word: bit $i$ is the coefficient of $x^i$. Adding two polynomials is XOR of the words, multiplying by $x$ is a shift toward the top, and a product is the XOR of shifted copies with no carries. Division with remainder works as over any field ([division algorithm](alg-polynomials.md#^poly-div)): long division is "line up the divisor under the top bit, XOR, repeat". A polynomial of degree at least 1 is **irreducible** if it is not a product of two polynomials of lower degree. Write $u \bmod p$ for the remainder of $u$ divided by $p$; it is linear: $(u + v) \bmod p = u \bmod p + v \bmod p$.
^gf2

> [!example] One product, worked by hand
> Multiply $x^3 + x + 1$ by $x + 1$ over GF(2).
^ex-gf2-product

> [!solution]- Solution
> methods: gf2-polynomials
> 1. $(x^3 + x + 1)x = x^4 + x^2 + x$ and $(x^3 + x + 1) \cdot 1 = x^3 + x + 1$.
> 2. Add: the two $x$ terms cancel. As words, `10110` XOR `01011` = `11101`.
> Answer: $x^4 + x^3 + x^2 + 1$.

> [!thm] Lemma 1 (an irreducible factor divides a factor)
> If $p$ is irreducible over GF(2) and $p$ divides $ab$, then $p$ divides $a$ or $p$ divides $b$.
^gf2-euclid

This is [Euclid's lemma](nt-divisibility.md#^euclid-lemma) for polynomials. Its integer proof, through [Bezout](nt-divisibility.md#^bezout), carries over word for word with the [polynomial division algorithm](alg-polynomials.md#^poly-div) in place of the integer one and degree in place of size; the only nonzero constant over GF(2) is 1.
^gf2-euclid-proof

## Two ways to build an LFSR

> [!def] Fibonacci and Galois forms
> Fix the **feedback polynomial** $p(x) = x^n + p_{n-1}x^{n-1} + \dots + p_1 x + p_0$ over GF(2).
> - **Fibonacci form** (XORs outside the register): the register holds $n$ consecutive bits $a_t, \dots, a_{t+n-1}$ of a sequence; each step shifts once and appends $a_{t+n} = p_{n-1}a_{t+n-1} + \dots + p_0 a_t$, the XOR of the tapped bits.
> - **Galois form** (XORs inside the register): the register holds the coefficients of a polynomial $s(x)$ of degree below $n$, bit $i$ for $x^i$. Each step shifts every bit one place toward bit $n-1$ with 0 entering at bit 0; if the bit that left the top was 1, the word $p - x^n$ (the **taps**) is XORed in.
>
> The Galois form has one XOR between neighbouring flops at most, so its critical path does not grow with the number of taps; the Fibonacci form has an XOR tree in its feedback.
^lfsr-forms

> [!thm] Theorem 2 (what one step computes)
> One Galois step maps $s$ to $x s \bmod p$, so after $t$ steps the state is $x^t s_0 \bmod p$. Any GF(2)-linear readout of the state (one bit, or the XOR of several) gives a sequence $a_t$ with $a_{t+n} = p_{n-1}a_{t+n-1} + \dots + p_0 a_t$: the rule of the Fibonacci form with the same $p$.
^lfsr-step

> [!proof]- Proof (d 2)
> 1. $xs$ has degree at most $n$; its $x^n$ coefficient is the top bit of $s$, and its lower bits are $s$ shifted up by one.
> 2. If that top bit is 0, $xs$ already has degree below $n$, so it is its own remainder: the shifted word.
> 3. If it is 1, adding $p$ clears $x^n$ and XORs the taps into the low bits, leaving degree below $n$: that is $xs \bmod p$, and it is what the register does.
> 4. By induction on $t$, the state after $t$ steps is $s_t = x^t s_0 \bmod p$.
> 5. Let $a_t = L(s_t)$ with $L$ linear. Then $\sum_{i=0}^{n} p_i a_{t+i} = L\big(\sum_i p_i x^{t+i} s_0 \bmod p\big) = L(x^t s_0\, p \bmod p) = L(0) = 0$, with $p_n = 1$.
> 6. Over GF(2) that says $a_{t+n} = \sum_{i<n} p_i a_{t+i}$.
^p-lfsr-step

In matrix terms one step is multiplication by the companion matrix of $p$, whose characteristic polynomial is $p$; step 5 is [Cayley–Hamilton](la-core.md#^cayley-hamilton) applied to that matrix.
^lfsr-matrix

## How long before it repeats

> [!def] Order of $x$ and primitive polynomials
> Let $g$ have $g(0) = 1$. Multiplying by $x$ is then one-to-one on remainders mod $g$ (Lemma 6 below), so it permutes the $2^{\deg g}$ remainders and some power $x^k$ with $k \ge 1$ is $\equiv 1 \pmod g$. The least such $k$ is the **order** $\operatorname{ord}_g(x)$. An irreducible $p$ of degree $n$ is **primitive** if $\operatorname{ord}_p(x) = 2^n - 1$.
^ord-x

> [!thm] Theorem 3 (maximal length)
> Let $p$ be irreducible of degree $n \ge 2$ and $L = \operatorname{ord}_p(x)$. The Galois LFSR with feedback $p$ keeps the all-zero state fixed, and every nonzero state lies on a cycle of length exactly $L$; so $L$ divides $2^n - 1$. If $p$ is primitive there is a single cycle through all $2^n - 1$ nonzero states.
^max-length

> [!proof]- Proof (d 3.5)
> 1. By Theorem 2 the state after $k$ steps is $x^k s \bmod p$; zero stays zero.
> 2. $p(0) = 1$, since otherwise $x$ would divide $p$ and $p$ would not be irreducible.
> 3. For a nonzero state $s$, the state returns to $s$ after $k$ steps exactly when $p \mid s(x^k + 1)$.
> 4. $s$ is nonzero of degree below $n$, so $p \nmid s$; by Lemma 1, the return happens exactly when $p \mid x^k + 1$, that is $x^k \equiv 1$. This does not depend on $s$.
> 5. So every nonzero state returns first after exactly $L$ steps, and its $L$ states are distinct: it lies on a cycle of length $L$.
> 6. A nonzero state never steps to zero ($p \nmid xs$ by Lemma 1), so the $2^n - 1$ nonzero states split into disjoint cycles, all of length $L$: $L \mid 2^n - 1$.
> 7. If $L = 2^n - 1$, one cycle holds them all.
^p-max-length

The number of primitive polynomials of degree $n$ is $\varphi(2^n - 1)/n$, a fact from the theory of finite fields not proved here: 2 of degree 4, 6 of degree 5, 16 of degree 8. Irreducible is not enough, as the next example shows, and a reset must load a nonzero seed or the register sits at zero forever.
^max-length-count

> [!example] Two irreducible quartics
> Both $x^4 + x + 1$ and $x^4 + x^3 + x^2 + x + 1$ are irreducible. Find the cycle lengths of the Galois LFSR for each.
^ex-two-quartics

> [!solution]- Solution
> methods: dd-lfsr-crc/max-length
> 1. $x^4 + x^3 + x^2 + x + 1$ divides $x^5 + 1$, since $(x+1)(x^4 + x^3 + x^2 + x + 1) = x^5 + 1$. So $x^5 \equiv 1$; and $x^1 \not\equiv 1$, so the order is 5 (it divides 5).
> 2. By Theorem 3 its 15 nonzero states form three cycles of length 5.
> 3. For $x^4 + x + 1$ the order divides 15 and is not 1, 3 or 5: $x^3$ is itself a remainder, not 1, and $x^5 = x \cdot x^4 \equiv x(x + 1) = x^2 + x$, not 1. So the order is 15: one cycle of 15.
> Answer: periods 15 (primitive) and 5; checked by stepping every state.

## CRCs

> [!def] Check value and codeword
> Fix a **generator** $g$ of degree $r$ with $g(0) = 1$. A message of bits $m_1, \dots, m_k$, sent in that order, is the polynomial $M(x) = m_1 x^{k-1} + \dots + m_k$. Its **check value** is $R = x^r M \bmod g$, of degree below $r$, written as $r$ bits. The sender transmits the message followed by the check bits: the **codeword** $C = x^r M + R$, which $g$ divides (adding $R$ cancels the remainder). The receiver divides what arrives by $g$ and accepts it when the remainder is 0.
^crc-division

> [!thm] Theorem 4 (the serial CRC register)
> An $r$-bit register $c$ starts at 0. For each message bit $m$, in order, it shifts up one place (the top bit $c_{r-1}$ drops out, 0 enters at the bottom) and then, if $c_{r-1} \oplus m = 1$ for the top bit it had before the shift, XORs in the low $r$ bits of $g$. After the $k$-th bit, $c = x^r M \bmod g$.
^crc-shift-register

> [!proof]- Proof (d 2.5)
> 1. Let $M_j$ be the polynomial of the first $j$ bits: $M_0 = 0$ and $M_{j+1} = x M_j + m_{j+1}$. Claim: after $j$ bits, $c = x^r M_j \bmod g$. It holds for $j = 0$.
> 2. Assume it for $j$. Then $x^r M_{j+1} = x \cdot x^r M_j + m_{j+1} x^r \equiv x c + m_{j+1} x^r \pmod g$.
> 3. $xc + m_{j+1}x^r$ has degree at most $r$, its $x^r$ coefficient is $c_{r-1} \oplus m_{j+1}$, and its lower bits are $c$ shifted up with the top dropped.
> 4. If that coefficient is 0, the polynomial is already a remainder: the shifted word.
> 5. If it is 1, add $g$: this clears $x^r$ and XORs the low bits of $g$ in, leaving a remainder.
> 6. Both cases are the register's step, so after $j+1$ bits $c = x^r M_{j+1} \bmod g$.
^p-crc-shift-register

Published CRCs add three conventions on top of this: an **initial value** loaded instead of 0, **reflection** (bytes fed least significant bit first), and a final XOR. The initial value and the final XOR change the check value but not which error patterns are caught; reflection only changes which bit order the polynomial follows, and it is chosen to match the order the bits go on the wire. With initial value 0, the check value is linear: for messages of equal length, the check value of $M_1 + M_2$ is the sum of theirs. A byte-wide CRC unit is eight steps of Theorem 4 unrolled into one clock: still linear, so each output bit is an XOR of some state and input bits.
^crc-conventions

> [!example] One check value, two ways
> Generator $g = x^3 + x^2 + 1$ (`1101`), message `100111`. Find the check value by long division, then by stepping the register.
^ex-crc-two-ways

> [!solution]- Solution
> methods: dd-lfsr-crc/crc-division, dd-lfsr-crc/crc-shift-register
> 1. Division: divide `100111000` (the message shifted up by $r = 3$) by `1101`. XOR `1101` under each leading 1: the quotient is `111111` and the remainder is `011`.
> 2. Register, with $g$'s low bits `101`, writing $c$ after each bit: in 1 gives `101`, in 0 gives `111`, in 0 gives `011`, in 1 gives `011`, in 1 gives `011`, in 1 gives `011`.
> 3. The codeword is `100111011`; dividing it by `1101` leaves 0.
> Answer: `011`, both ways (checked in Python).

## What a CRC catches

An error flips some bits of the codeword: the receiver gets $C + E$, where the **error polynomial** $E$ has a 1 at each flipped position. Since $g \mid C$ and the remainder is linear, the receiver sees the remainder of $E$ alone: the error is missed exactly when $g \mid E$. The **weight** of $E$ is its number of terms.
^crc-error-poly

> [!thm] Theorem 5 (single errors and odd errors)
> (a) If $g$ has at least two terms, every single-bit error is caught. (b) If $x + 1$ divides $g$, every error of odd weight is caught.
^crc-detects

> [!proof]- Proof (d 2)
> 1. (a) Suppose $g \mid x^i$, say $x^i = gh$. The lowest term of a product is the product of the lowest terms, and the same holds for the highest terms.
> 2. $g$'s lowest and highest terms differ in degree, so $gh$ has a lowest term of smaller degree than its highest term: at least two terms. But $x^i$ has one.
> 3. (b) If $(x+1) \mid g$ and $g \mid E$, then $E = (x+1)h$, so $E(1) = 0$.
> 4. $E(1)$, computed in GF(2), is the number of terms of $E$ mod 2. So $E$ has even weight.
^p-crc-detects

> [!thm] Lemma 6 (a power of $x$ cancels)
> If $g(0) = 1$ and $g \mid x h$, then $g \mid h$. Hence $g \mid x^i h$ implies $g \mid h$.
^crc-cancel-x

> [!proof]- Proof
> 1. Divide: $h = qg + \rho$ with $\deg \rho < r$. Then $g \mid x\rho$.
> 2. $x\rho$ has degree at most $r$, and the only multiples of $g$ of degree at most $r$ are 0 and $g$ itself.
> 3. $x\rho$ has constant term 0 while $g(0) = 1$, so $x\rho = 0$: $\rho = 0$ and $g \mid h$.
> 4. Apply this $i$ times for the second claim.
^p-crc-cancel-x

> [!thm] Theorem 7 (bursts and pairs)
> Let $g(0) = 1$ and $\deg g = r$. (a) Every **burst** of length at most $r$ is caught: an error whose flipped bits all lie within $r$ consecutive positions. (b) Two flipped bits $j$ positions apart are missed exactly when $\operatorname{ord}_g(x)$ divides $j$.
^crc-burst

> [!proof]- Proof (d 3)
> 1. (a) Write the burst as $E = x^i B$ with $B(0) = 1$ and $\deg B \le r - 1$.
> 2. If $g \mid E$, then $g \mid B$ by Lemma 6. But $B$ is nonzero of degree below $r$, so $g \nmid B$: the burst is caught.
> 3. (b) Two flips $j$ apart are $E = x^i(x^j + 1)$; by Lemma 6, $g \mid E$ exactly when $x^j \equiv 1 \pmod g$.
> 4. Let $L = \operatorname{ord}_g(x)$ and $j = qL + t$ with $0 \le t < L$. Then $x^j = (x^L)^q x^t \equiv x^t$.
> 5. $x^t \equiv 1$ with $0 \le t < L$ forces $t = 0$, by the minimality of $L$. So the pair is missed exactly when $L \mid j$.
^p-crc-burst

So a codeword no longer than $\operatorname{ord}_g(x)$ bits has every double error caught. Generators are chosen as $(x + 1)$ times a primitive polynomial of degree $r - 1$: Theorem 5 gives every odd-weight error, Theorem 7 every burst up to $r$ and every pair in codewords up to $2^{r-1} - 1$ bits.
^crc-design

> [!example] The 8-bit CRC with generator `0x07`
> The generator $x^8 + x^2 + x + 1$ factors as $(x + 1)(x^7 + x^6 + x^5 + x^4 + x^3 + x^2 + 1)$, and the degree-7 factor is primitive. With initial value 0, no reflection and no final XOR, the nine ASCII bytes `123456789` give the check value `f4`. What do Theorems 5 and 7 promise for it?
^ex-crc8

> [!solution]- Solution
> methods: dd-lfsr-crc/crc-detects, dd-lfsr-crc/crc-burst
> 1. The factor $x + 1$: every odd-weight error is caught (Theorem 5).
> 2. Degree 8 and $g(0) = 1$: every burst of length up to 8 is caught (Theorem 7a).
> 3. $\operatorname{ord}_g(x) = \operatorname{lcm}(1, 127) = 127$: two flips are missed only when their distance is a multiple of 127 (Theorem 7b).
> Answer: odd-weight errors, bursts up to 8 bits, and pairs closer than 127 bits; the factorisation, the order 127 and the check value `f4` were checked in Python.

## Derive

> [!derive] Prove that stepping the register of Theorem 4 over a whole codeword, message then check bits, leaves it at 0.
^d-codeword-zero

> [!derive] Prove that if the register of Theorem 4 starts at $I$ instead of 0, after $k$ message bits it holds $x^r M + x^k I \bmod g$; deduce that for $k \ge r$ an all-ones start is the same as complementing the first $r$ message bits.
^d-init-value

> [!derive] Prove that if $2^n - 1$ is prime, every irreducible polynomial over GF(2) of degree $n \ge 2$ is primitive.
^d-mersenne

> [!derive] Prove that over one period of a Fibonacci LFSR with a primitive feedback polynomial of degree $n$, each nonzero $n$-bit window of consecutive output bits appears exactly once, and exactly $2^{n-1}$ of the output bits are 1.
^d-windows

## Problems

> [!problem] Two thousand and twenty-six steps (d 2.5)
> The 4-bit Galois LFSR with feedback $x^4 + x + 1$ starts at `0001`. What does it hold after 2026 steps?
^inv-dd-lfsr-2026

> [!solution]- Solution
> methods: dd-lfsr-crc/lfsr-step, order
> 1. The state is $x^{2026} \bmod (x^4 + x + 1)$ (Theorem 2).
> 2. The order of $x$ is 15 (the quartics example), and $2026 = 15 \cdot 135 + 1$.
> 3. So the state is $x^1$.
> Answer: `0010`.

> [!problem] A quintic feedback polynomial (d 4.5)
> The 5-bit Galois LFSR with feedback $x^5 + x^4 + 1$ is started from each of its 31 nonzero states in turn. Which cycle lengths occur, and how many states lie on cycles of each length?
^inv-dd-lfsr-cycles

> [!solution]- Solution
> methods: factorisation, crt, dd-lfsr-crc/max-length
> 1. $x^5 + x^4 + 1 = (x^2 + x + 1)(x^3 + x + 1)$, and the two factors share no factor.
> 2. As with the [CRT](nt-congruence.md#^crt), but with polynomials, a remainder $s$ mod $p$ is the same as the pair ($s \bmod p_1$, $s \bmod p_2$), and multiplying by $x$ acts on each part separately.
> 3. Both factors are primitive: $x$ has order 3 mod $x^2 + x + 1$ and order 7 mod $x^3 + x + 1$ (3 and 7 are prime, so Theorem 3 decides it).
> 4. $s$ returns after $k$ steps when each nonzero part returns: $k$ a multiple of 3 for a nonzero first part and of 7 for a nonzero second part.
> 5. Both parts nonzero: $3 \cdot 7 = 21$ states, period 21. Only the second part nonzero: 7 states, period 7. Only the first: 3 states, period 3.
> Answer: one cycle of 21, one of 7 and one of 3 (21 + 7 + 3 = 31), confirmed by stepping all 31 states.

> [!problem] Three messages, one check value (d 3)
> An 8-bit CRC with generator `0x07` starts its register at `ff` (no reflection, no final XOR). Three 2-byte messages $a$, $b$, $c$ have check values `26`, `e2` and `72`. Find the check value of $a \oplus b \oplus c$ (bytewise XOR) without the register. Can the check value of $a \oplus b$ be found from these three numbers alone? If not, what one more number is enough?
^inv-dd-crc-affine

> [!solution]- Solution
> methods: linear-algebra-mod-2, dd-lfsr-crc/crc-shift-register
> 1. With start $I$ and length $k$, the register ends at $x^r M + x^k I \bmod g$: a linear part plus a constant $K$ that depends only on $k$ and $I$.
> 2. Three messages: the sum of three check values is the linear part of $a \oplus b \oplus c$ plus $3K = K$, which is exactly its check value: `26` XOR `e2` XOR `72` = `b6`.
> 3. Two messages: the sum of two check values is the linear part plus $2K = 0$, missing one $K$. Since $K$ is not known from the three numbers, no.
> 4. One more number suffices: the check value of the all-zero 2-byte message is $K$ itself (`d7` here), so the check value of $a \oplus b$ is `26` XOR `e2` XOR `d7` = `13`.
> Answer: `b6`; no; the zero message's check value, giving `13` (all values checked in Python).

> [!problem] The longest safe message (d 3.5)
> A link protects whole-byte messages with the 8-bit CRC of generator `0x07`, the check byte appended. What is the largest message length, in bytes, for which every error that flips exactly two bits of the codeword is caught?
^inv-dd-crc-double-bits

> [!solution]- Solution
> methods: dd-lfsr-crc/crc-burst, order
> 1. A message of $k$ bytes gives a codeword of $8k + 8$ bits, so two flips can be any distance from 1 to $8k + 7$ apart.
> 2. By Theorem 7b the pair is missed exactly when 127 divides the distance (the order computed in the `0x07` example).
> 3. All pairs are caught when $8k + 7 < 127$, that is $k \le 14$; at $k = 15$ the distance 127 occurs.
> Answer: 14 bytes.

> [!problem] Bursts of seven (d 4)
> A CRC uses the generator $x^5 + x^2 + 1$. Among all error patterns that are bursts of length exactly 7 (first and last flipped bits 6 positions apart), what fraction is missed? What fraction for length exactly 6?
^inv-dd-crc-burst-seven

> [!solution]- Solution
> methods: dd-lfsr-crc/crc-cancel-x, factor-theorem
> 1. A burst of length exactly $b$ is $x^i B$ with $\deg B = b - 1$ and $B(0) = 1$: the $b - 2$ bits in between are free, so there are $2^{b-2}$ patterns.
> 2. By Lemma 6 it is missed exactly when $g \mid B$, so $B = gq$ with $\deg q = b - 1 - 5$ and $q(0) = 1$ and leading coefficient 1.
> 3. $b = 7$: $q$ has degree 1, so $q = x + 1$, one pattern out of $2^5 = 32$.
> 4. $b = 6$: $q$ has degree 0, so $q = 1$ and $B = g$, one pattern out of $2^4 = 16$.
> Answer: $1/32$ for length 7 and $1/16$ for length 6 (enumerated in Python).
