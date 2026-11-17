---
study: kata
id: k-shift-out
title: Parallel-in, serial-out with a load strobe
area: dd
needs: [dd-sequential, dd-verilog]
build: 1
d: 1.5
level: simple
tracks: [asic]
---

> Written by a model for Adit. Not Adit's words.

> [!kata] Parallel-in, serial-out with a load strobe
> An 8-bit register sends a byte one bit per clock, most significant bit first.
>
> - Right after each rising edge of `clk`:
>   - `rst` high (synchronous, active high): the register is `8'h00`. `rst` wins over everything.
>   - else `load` high: the register holds `din`. `load` wins over `en`.
>   - else `en` high: every bit moves one place toward bit 7, and bit 0 becomes 0.
>   - else the register holds. `din` matters only at an edge that loads.
> - `sout` is bit 7 of the register at all times.
>
> Example: after an edge that loads `8'ha5`, `sout` is 1; after each of the next eight edges with `en` high it is 0, 1, 0, 0, 1, 0, 1, 0, and it stays 0 after further shifts. Outputs are checked after every rising edge.
^spec

```ports
input clk
input rst
input load
input en
input [7:0] din
output sout
```

```skeleton
module k_shift_out(input clk, input rst, input load, input en, input [7:0] din, output sout);
  // your design
endmodule
```

```vectors
rst load en din | sout
1 1 1 ff | 0
1 0 0 00 | 0
0 0 1 00 | 0
0 1 0 a5 | 1
0 0 1 39 | 0
0 0 1 6c | 1
0 0 1 2a | 0
0 0 1 0e | 0
0 0 1 df | 1
0 0 1 9d | 0
0 0 1 cd | 1
0 0 1 e4 | 0
0 0 1 00 | 0
0 1 1 6c | 0
0 0 1 00 | 1
0 0 0 ff | 1
0 0 0 00 | 1
0 0 1 13 | 1
0 1 0 80 | 1
0 0 1 00 | 0
0 1 0 ff | 1
0 0 1 00 | 1
0 0 1 00 | 1
1 0 0 00 | 0
0 0 0 00 | 0
0 0 1 00 | 0
0 0 1 ec | 0
0 0 1 42 | 0
0 0 0 5e | 0
0 0 1 8d | 0
0 0 1 d0 | 0
0 0 0 fd | 0
0 1 1 94 | 1
0 0 0 54 | 1
0 0 1 a3 | 0
0 0 1 22 | 0
0 1 1 bf | 1
0 0 1 ec | 0
0 1 0 bc | 1
0 0 1 8f | 0
0 0 0 b8 | 0
0 0 1 1d | 1
0 0 1 a9 | 1
0 0 1 d0 | 1
0 0 1 21 | 1
0 0 1 9a | 0
0 0 1 8e | 0
0 0 1 3a | 0
0 0 1 42 | 0
0 0 1 d7 | 0
0 0 1 d2 | 0
0 0 1 43 | 0
0 0 1 14 | 0
0 0 0 d1 | 0
0 0 0 2e | 0
0 0 0 01 | 0
0 0 1 84 | 0
0 0 1 40 | 0
0 0 0 6d | 0
0 0 1 f4 | 0
0 0 0 05 | 0
0 0 1 dc | 0
0 0 1 28 | 0
0 0 1 08 | 0
0 0 1 e0 | 0
0 0 1 68 | 0
0 0 1 35 | 0
0 1 1 81 | 1
0 0 0 49 | 1
0 0 1 b0 | 0
0 0 0 20 | 0
0 0 1 fc | 0
0 1 1 66 | 0
0 0 1 04 | 1
0 0 0 51 | 1
0 0 1 84 | 1
0 0 1 5f | 0
0 0 1 c7 | 0
0 0 1 a0 | 1
0 0 1 f9 | 1
0 0 1 fc | 0
0 0 1 18 | 0
0 0 1 c3 | 0
0 0 1 24 | 0
0 0 1 59 | 0
0 0 1 35 | 0
0 0 1 37 | 0
0 1 1 9a | 1
0 1 0 8a | 1
0 0 0 d8 | 1
0 1 0 0a | 0
0 0 0 cb | 0
0 0 1 bb | 0
0 0 1 f7 | 0
0 0 1 3d | 0
0 1 0 97 | 1
1 0 1 60 | 0
0 0 1 b9 | 0
0 0 1 45 | 0
0 0 1 81 | 0
0 0 1 a0 | 0
0 0 1 cd | 0
0 0 1 47 | 0
0 1 0 1c | 0
0 0 1 a8 | 0
0 0 1 35 | 0
0 0 1 8b | 1
0 0 1 49 | 1
0 1 1 c8 | 1
0 1 0 16 | 0
0 0 1 8a | 0
0 0 1 91 | 0
0 0 1 7e | 1
0 0 1 3c | 0
0 0 1 f3 | 1
0 0 1 9d | 1
0 0 1 5f | 0
0 0 1 8f | 0
0 0 1 66 | 0
0 0 1 1f | 0
0 0 1 db | 0
0 0 1 bb | 0
0 0 1 a6 | 0
0 0 1 42 | 0
0 0 1 db | 0
0 0 1 40 | 0
0 0 0 f6 | 0
0 0 1 de | 0
0 0 1 d0 | 0
0 0 0 5c | 0
0 0 1 00 | 0
0 1 1 85 | 1
0 0 0 5f | 1
0 0 1 4c | 0
0 0 1 f3 | 0
0 0 0 12 | 0
0 0 1 f5 | 0
0 0 0 cb | 0
0 0 1 f8 | 0
0 0 1 c2 | 1
0 1 1 cc | 1
0 0 1 8a | 1
0 0 0 4f | 1
0 0 1 96 | 0
0 0 0 20 | 0
0 0 1 b8 | 0
0 1 0 bd | 1
1 0 0 52 | 0
0 0 1 9b | 0
0 0 0 5c | 0
0 0 1 da | 0
0 0 1 82 | 0
0 0 1 0c | 0
0 0 1 d4 | 0
0 0 0 ac | 0
0 0 1 d4 | 0
0 0 1 00 | 0
0 0 1 22 | 0
0 1 1 02 | 0
0 0 1 9d | 0
0 0 1 fa | 0
0 0 1 ae | 0
0 0 1 e7 | 0
0 0 1 c0 | 0
0 0 1 e4 | 1
0 0 1 20 | 0
0 0 1 46 | 0
0 0 0 03 | 0
0 0 1 da | 0
0 0 1 5c | 0
0 0 1 51 | 0
0 0 0 6d | 0
0 0 1 c4 | 0
0 0 1 fe | 0
0 0 1 9e | 0
0 0 0 65 | 0
```
