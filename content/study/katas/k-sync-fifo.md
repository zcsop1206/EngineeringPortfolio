---
study: kata
id: k-sync-fifo
title: Synchronous FIFO with full and empty
area: dd
needs: [dd-fsm]
build: 1
d: 2.5
level: simple
tracks: [asic]
---

> Written by a model for Adit. Not Adit's words.

> [!kata] Synchronous FIFO with full and empty, four bytes deep
> A first-in, first-out queue that stores up to four bytes. Everything happens at rising edges of `clk`; outputs are checked right after every rising edge.
>
> - `count` is the number of stored bytes, 0 to 4. `empty` is 1 exactly when `count` is 0, and `full` is 1 exactly when `count` is 4.
> - At an edge with `rst` low, a **write** is accepted when `wr_en` is high and `full` was 0 before the edge; a **read** is accepted when `rd_en` is high and `empty` was 0 before the edge. Both may be accepted at the same edge, and then `count` does not change.
> - A write while full is dropped even if a read is accepted at the same edge. A read while empty is dropped even if a write is accepted at the same edge.
> - An accepted write stores `wdata`. An accepted read removes the oldest stored byte, and right after that edge `rdata` is that byte. After every other edge `rdata` holds.
> - `rst` (synchronous, active high) empties the queue and sets `rdata` to `8'h00`. It wins over both enables.
>
> Example: after reset, write `a1`, `b2`, `c3`, `d4` on four edges: `count` goes 1, 2, 3, 4 and `full` rises with the fourth. A read then gives `rdata` = `a1` and `count` = 3.
^spec

> [!note] The editor's Verilog subset has no arrays (`reg [7:0] m [0:3]` does not compile).
^lang

```ports
input clk
input rst
input wr_en
input [7:0] wdata
input rd_en
output [7:0] rdata
output full
output empty
output [2:0] count
```

```skeleton
module k_sync_fifo(input clk, input rst, input wr_en, input [7:0] wdata, input rd_en,
                   output [7:0] rdata, output full, output empty, output [2:0] count);
  // your design
endmodule
```

