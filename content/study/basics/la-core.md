---
study: basic
id: la-core
title: "Linear algebra: rank, determinants and eigenvalues"
area: la
needs: []
build: 1
tracks: [putnam, asic, interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: nothing beyond arithmetic; fields, including the two-element field, are defined below. Complex roots of polynomials (every nonconstant complex polynomial has a root) are assumed where eigenvalues over $\mathbb{C}$ appear.
^needs

## Vector spaces

> [!def] Field
> A **field** $F$ is a set with addition and multiplication that are commutative and associative, multiplication distributing over addition, with $0$ and $1 \ne 0$, negatives for every element and inverses for every nonzero element. Examples: $\mathbb{Q}$, $\mathbb{R}$, $\mathbb{C}$, and $\mathbb{F}_p$, the integers modulo a prime $p$. The smallest is $\mathbb{F}_2 = \{0, 1\}$, where $1 + 1 = 0$, so $-x = x$ and subtraction is addition.
^field

> [!def] Vector space, span, independence, basis
> A **vector space** over $F$ is a set $V$ with addition and scaling by elements of $F$ obeying the usual rules (as in $F^n$). A **linear combination** of $v_1, \dots, v_k$ is $\sum c_i v_i$ with $c_i \in F$; their **span** is the set of all such. They are **independent** if $\sum c_i v_i = 0$ forces every $c_i = 0$, and **dependent** otherwise. A **basis** of $V$ is an independent list that spans $V$.
^vector-space

> [!thm] Theorem 1 (exchange and dimension)
> If $v_1, \dots, v_m$ are independent and lie in the span of $w_1, \dots, w_n$, then $m \le n$. Hence all bases of $V$ have the same size, the **dimension** $\dim V$. In a space of dimension $n$, every independent list extends to a basis and every spanning list contains one.
^basis-dim

> [!proof]- Proof (d 3)
> 1. Write $v_1 = \sum c_j w_j$. Some $c_j \ne 0$ since $v_1 \ne 0$; reorder so $c_1 \ne 0$.
> 2. Then $w_1$ is in the span of $v_1, w_2, \dots, w_n$, so this list spans everything the $w$'s spanned.
> 3. Suppose $v_1, \dots, v_k, w_{k+1}, \dots, w_n$ spans. Write $v_{k+1}$ in it; some $w$-coefficient is nonzero, or the $v$'s would be dependent.
> 4. Exchange that $w$ for $v_{k+1}$; the list still spans, by the argument of step 2.
> 5. If $m > n$, after $n$ exchanges $v_1, \dots, v_n$ span, so $v_{n+1}$ is a combination of them: a contradiction.
> 6. Two bases are each independent in the span of the other, so their sizes are equal.
> 7. Extend an independent list by any vector outside its span (independence is kept) until it spans; this stops by step 5. From a spanning list, remove vectors that are combinations of the others.
^p-basis-dim

Hidden vector spaces: polynomials of degree at most $n$ (dimension $n + 1$), functions on a set of $m$ points ($m$), sequences satisfying a linear recurrence of order $k$ ($k$: the first $k$ terms fix the rest), $n \times n$ matrices ($n^2$), subsets of an $n$-set under symmetric difference over $\mathbb{F}_2$ ($n$). A question of how many objects can satisfy a linear condition is often a dimension count in one of these.
^hidden-spaces

## Linear maps and rank

> [!def] Linear map, kernel, image, rank
> $T : V \to W$ is **linear** if $T(u + v) = Tu + Tv$ and $T(cv) = cTv$. After choosing bases, $T$ is a matrix $A$ and $Tv = Av$. The **kernel** $\ker T = \{v : Tv = 0\}$ and **image** $\operatorname{im} T = \{Tv\}$ are subspaces. The **rank** of $T$ (or $A$) is $\dim \operatorname{im} T$, which for a matrix is the dimension of the span of its columns.
^linear-map

> [!thm] Theorem 2 (rank-nullity)
> For linear $T : V \to W$ with $V$ finite-dimensional, $\dim \ker T + \operatorname{rank} T = \dim V$. Consequently, more than $\dim V$ vectors in $V$ are dependent; a linear map between spaces of equal finite dimension is injective exactly when it is surjective; and a square matrix is invertible exactly when its kernel is $\{0\}$.
^rank-nullity

> [!proof]- Proof (d 2.5)
> 1. Take a basis $u_1, \dots, u_k$ of $\ker T$ and extend it to a basis $u_1, \dots, u_k, v_1, \dots, v_r$ of $V$.
> 2. $Tv_1, \dots, Tv_r$ span $\operatorname{im} T$, because $T$ kills every $u_i$.
> 3. They are independent: $\sum c_i T v_i = 0$ puts $\sum c_i v_i$ in $\ker T$, so it is a combination of the $u_i$, and independence of the whole basis forces all $c_i = 0$.
> 4. So $\operatorname{rank} T = r = \dim V - k$.
> 5. The consequences read the equation with one term known: injective means $k = 0$, surjective means $r = \dim W$.
^p-rank-nullity

> [!thm] Theorem 3 (row rank equals column rank)
> For any matrix over a field, the dimension of the span of the rows equals the dimension of the span of the columns. So $\operatorname{rank} A = \operatorname{rank} A^T$.
^row-col-rank

> [!proof]- Proof (d 3)
> 1. Let $r$ be the column rank and $C$ the $m \times r$ matrix whose columns are a basis of the column space.
> 2. Each column of $A$ is a combination of those, so $A = CR$ for some $r \times n$ matrix $R$.
> 3. Each row of $A$ is a row of $C$ times $R$, a combination of the $r$ rows of $R$; so the row rank is at most $r$.
> 4. Apply the same to $A^T$: the column rank is at most the row rank.
^p-row-col-rank

> [!thm] Theorem 4 (elimination)
> The row operations (swap two rows, scale a row by a nonzero element, add a multiple of one row to another) are each left multiplication by an invertible matrix. They preserve the kernel and the row space, hence the rank. Every matrix reduces by them to row echelon form, whose rank is the number of pivots; the solutions of $Ax = 0$ are then parametrised by the $n - \operatorname{rank} A$ free variables.
^elimination

> [!proof]- Proof
> 1. Each operation is undone by another of the same kind, and applying it to $I$ gives the invertible matrix $E$ with $EA$ = the result.
> 2. $Ax = 0$ if and only if $EAx = 0$; the rows of $EA$ are combinations of those of $A$ and conversely.
> 3. Clear each column below its first nonzero entry, left to right. The nonzero rows of the echelon form are independent (look at each pivot column), so they count the rank.
^p-elimination

> [!thm] Theorem 5 (when a linear system is solvable)
> Write $b \cdot y = \sum b_i y_i$. For an $m \times n$ matrix $A$ over any field, $Ax = b$ has a solution if and only if $b \cdot y = 0$ for every $y$ with $A^T y = 0$. When it does, the solutions are $x_0 + \ker A$ for any one solution $x_0$.
^solvable

> [!proof]- Proof (d 3)
> 1. If $Ax = b$ and $A^T y = 0$, then $b \cdot y = (Ax) \cdot y = x \cdot (A^T y) = 0$. So $\operatorname{im} A$ lies in $Z = \{b : b \cdot y = 0 \text{ for all } y \in \ker A^T\}$.
> 2. $\dim \ker A^T = m - \operatorname{rank} A^T = m - \operatorname{rank} A$ (Theorems 2 and 3).
> 3. With a basis $y_1, \dots, y_k$ of $\ker A^T$, $Z$ is the kernel of the $k \times m$ matrix with rows $y_i^T$, which has rank $k$; so $\dim Z = m - k = \operatorname{rank} A$.
> 4. A subspace of $Z$ with the same finite dimension is all of $Z$.
> 5. Two solutions differ by an element of $\ker A$.
^p-solvable

> [!thm] Theorem 6 (rank inequalities)
> For $A$ ($m \times n$) and $B$ ($n \times p$): $\operatorname{rank}(AB) \le \min(\operatorname{rank} A, \operatorname{rank} B)$ and $\operatorname{rank} A + \operatorname{rank} B - n \le \operatorname{rank}(AB)$. For $A, B$ of the same shape, $\operatorname{rank}(A + B) \le \operatorname{rank} A + \operatorname{rank} B$.
^rank-ineq

> [!proof]- Proof (d 3)
> 1. $\operatorname{im}(AB) \subseteq \operatorname{im} A$, and $\operatorname{im}(AB) = A(\operatorname{im} B)$ has dimension at most $\dim \operatorname{im} B$.
> 2. Rank-nullity for $A$ restricted to $\operatorname{im} B$: $\operatorname{rank}(AB) = \operatorname{rank} B - \dim(\ker A \cap \operatorname{im} B)$.
> 3. $\dim(\ker A \cap \operatorname{im} B) \le \dim \ker A = n - \operatorname{rank} A$.
> 4. $\operatorname{im}(A + B) \subseteq \operatorname{im} A + \operatorname{im} B$, and a sum of two subspaces has dimension at most the sum of their dimensions.
^p-rank-ineq

## Determinants

> [!def] Permutations and sign
> A permutation $\sigma$ of $\{1, \dots, n\}$ has an **inversion** at each pair $i < j$ with $\sigma(i) > \sigma(j)$. Its **sign** is $\operatorname{sgn} \sigma = (-1)^{\text{number of inversions}}$. A **transposition** swaps two elements and fixes the rest.
^sign-def

> [!thm] Theorem 7 (sign of a product)
> Swapping the values of $\sigma$ at two positions flips its sign. Every permutation is a product of transpositions, and $\operatorname{sgn}(\sigma\tau) = \operatorname{sgn}\sigma \operatorname{sgn}\tau$.
^sign

> [!proof]- Proof (d 3)
> 1. Swapping the values at adjacent positions $i, i+1$ changes the inversion count by exactly one: only the pair $(i, i+1)$ changes status.
> 2. Swapping the values at positions $i < j$ is $2(j - i) - 1$ adjacent swaps: move one value right to $j$, then the other left to $i$.
> 3. An odd number of sign flips is a flip.
> 4. Sorting any arrangement by swaps writes $\sigma$ as a product of $k$ transpositions, and by step 3 $\operatorname{sgn} \sigma = (-1)^k$ starting from the identity; multiplicativity follows by concatenating the two products.
^p-sign

> [!def] Determinant
> For an $n \times n$ matrix $A = (a_{ij})$ over a field (or over polynomials with coefficients in a field):
> $$\det A = \sum_{\sigma} \operatorname{sgn}(\sigma) \prod_{i=1}^{n} a_{i, \sigma(i)},$$
> the sum over all permutations of $\{1, \dots, n\}$. $A_{ij}$ denotes $A$ with row $i$ and column $j$ deleted.
^det-def

> [!thm] Theorem 8 (properties of the determinant)
> (1) $\det$ is linear in each row separately. (2) Swapping two rows negates it; two equal rows give $0$. (3) $\det I = 1$, and a triangular matrix has $\det$ equal to the product of its diagonal. (4) Adding a multiple of one row to another leaves it unchanged. (5) $\det A^T = \det A$, so all of this holds for columns. (6) Expansion along row $i$: $\det A = \sum_j (-1)^{i+j} a_{ij} \det A_{ij}$.
^det-props

> [!proof]- Proof (d 3)
> 1. (1): every term of the sum contains exactly one entry of row $i$, to the first power.
> 2. (2): swapping rows $i, k$ turns the term of $\sigma$ into the term of $\sigma$ composed with the transposition of $i, k$, with sign flipped (Theorem 7). With two equal rows, pair each $\sigma$ with that composite: equal products, opposite signs, so they cancel. This works over every field, $\mathbb{F}_2$ included.
> 3. (3): in a triangular matrix every $\sigma$ other than the identity has some $\sigma(i) < i$ and some $\sigma(j) > j$, hence a zero factor.
> 4. (4): by (1) the new determinant is $\det A$ plus a multiple of a determinant with two equal rows.
> 5. (5): reindex by $\sigma^{-1}$, which has the same sign: $\prod_i a_{i, \sigma(i)} = \prod_j a_{\sigma^{-1}(j), j}$.
> 6. (6): by (1) split row $i$ as $\sum_j a_{ij} e_j$. With row $i$ equal to $e_j$, move that row to the top and column $j$ to the left by $(i - 1) + (j - 1)$ adjacent swaps; only permutations using the corner entry survive, and they give $\det A_{ij}$.
^p-det-props

> [!thm] Theorem 9 (uniqueness)
> If $D$ is a function of $n \times n$ matrices that is linear in each row and vanishes when two rows are equal, then $D(A) = D(I) \det A$.
^det-unique

> [!proof]- Proof (d 3)
> 1. Expanding $D$ of a matrix with $x + y$ in rows $i$ and $k$ (which is $0$) shows that swapping two rows negates $D$.
> 2. Expand every row of $A$ in the standard basis: $D(A) = \sum_{\varphi} \prod_i a_{i, \varphi(i)}\, D(e_{\varphi(1)}, \dots, e_{\varphi(n)})$ over all maps $\varphi$ from $\{1..n\}$ to itself.
> 3. A $\varphi$ that is not a permutation repeats a row, so its term is $0$.
> 4. For a permutation, sorting the rows by swaps gives $D(e_{\sigma(1)}, \dots, e_{\sigma(n)}) = \operatorname{sgn}(\sigma) D(I)$ (Theorem 7).
> 5. Compare with the definition of $\det$.
^p-det-unique

> [!thm] Theorem 10 (product rule and invertibility)
> $\det(AB) = \det A \det B$. A square matrix $A$ is invertible exactly when $\det A \ne 0$, exactly when $\operatorname{rank} A = n$; then $\det A^{-1} = 1/\det A$.
^det-multiplicative

> [!proof]- Proof (d 3)
> 1. Fix $B$. Row $i$ of $AB$ is (row $i$ of $A$)$\cdot B$, so $D(A) = \det(AB)$ is linear in each row of $A$ and vanishes when two rows of $A$ agree.
> 2. Theorem 9: $\det(AB) = D(I) \det A = \det B \det A$.
> 3. If $A$ is invertible, $\det A \det A^{-1} = \det I = 1$, so $\det A \ne 0$.
> 4. If $\operatorname{rank} A < n$, some row is a combination of the others; subtracting that combination (Theorem 8(4)) leaves a zero row, so $\det A = 0$.
> 5. If $\operatorname{rank} A = n$, the map $x \mapsto Ax$ is bijective (rank-nullity) and has a linear inverse.
^p-det-multiplicative

> [!thm] Theorem 11 (adjugate)
> Let $\operatorname{adj}(A)$ have $(i, j)$ entry $(-1)^{i+j} \det A_{ji}$. Then $A \operatorname{adj}(A) = \operatorname{adj}(A) A = \det(A) I$. The identity holds for matrices whose entries are polynomials, since it is an identity among polynomial expressions in the entries.
^adjugate

> [!proof]- Proof
> 1. The $(i, i)$ entry of $A \operatorname{adj}(A)$ is $\sum_j a_{ij} (-1)^{i+j} \det A_{ij}$, the expansion of $\det A$ along row $i$.
> 2. For $i \ne k$, the $(i, k)$ entry $\sum_j a_{ij} (-1)^{k+j} \det A_{kj}$ is the expansion along row $k$ of $A$ with row $k$ replaced by row $i$: two equal rows, so $0$.
> 3. $\operatorname{adj}(A) A$: apply steps 1 and 2 to $A^T$, using $\det A^T = \det A$ and $\operatorname{adj}(A^T) = \operatorname{adj}(A)^T$.
^p-adjugate

## Eigenvalues

> [!def] Eigenvalues and the characteristic polynomial
> $v \ne 0$ is an **eigenvector** of the square matrix $A$ with **eigenvalue** $\lambda$ if $Av = \lambda v$. That happens exactly when $\lambda I - A$ has a nonzero kernel, i.e. $\det(\lambda I - A) = 0$. The **characteristic polynomial** $\chi_A(x) = \det(xI - A)$ is monic of degree $n$. Over $\mathbb{C}$ it factors as $\prod_{i=1}^n (x - \lambda_i)$, the eigenvalues listed with multiplicity. $A$ is **diagonalisable** if $A = P D P^{-1}$ with $D$ diagonal.
^eigen

> [!thm] Theorem 12 (distinct eigenvalues)
> Eigenvectors for distinct eigenvalues are independent. So an $n \times n$ matrix with $n$ distinct eigenvalues is diagonalisable.
^distinct-independent

> [!proof]- Proof (d 2.5)
> 1. Take a dependence $\sum_{i=1}^{k} c_i v_i = 0$ with all $c_i \ne 0$ and $k$ as small as possible; $k \ge 2$ since eigenvectors are nonzero.
> 2. Apply $A - \lambda_k I$: $\sum_{i < k} c_i (\lambda_i - \lambda_k) v_i = 0$, a shorter dependence with nonzero coefficients. Contradiction.
> 3. With $n$ independent eigenvectors as the columns of $P$, $AP = PD$ and $P$ is invertible.
^p-distinct-independent

> [!thm] Theorem 13 (similarity)
> $B$ is **similar** to $A$ if $B = P^{-1} A P$ for an invertible $P$: the same linear map in another basis. Similar matrices have the same characteristic polynomial, hence the same eigenvalues, trace and determinant, and the same rank.
^similar

> [!proof]- Proof
> 1. $\det(xI - P^{-1}AP) = \det(P^{-1}(xI - A)P) = \det(xI - A)$ by the product rule.
> 2. Multiplying by invertible matrices does not change the dimension of the image.
^p-similar

> [!thm] Theorem 14 (trace and determinant from eigenvalues)
> The **trace** $\operatorname{tr} A$ is the sum of the diagonal entries. $\operatorname{tr}(AB) = \operatorname{tr}(BA)$ for $A$ $m \times n$ and $B$ $n \times m$. Over $\mathbb{C}$, $\operatorname{tr} A = \sum \lambda_i$ and $\det A = \prod \lambda_i$.
^trace

> [!proof]- Proof
> 1. $\operatorname{tr}(AB) = \sum_i \sum_j a_{ij} b_{ji}$, which is symmetric in the roles of $A$ and $B$.
> 2. In $\det(xI - A)$, every permutation other than the identity misses at least two diagonal positions, so contributes degree at most $n - 2$.
> 3. So the $x^{n-1}$ coefficient comes from $\prod (x - a_{ii})$ and is $-\operatorname{tr} A$; in $\prod (x - \lambda_i)$ it is $-\sum \lambda_i$.
> 4. At $x = 0$: $\det(-A) = (-1)^n \det A$, and $\prod(-\lambda_i) = (-1)^n \prod \lambda_i$.
^p-trace

> [!thm] Theorem 15 (triangular form)
> Over $\mathbb{C}$ every square matrix is similar to an upper triangular matrix, whose diagonal lists the eigenvalues with multiplicity. For any polynomial $p$, the eigenvalues of $p(A)$ are the $p(\lambda_i)$, with multiplicity.
^triangular

> [!proof]- Proof (d 3.5)
> 1. Induct on $n$; $n = 1$ is immediate.
> 2. $\chi_A$ has a complex root $\lambda$, with eigenvector $v_1$; extend to a basis $v_1, \dots, v_n$, the columns of $P_1$.
> 3. In that basis the first column is $(\lambda, 0, \dots, 0)^T$: $P_1^{-1} A P_1 = \begin{pmatrix} \lambda & * \\ 0 & A' \end{pmatrix}$.
> 4. By induction $Q^{-1} A' Q$ is upper triangular, and $P = P_1 \begin{pmatrix} 1 & 0 \\ 0 & Q \end{pmatrix}$ makes $P^{-1}AP$ upper triangular.
> 5. The characteristic polynomial of a triangular $U$ is $\prod (x - u_{ii})$, and similarity preserves it.
> 6. $p(U)$ is upper triangular with diagonal $p(u_{ii})$, and $p(P^{-1}AP) = P^{-1} p(A) P$.
^p-triangular

> [!thm] Theorem 16 (Cayley–Hamilton)
> Over any field, $\chi_A(A) = 0$.
^cayley-hamilton

> [!proof]- Proof (d 4)
> 1. By the adjugate identity with polynomial entries: $\operatorname{adj}(xI - A)(xI - A) = \chi_A(x) I$.
> 2. Entries of $\operatorname{adj}(xI - A)$ have degree at most $n - 1$, so $\operatorname{adj}(xI - A) = \sum_{k=0}^{n-1} B_k x^k$ with constant matrices $B_k$.
> 3. Write $\chi_A(x) = \sum_{k=0}^{n} c_k x^k$. Comparing coefficients of $x^k$: $B_{k-1} - B_k A = c_k I$, with $B_{-1} = B_n = 0$.
> 4. Multiply the $k$-th equation on the right by $A^k$ and add over $k$: the left side $\sum_k (B_{k-1} A^k - B_k A^{k+1})$ telescopes to $0$.
> 5. The right side is $\sum_k c_k A^k = \chi_A(A)$.
^p-cayley-hamilton

> [!trap] Substituting the matrix into the determinant
> "$\chi_A(A) = \det(AI - A) = \det 0 = 0$" is not a proof: $\chi_A(A)$ is a matrix, while $\det(AI - A)$ is a number, and $x$ was a scalar inside the determinant. Step 3 above is where the substitution is made legitimately, coefficient by coefficient.
^trap-substitution

Cayley–Hamilton turns any power $A^m$ into a combination of $I, A, \dots, A^{n-1}$: divide $x^m$ by $\chi_A(x)$ and keep the remainder.
^ch-use

> [!def] Companion matrix
> For monic $p(x) = x^n + c_{n-1} x^{n-1} + \cdots + c_0$ over a field, the **companion matrix** $C_p$ has ones just below the diagonal, last column $(-c_0, -c_1, \dots, -c_{n-1})^T$, and zeros elsewhere. It sends $e_i \mapsto e_{i+1}$ for $i < n$, so it is multiplication by $x$ on polynomials modulo $p$, written in the basis $1, x, \dots, x^{n-1}$. Over $\mathbb{F}_2$ this is the state update of a linear feedback shift register ([LFSR forms](dd-lfsr-crc.md#^lfsr-forms)).
^companion

> [!thm] Theorem 17 (real symmetric matrices)
> A real symmetric matrix $A$ has only real eigenvalues, eigenvectors for distinct eigenvalues are orthogonal, and $\mathbb{R}^n$ has an orthonormal basis of eigenvectors: $A = Q D Q^T$ with $Q$ orthogonal ($Q^T Q = I$). In the coordinates $y = Q^T x$, $x^T A x = \sum \lambda_i y_i^2$, so $A$ is positive definite exactly when every $\lambda_i > 0$.
^symmetric

> [!proof]- Proof (d 3.5)
> 1. If $Av = \lambda v$ with $v \in \mathbb{C}^n$ nonzero, then $\bar v^T A v = \lambda |v|^2$, and $\bar v^T A v$ is real because it equals its own conjugate $v^T A \bar v = (v^T A \bar v)^T = \bar v^T A^T v$. So $\lambda$ is real.
> 2. $A - \lambda I$ is then a real singular matrix, so it has a real kernel vector.
> 3. If $Av = \lambda v$, $Aw = \mu w$, $\lambda \ne \mu$: $\lambda \langle v, w \rangle = \langle Av, w \rangle = \langle v, Aw \rangle = \mu \langle v, w \rangle$, so $\langle v, w \rangle = 0$.
> 4. Take a unit eigenvector $v_1$. If $\langle w, v_1 \rangle = 0$ then $\langle Aw, v_1 \rangle = \langle w, A v_1 \rangle = 0$: $A$ maps $v_1^\perp$ to itself, and is symmetric there in an orthonormal basis.
> 5. Induct on the dimension to get the orthonormal eigenbasis; $x^T A x = (Q^T x)^T D (Q^T x)$.
^p-symmetric

## Linear algebra over the two-element field

> [!thm] Theorem 18 (counting over F2)
> Everything above that did not use $\mathbb{C}$ or $\mathbb{R}$ holds over $\mathbb{F}_2$: rank-nullity, elimination, solvability, determinants and Cayley–Hamilton. In addition: (a) a subspace of $\mathbb{F}_2^n$ of dimension $k$ has $2^k$ elements; (b) $Ax = b$ has either no solution or exactly $2^{\dim \ker A}$; (c) $v \cdot v$ is the parity of the number of ones in $v$, so a nonzero vector can be orthogonal to itself; (d) there are $\prod_{k=0}^{n-1} (2^n - 2^k)$ invertible $n \times n$ matrices over $\mathbb{F}_2$.
^f2

> [!proof]- Proof
> 1. (a): with a basis $b_1, \dots, b_k$, each element is $\sum c_i b_i$ with $c_i \in \{0, 1\}$, in exactly one way.
> 2. (b): Theorem 5 and (a) applied to $\ker A$.
> 3. (c): $v \cdot v = \sum v_i^2 = \sum v_i$ since $0^2 = 0$ and $1^2 = 1$.
> 4. (d): choose the rows in turn; row $k + 1$ must avoid the $2^k$ vectors in the span of the first $k$ (Theorem 10: invertible means independent rows).
^p-f2

Lamps and switches are linear algebra over $\mathbb{F}_2$: a configuration of $n$ lamps is a vector in $\mathbb{F}_2^n$, a switch that toggles a fixed set of lamps is a vector $s$, and pressing it adds $s$. Order does not matter and pressing twice does nothing, so the configurations reachable from all-off are exactly the span of the switch vectors. Every configuration is reachable exactly when the switch matrix is invertible, and in general $2^{\operatorname{rank}}$ are.
^lamps

> [!thm] Theorem 19 (odd sets with even overlaps)
> If $A_1, \dots, A_m$ are subsets of $\{1, \dots, n\}$, each of odd size, and every two distinct ones meet in an even number of elements, then $m \le n$.
^oddtown

> [!proof]- Proof (d 3.5)
> 1. Let $v_i \in \mathbb{F}_2^n$ be the indicator vector of $A_i$.
> 2. $v_i \cdot v_j = |A_i \cap A_j| \bmod 2$, which is $1$ if $i = j$ and $0$ otherwise.
> 3. If $\sum c_i v_i = 0$, take the dot product with $v_j$: $c_j = 0$. So the $v_i$ are independent.
> 4. Independent vectors in $\mathbb{F}_2^n$ number at most $n$.
^p-oddtown

## Examples

> [!example] Squares of index sums
> For $n \ge 3$, find the rank of the $n \times n$ real matrix with entries $(i + j)^2$.
^ex-index-sum-squares

> [!solution]- Solution
> methods: rank
> 1. $(i + j)^2 = i^2 \cdot 1 + 2 \cdot i \cdot j + 1 \cdot j^2$, so the matrix is $u w^T + 2 v v^T + w u^T$ with $u = (i^2)_i$, $v = (i)_i$, $w = (1)_i$.
> 2. Every column is a combination of $u, v, w$, so the rank is at most $3$.
> 3. The top-left $3 \times 3$ block (entries $4, 9, 16; 9, 16, 25; 16, 25, 36$) has determinant $-8 \ne 0$, so the rank is at least $3$. (Exact rank computation for $n = 3, 4, 6$ gives $3$.)
> Answer: $3$.
^s-ex-index-sum-squares

> [!example] A constant off the diagonal
> Find $\det$ of the $n \times n$ matrix with $x$ on the diagonal and $1$ everywhere else.
^ex-constant-off-diagonal

> [!solution]- Solution
> methods: determinant
> 1. For $n \ge 2$ the determinant is a polynomial $q(x)$ of degree $n$ with leading coefficient $1$ (only the identity permutation reaches $x^n$).
> 2. Subtract row $1$ from every other row. Row $i \ge 2$ becomes $(1 - x) e_1 + (x - 1) e_i$; factoring $x - 1$ out of each of these $n - 1$ rows shows $(x - 1)^{n-1}$ divides $q$.
> 3. In the original matrix, adding all columns to the first makes every first-column entry $x + n - 1$; factoring it out shows $x + n - 1$ divides $q$.
> 4. The two factors are coprime and their degrees add to $n$, so $q$ is their product times the leading coefficient $1$. (Symbolic check for $n = 2, \dots, 5$.)
> Answer: $(x - 1)^{n-1}(x + n - 1)$.
^s-ex-constant-off-diagonal

> [!example] Lamps on a ring
> $n \ge 3$ lamps stand in a circle; switch $i$ toggles lamp $i$ and its two neighbours. Starting from all off, for which $n$ is every configuration reachable, and how many are reachable otherwise?
^ex-ring-lamps

> [!solution]- Solution
> methods: linear-algebra-mod-2, rank
> 1. The reachable set is the image of the $n 	imes n$ switch matrix, of size $2^{n - \dim \ker}$ by rank-nullity.
> 2. $x$ is in the kernel when $x_{i-1} + x_i + x_{i+1} = 0$ for all $i$ (indices mod $n$), i.e. $x_{i+1} = x_i + x_{i-1}$.
> 3. Over $\mathbb{F}_2$ that recurrence from $(x_0, x_1) = (a, b)$ gives $a, b, a + b, a, b, \dots$, period dividing $3$.
> 4. Going round the circle consistently needs the sequence to have period dividing $n$ as well. If $3 \mid n$, all four choices of $(a, b)$ work; otherwise the period divides $\gcd(3, n) = 1$, forcing $a = b = a + b$, so $a = b = 0$.
> 5. Kernel dimension: $2$ if $3 \mid n$, else $0$. (Computed rank over $\mathbb{F}_2$ for $n = 3, \dots, 15$ agrees.)
> Answer: all configurations exactly when $3 \nmid n$; otherwise $2^{n-2}$.
^s-ex-ring-lamps

> [!example] Powers of a two-by-two matrix
> Let $A = \begin{pmatrix} 3 & -2 \\ 1 & 0 \end{pmatrix}$. Express $A^m$ in terms of $A$ and $I$.
^ex-two-by-two-powers

> [!solution]- Solution
> methods: cayley-hamilton
> 1. $\chi_A(x) = x^2 - 3x + 2 = (x - 1)(x - 2)$, and $\chi_A(A) = 0$.
> 2. Divide: $x^m = q(x)\chi_A(x) + \alpha x + \beta$. At $x = 1$: $1 = \alpha + \beta$; at $x = 2$: $2^m = 2\alpha + \beta$.
> 3. So $\alpha = 2^m - 1$, $\beta = 2 - 2^m$, and $A^m = \alpha A + \beta I$. (Checked for $m = 0, \dots, 11$.)
> Answer: $A^m = (2^m - 1) A + (2 - 2^m) I$.
^s-ex-two-by-two-powers

> [!trap] No basis of eigenvectors
> $\begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}$ has only the eigenvalue $0$ and is not zero, so it is not diagonalisable. An argument that works eigenvector by eigenvector needs a basis of them: distinct eigenvalues, symmetry, or a polynomial identity with distinct roots provide one, nothing else does for free. And a real matrix need not have real eigenvalues at all: a rotation by $90°$ has $\pm i$.
^trap-not-diagonalisable

## Derive

> [!derive] Prove that a real matrix with $A^2 = A$ has $\operatorname{rank} A = \operatorname{tr} A$.
^d-idempotent-trace

> [!derive] Prove that for $n \times n$ matrices $A, B$ over a field, $AB$ and $BA$ have the same characteristic polynomial.
^d-ab-ba

> [!derive] Prove that the characteristic polynomial of the companion matrix $C_p$ is $p$.
^d-companion

> [!derive] Prove that a subspace $W$ of $\mathbb{F}_2^n$ with $u \cdot w = 0$ for all $u, w \in W$ (including $u = w$) has $\dim W \le n/2$.
^d-self-orthogonal

> [!derive] Prove that a real skew-symmetric matrix ($A^T = -A$) of odd order is singular, and that its eigenvalues are purely imaginary.
^d-skew-odd

> [!derive] Prove that $\operatorname{rank}(A^T A) = \operatorname{rank} A$ for every real matrix $A$, and that this fails over $\mathbb{F}_2$.
^d-gram-rank

## Problems

> [!problem] Sines of index sums (d 3)
> For $n \ge 2$, find the rank of the $n \times n$ real matrix with entries $\sin(i + j)$.
^inv-la-sine-index-sum

> [!solution]- Solution
> methods: rank
> 1. $\sin(i + j) = \sin i \cos j + \cos i \sin j$, so the matrix is $s c^T + c s^T$ with $s = (\sin i)$, $c = (\cos i)$: rank at most $2$.
> 2. The top-left $2 \times 2$ block has determinant $\sin 2 \sin 4 - \sin^2 3 = -\sin^2 1 \ne 0$ (product to sum: $\sin 2 \sin 4 = \frac12(\cos 2 - \cos 6)$ and $\sin^2 3 = \frac12(1 - \cos 6)$).
> 3. Numerical rank for $n = 2, 3, 5$ is $2$.
> Answer: $2$.
^s-inv-la-sine-index-sum

> [!problem] A quadratic relation for a real matrix (d 3)
> Let $A$ be a real $n \times n$ matrix with $A^2 - A + I = 0$. Prove that $n$ is even.
^inv-la-sixth-root-equation

> [!solution]- Solution
> methods: eigenvalues, intermediate-value
> 1. If $Av = \lambda v$ with $v \ne 0$ (over $\mathbb{C}$), then $(\lambda^2 - \lambda + 1) v = 0$, so $\lambda^2 - \lambda + 1 = 0$.
> 2. That quadratic has discriminant $-3$: no real roots. So $A$ has no real eigenvalue.
> 3. $\chi_A$ is a real polynomial of degree $n$; if $n$ were odd it would have a real root (intermediate value theorem, opposite signs at $\pm\infty$), a real eigenvalue.
> Answer: $n$ is even (and $n = 2$ occurs, e.g. the companion matrix of $x^2 - x + 1$).
^s-inv-la-sixth-root-equation

> [!problem] A matrix known by three numbers (d 3.5)
> A real $3 \times 3$ matrix has $\operatorname{tr} A = 0$, $\operatorname{tr} A^2 = 6$ and $\det A = 2$. Find $A^3 - 3A$ and $\operatorname{tr} A^4$.
^inv-la-three-invariants

> [!solution]- Solution
> methods: eigenvalues, cayley-hamilton
> 1. With eigenvalues $\lambda_i$: $\sum \lambda_i = 0$, $\sum \lambda_i^2 = 6$ (eigenvalues of $A^2$ are $\lambda_i^2$), $\prod \lambda_i = 2$.
> 2. $e_2 = \sum_{i<j} \lambda_i \lambda_j = \frac{(\sum \lambda_i)^2 - \sum \lambda_i^2}{2} = -3$.
> 3. $\chi_A(x) = x^3 - 0 \cdot x^2 + (-3)x - 2 = x^3 - 3x - 2$.
> 4. Cayley–Hamilton: $A^3 - 3A = 2I$.
> 5. $A^4 = 3A^2 + 2A$, so $\operatorname{tr} A^4 = 18 + 0 = 18$. (Check: the eigenvalues are $2, -1, -1$, the roots of $x^3 - 3x - 2$, and $16 + 1 + 1 = 18$.)
> Answer: $A^3 - 3A = 2I$, $\operatorname{tr} A^4 = 18$.
^s-inv-la-three-invariants

> [!problem] Two and its cyclic neighbours (d 4.5)
> For $n \ge 3$, find the determinant of the $n \times n$ matrix with $2$ on the diagonal, $1$ in positions $(i, i+1)$ and $(i+1, i)$, and $1$ in the corners $(1, n)$ and $(n, 1)$, all other entries $0$.
^inv-la-cyclic-band

> [!solution]- Solution
> methods: determinant
> 1. Let $P$ be the cyclic shift matrix ($P e_i = e_{i+1}$, indices mod $n$). The matrix is $2I + P + P^{-1} = (I + P)(I + P^{-1})$.
> 2. $\det(I + P)$: in the permutation expansion, only permutations sending each $i$ to $i$ or $i + 1$ have nonzero products, which are the identity and the full $n$-cycle. So $\det(I + P) = 1 + \operatorname{sgn}(n\text{-cycle}) = 1 + (-1)^{n-1}$.
> 3. $I + P^{-1} = P^{-1}(P + I)$, so $\det(I + P^{-1}) = \det(I + P)/\det P$, with $\det P = (-1)^{n-1}$.
> 4. Product: $\frac{(1 + (-1)^{n-1})^2}{(-1)^{n-1}}$, which is $4$ for odd $n$ and $0$ for even $n$. (Even $n$ is also visible directly: $(1, -1, 1, \dots, -1)$ is in the kernel.)
> 5. Exact determinants for $n = 3, \dots, 9$: $4, 0, 4, 0, 4, 0, 4$.
> Answer: $4$ if $n$ is odd, $0$ if $n$ is even.
^s-inv-la-cyclic-band

> [!problem] Two matrices whose product vanishes (d 4)
> Let $A, B$ be $n \times n$ matrices over a field with $AB = 0$ and $A + B$ invertible. Prove that $\operatorname{rank} A + \operatorname{rank} B = n$.
^inv-la-vanishing-product

> [!solution]- Solution
> methods: rank
> 1. $AB = 0$ means $\operatorname{im} B \subseteq \ker A$, so $\operatorname{rank} B \le n - \operatorname{rank} A$ (rank-nullity).
> 2. $n = \operatorname{rank}(A + B) \le \operatorname{rank} A + \operatorname{rank} B$ (rank inequalities).
> 3. Combine.
^s-inv-la-vanishing-product

> [!problem] Lamps on a two-row board (d 5)
> A board of $2 \times n$ lamps; pressing a lamp toggles it and the lamps sharing an edge with it. Starting from all off, for which $n$ is every configuration reachable? For the other $n$, how many configurations are reachable?
^inv-la-two-row-board

> [!solution]- Solution
> methods: linear-algebra-mod-2, rank
> 1. Let $a_c, b_c \in \mathbb{F}_2$ be the presses at the top and bottom of column $c$, with $a_0 = b_0 = a_{n+1} = b_{n+1} = 0$. The presses do nothing exactly when, for $c = 1..n$: $a_{c-1} + a_c + a_{c+1} + b_c = 0$ and $b_{c-1} + b_c + b_{c+1} + a_c = 0$.
> 2. Let $s_c = a_c + b_c$. Adding the two equations: $s_{c+1} = s_{c-1}$. The first equation becomes $a_{c+1} = a_{c-1} + s_c$.
> 3. Everything is fixed by $a_1$ and $s_1$: $s_c = s_1$ for odd $c$ and $0$ for even $c$; then $a_c = a_1$ for odd $c$, $a_c = s_1$ for $c \equiv 2$ and $a_c = 0$ for $c \equiv 0 \pmod 4$.
> 4. The conditions at the far end are $s_{n+1} = 0$ and $a_{n+1} = 0$.
> 5. $n$ even: $n + 1$ is odd, forcing $s_1 = 0$ and $a_1 = 0$. Kernel $\{0\}$: everything reachable.
> 6. $n \equiv 1 \pmod 4$: $s_{n+1} = 0$ automatically and $a_{n+1} = s_1$ forces $s_1 = 0$; $a_1$ is free. Kernel dimension $1$.
> 7. $n \equiv 3 \pmod 4$: both conditions are automatic. Kernel dimension $2$.
> 8. The switch matrix is square, so the reachable count is $2^{2n - \dim\ker}$. (Rank over $\mathbb{F}_2$ computed for $n = 1, \dots, 24$ matches.)
> Answer: every configuration exactly when $n$ is even; $2^{2n-1}$ when $n \equiv 1 \pmod 4$; $2^{2n-2}$ when $n \equiv 3 \pmod 4$.
^s-inv-la-two-row-board