```vectors
rst wr_en wdata rd_en | rdata full empty count
1 1 11 1 | 00 0 1 0
1 0 00 0 | 00 0 1 0
0 0 00 1 | 00 0 1 0
0 1 a1 0 | 00 0 0 1
0 1 b2 0 | 00 0 0 2
0 1 c3 0 | 00 0 0 3
0 1 d4 0 | 00 1 0 4
0 1 ee 0 | 00 1 0 4
0 1 ef 1 | a1 0 0 3
0 1 f0 0 | a1 1 0 4
0 0 00 0 | a1 1 0 4
0 0 00 1 | b2 0 0 3
0 0 00 1 | c3 0 0 2
0 0 00 1 | d4 0 0 1
0 0 00 1 | f0 0 1 0
0 0 00 1 | f0 0 1 0
0 1 5a 1 | f0 0 0 1
0 1 6b 1 | 5a 0 0 1
0 1 7c 1 | 6b 0 0 1
0 0 00 1 | 7c 0 1 0
0 1 01 0 | 7c 0 0 1
0 1 02 0 | 7c 0 0 2
0 1 03 0 | 7c 0 0 3
1 0 00 0 | 00 0 1 0
0 0 00 1 | 00 0 1 0
0 1 99 0 | 00 0 0 1
0 1 b0 1 | 99 0 0 1
0 1 e8 0 | 99 0 0 2
0 0 41 0 | 99 0 0 2
0 0 48 0 | 99 0 0 2
0 0 e7 1 | b0 0 0 1
0 0 86 0 | b0 0 0 1
0 0 5c 0 | b0 0 0 1
0 1 83 1 | e8 0 0 1
0 1 c8 0 | e8 0 0 2
0 0 b2 0 | e8 0 0 2
0 1 42 0 | e8 0 0 3
0 0 f7 0 | e8 0 0 3
0 0 0d 0 | e8 0 0 3
0 1 8f 0 | e8 1 0 4
0 1 7d 0 | e8 1 0 4
0 1 e2 0 | e8 1 0 4
0 1 ee 1 | 83 0 0 3
0 0 47 0 | 83 0 0 3
0 1 c4 1 | c8 0 0 3
0 1 3b 0 | c8 1 0 4
0 1 f8 1 | 42 0 0 3
0 1 1d 0 | 42 1 0 4
0 1 cb 0 | 42 1 0 4
0 0 76 0 | 42 1 0 4
0 1 5a 0 | 42 1 0 4
0 1 f0 1 | 8f 0 0 3
0 1 47 0 | 8f 1 0 4
0 1 08 0 | 8f 1 0 4
0 1 7f 0 | 8f 1 0 4
0 1 9f 0 | 8f 1 0 4
0 1 52 0 | 8f 1 0 4
0 0 eb 0 | 8f 1 0 4
0 1 8d 0 | 8f 1 0 4
0 1 a1 0 | 8f 1 0 4
0 0 50 1 | c4 0 0 3
0 1 5d 0 | c4 1 0 4
0 1 8c 0 | c4 1 0 4
0 1 d6 0 | c4 1 0 4
0 0 63 1 | 3b 0 0 3
0 1 fc 0 | 3b 1 0 4
0 0 09 0 | 3b 1 0 4
0 0 32 0 | 3b 1 0 4
0 0 00 1 | 1d 0 0 3
0 0 fd 1 | 47 0 0 2
0 0 33 1 | 5d 0 0 1
0 0 35 0 | 5d 0 0 1
0 0 d3 1 | fc 0 1 0
0 1 bc 1 | fc 0 0 1
0 0 27 0 | fc 0 0 1
0 1 0a 1 | bc 0 0 1
0 1 44 0 | bc 0 0 2
0 1 9a 1 | 0a 0 0 2
0 1 59 0 | 0a 0 0 3
0 0 08 1 | 44 0 0 2
0 0 51 1 | 9a 0 0 1
0 0 98 1 | 59 0 1 0
0 0 6f 0 | 59 0 1 0
0 0 96 0 | 59 0 1 0
0 0 23 1 | 59 0 1 0
0 1 33 1 | 59 0 0 1
0 1 df 1 | 33 0 0 1
0 0 a5 1 | df 0 1 0
0 1 56 1 | df 0 0 1
0 0 b9 0 | df 0 0 1
0 1 62 1 | 56 0 0 1
0 1 d1 1 | 62 0 0 1
0 0 a9 0 | 62 0 0 1
0 0 8c 0 | 62 0 0 1
0 0 2b 0 | 62 0 0 1
0 0 4b 0 | 62 0 0 1
0 0 db 1 | d1 0 1 0
0 0 b6 1 | d1 0 1 0
0 0 9b 1 | d1 0 1 0
0 1 8d 1 | d1 0 0 1
0 1 97 0 | d1 0 0 2
0 0 1b 0 | d1 0 0 2
0 0 7f 0 | d1 0 0 2
0 1 72 1 | 8d 0 0 2
0 0 86 1 | 97 0 0 1
0 0 b0 1 | 72 0 1 0
0 1 3f 0 | 72 0 0 1
0 1 39 0 | 72 0 0 2
0 1 bb 1 | 3f 0 0 2
0 0 75 0 | 3f 0 0 2
0 1 f2 1 | 39 0 0 2
0 0 86 0 | 39 0 0 2
0 1 6d 0 | 39 0 0 3
0 0 7f 0 | 39 0 0 3
0 0 e3 0 | 39 0 0 3
0 0 3e 0 | 39 0 0 3
0 0 33 0 | 39 0 0 3
0 0 15 0 | 39 0 0 3
0 1 5a 0 | 39 1 0 4
0 1 c3 0 | 39 1 0 4
0 0 f5 1 | bb 0 0 3
0 1 2a 0 | bb 1 0 4
0 1 88 0 | bb 1 0 4
0 1 a2 1 | f2 0 0 3
0 1 cb 1 | 6d 0 0 3
0 1 d1 0 | 6d 1 0 4
0 1 ae 0 | 6d 1 0 4
0 1 82 0 | 6d 1 0 4
0 0 14 0 | 6d 1 0 4
0 1 18 0 | 6d 1 0 4
0 1 d3 0 | 6d 1 0 4
0 0 cb 0 | 6d 1 0 4
0 0 0c 0 | 6d 1 0 4
0 1 c5 0 | 6d 1 0 4
0 1 6a 0 | 6d 1 0 4
0 1 67 0 | 6d 1 0 4
0 1 9e 1 | 5a 0 0 3
0 1 ed 0 | 5a 1 0 4
0 0 e8 0 | 5a 1 0 4
0 0 74 0 | 5a 1 0 4
0 1 68 1 | 2a 0 0 3
0 1 3f 0 | 2a 1 0 4
0 1 dd 0 | 2a 1 0 4
0 0 4e 0 | 2a 1 0 4
0 0 7a 0 | 2a 1 0 4
0 1 fb 0 | 2a 1 0 4
0 0 5f 1 | cb 0 0 3
0 1 ac 1 | d1 0 0 3
0 0 bf 1 | ed 0 0 2
0 0 c2 1 | 3f 0 0 1
0 1 d0 0 | 3f 0 0 2
0 0 21 0 | 3f 0 0 2
0 1 dc 0 | 3f 0 0 3
0 1 5f 1 | ac 0 0 3
0 1 9c 1 | d0 0 0 3
0 0 3c 0 | d0 0 0 3
1 1 4b 1 | 00 0 1 0
0 0 08 1 | 00 0 1 0
0 0 7a 0 | 00 0 1 0
0 0 ff 0 | 00 0 1 0
0 1 8a 0 | 00 0 0 1
0 0 fc 1 | 8a 0 1 0
0 1 14 1 | 8a 0 0 1
0 0 11 1 | 14 0 1 0
0 1 61 1 | 14 0 0 1
0 1 45 1 | 61 0 0 1
0 0 94 1 | 45 0 1 0
0 1 71 1 | 45 0 0 1
0 0 70 1 | 71 0 1 0
0 0 87 0 | 71 0 1 0
0 0 c5 0 | 71 0 1 0
0 0 31 0 | 71 0 1 0
0 0 a8 0 | 71 0 1 0
0 0 46 1 | 71 0 1 0
0 0 bf 0 | 71 0 1 0
0 0 8a 1 | 71 0 1 0
0 0 fa 0 | 71 0 1 0
0 0 84 1 | 71 0 1 0
0 1 51 0 | 71 0 0 1
0 0 13 1 | 51 0 1 0
0 0 7a 1 | 51 0 1 0
0 1 01 0 | 51 0 0 1
0 1 db 0 | 51 0 0 2
0 0 fb 1 | 01 0 0 1
0 0 59 1 | db 0 1 0
0 0 43 0 | db 0 1 0
0 1 8f 0 | db 0 0 1
0 1 8e 1 | 8f 0 0 1
0 1 be 1 | 8e 0 0 1
0 1 ee 0 | 8e 0 0 2
0 1 04 0 | 8e 0 0 3
0 1 eb 0 | 8e 1 0 4
0 1 9f 0 | 8e 1 0 4
0 1 e7 0 | 8e 1 0 4
0 0 04 1 | be 0 0 3
0 1 8b 0 | be 1 0 4
0 1 8f 1 | ee 0 0 3
0 1 de 1 | 04 0 0 3
0 0 06 1 | eb 0 0 2
0 1 b0 0 | eb 0 0 3
0 1 31 0 | eb 1 0 4
0 1 5b 0 | eb 1 0 4
0 1 85 0 | eb 1 0 4
0 1 78 0 | eb 1 0 4
0 1 a2 1 | 8b 0 0 3
0 1 77 0 | 8b 1 0 4
0 1 25 1 | de 0 0 3
0 1 29 1 | b0 0 0 3
0 0 fd 0 | b0 0 0 3
0 1 a9 0 | b0 1 0 4
0 0 cb 0 | b0 1 0 4
0 0 bb 1 | 31 0 0 3
0 1 04 0 | 31 1 0 4
0 0 9d 0 | 31 1 0 4
0 1 fa 0 | 31 1 0 4
0 1 cd 1 | 77 0 0 3
0 1 14 0 | 77 1 0 4
0 1 84 1 | 29 0 0 3
0 1 d7 0 | 29 1 0 4
0 1 65 1 | a9 0 0 3
0 1 af 0 | a9 1 0 4
0 0 06 1 | 04 0 0 3
0 1 4a 0 | 04 1 0 4
0 0 95 0 | 04 1 0 4
0 1 0c 1 | 14 0 0 3
0 1 81 0 | 14 1 0 4
0 0 3e 1 | d7 0 0 3
0 0 89 0 | d7 0 0 3
0 0 6f 0 | d7 0 0 3
0 1 cf 1 | af 0 0 3
0 0 05 0 | af 0 0 3
0 0 7d 1 | 4a 0 0 2
0 0 3f 0 | 4a 0 0 2
0 0 d3 1 | 81 0 0 1
0 0 a0 0 | 81 0 0 1
0 0 1e 0 | 81 0 0 1
0 1 b7 1 | cf 0 0 1
1 0 75 1 | 00 0 1 0
0 1 19 1 | 00 0 0 1
0 0 17 0 | 00 0 0 1
0 0 a9 1 | 19 0 1 0
0 1 25 1 | 19 0 0 1
0 1 38 0 | 19 0 0 2
0 1 44 1 | 25 0 0 2
0 0 44 1 | 38 0 0 1
0 0 8e 0 | 38 0 0 1
0 1 d2 0 | 38 0 0 2
0 0 67 1 | 44 0 0 1
0 0 2e 0 | 44 0 0 1
0 1 73 0 | 44 0 0 2
0 0 74 1 | d2 0 0 1
0 1 91 1 | 73 0 0 1
0 0 bb 0 | 73 0 0 1
0 0 98 1 | 91 0 1 0
0 1 44 0 | 91 0 0 1
0 1 4d 0 | 91 0 0 2
0 0 c4 0 | 91 0 0 2
0 0 1c 0 | 91 0 0 2
0 1 67 1 | 44 0 0 2
0 0 b9 1 | 4d 0 0 1
0 1 1e 1 | 67 0 0 1
0 0 0f 1 | 1e 0 1 0
0 0 f7 0 | 1e 0 1 0
0 0 42 0 | 1e 0 1 0
0 1 a3 1 | 1e 0 0 1
0 1 f1 1 | a3 0 0 1
0 0 e1 1 | f1 0 1 0
0 1 71 0 | f1 0 0 1
0 0 d2 1 | 71 0 1 0
0 0 0e 1 | 71 0 1 0
0 0 0b 1 | 71 0 1 0
0 1 b6 0 | 71 0 0 1
0 0 98 1 | b6 0 1 0
0 0 1d 1 | b6 0 1 0
0 1 76 0 | b6 0 0 1
0 0 61 1 | 76 0 1 0
0 1 5c 1 | 76 0 0 1
0 1 f1 1 | 5c 0 0 1
0 0 bd 0 | 5c 0 0 1
0 1 ca 1 | f1 0 0 1
0 1 10 0 | f1 0 0 2
0 0 36 0 | f1 0 0 2
0 0 df 1 | ca 0 0 1
0 1 9b 0 | ca 0 0 2
0 1 36 0 | ca 0 0 3
0 1 d1 1 | 10 0 0 3
```
