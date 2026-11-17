---
study: kata
id: k-uart-tx
title: UART transmitter, 8N1
area: dd
needs: [dd-serial, dd-fsm]
build: 1
d: 2.5
level: simple
tracks: [asic]
---

> Written by a model for Adit. Not Adit's words.

> [!kata] UART transmitter, 8N1, four clocks per bit
> Send `data` as one 8N1 frame ([the frame](../basics/dd-serial.md#^uart-frame)), with `CLKS_PER_BIT` = 4 clock cycles per bit. Outputs are checked right after every rising edge.
>
> - Idle: `tx` = 1, `busy` = 0.
> - A rising edge with `start` high, while `busy` is 0 and `rst` is low, accepts `data`. Call it edge 0. Counting edges from there, right after edge $e$:
>   - $e$ = 0 to 3: `tx` = 0 (the start bit);
>   - $e$ = $4k+4$ to $4k+7$, for $k$ = 0 to 7: `tx` = `data[k]`, least significant bit first;
>   - $e$ = 36 to 39: `tx` = 1 (the stop bit);
>   - `busy` = 1 for $e$ = 0 to 39, and right after edge 40 `busy` = 0 and `tx` stays 1.
> - A `start` at an edge where `busy` was 1 before the edge is ignored. That includes edge 40, so the earliest next frame is accepted at edge 41. Only the value of `data` at edge 0 matters.
> - `rst` (synchronous, active high) aborts any frame: right after the edge, `tx` = 1 and `busy` = 0. It wins over `start`.
>
> Example: `data` = `8'ha5` accepted at edge 0 puts 0 on `tx` after edges 0 to 3, then 1, 0, 1, 0, 0, 1, 0, 1, four edges each, then the stop bit.
^spec

```ports
input clk
input rst
input start
input [7:0] data
output tx
output busy
```

```skeleton
module k_uart_tx(input clk, input rst, input start, input [7:0] data, output tx, output busy);
  parameter CLKS_PER_BIT = 4;
  // your design
endmodule
```

```vectors
rst start data | tx busy
1 1 00 | 1 0
1 0 00 | 1 0
0 0 3c | 1 0
0 1 a5 | 0 1
0 0 f9 | 0 1
0 0 6d | 0 1
0 0 7a | 0 1
0 0 01 | 1 1
0 0 a3 | 1 1
0 1 81 | 1 1
0 0 cf | 1 1
0 0 39 | 0 1
0 0 f8 | 0 1
0 0 e6 | 0 1
0 0 81 | 0 1
0 0 0e | 1 1
0 0 25 | 1 1
0 0 9c | 1 1
0 0 c9 | 1 1
0 0 6c | 0 1
0 0 1d | 0 1
0 0 90 | 0 1
0 0 7d | 0 1
0 0 48 | 0 1
0 1 4f | 0 1
0 0 95 | 0 1
0 0 09 | 0 1
0 0 91 | 1 1
0 0 20 | 1 1
0 0 47 | 1 1
0 0 4a | 1 1
0 0 bd | 0 1
0 0 df | 0 1
0 0 90 | 0 1
0 0 4b | 0 1
0 0 30 | 1 1
0 0 7b | 1 1
0 0 41 | 1 1
0 0 93 | 1 1
0 0 1e | 1 1
0 0 67 | 1 1
0 0 53 | 1 1
0 0 55 | 1 1
0 1 0f | 1 0
0 1 4b | 0 1
0 0 b9 | 0 1
0 0 12 | 0 1
0 0 ad | 0 1
0 0 33 | 1 1
0 0 21 | 1 1
0 0 8a | 1 1
0 0 23 | 1 1
0 0 c0 | 1 1
0 0 25 | 1 1
0 0 7e | 1 1
0 0 6b | 1 1
0 0 59 | 0 1
0 0 a0 | 0 1
0 0 b0 | 0 1
0 0 e7 | 0 1
0 0 23 | 1 1
0 0 24 | 1 1
0 0 37 | 1 1
0 0 e3 | 1 1
0 0 cd | 0 1
0 0 40 | 0 1
0 0 2d | 0 1
0 0 6e | 0 1
0 0 3f | 0 1
0 0 75 | 0 1
0 0 c8 | 0 1
0 0 2d | 0 1
0 0 b4 | 1 1
0 0 92 | 1 1
0 0 1c | 1 1
0 0 91 | 1 1
0 0 39 | 0 1
0 0 6f | 0 1
0 0 29 | 0 1
0 0 a5 | 0 1
0 0 91 | 1 1
0 0 c3 | 1 1
0 0 96 | 1 1
0 0 b2 | 1 1
0 0 00 | 1 0
0 0 00 | 1 0
0 1 c6 | 0 1
0 0 00 | 0 1
0 0 00 | 0 1
0 0 00 | 0 1
0 0 00 | 0 1
0 0 00 | 0 1
0 0 00 | 0 1
0 0 00 | 0 1
0 0 00 | 1 1
0 0 00 | 1 1
0 0 00 | 1 1
0 0 00 | 1 1
0 0 00 | 1 1
0 0 00 | 1 1
1 0 00 | 1 0
0 0 00 | 1 0
0 1 00 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 0 1
0 0 55 | 1 1
0 0 55 | 1 1
0 0 55 | 1 1
0 0 55 | 1 1
0 0 55 | 1 0
0 0 55 | 1 0
0 1 0e | 0 1
0 1 9e | 0 1
0 1 14 | 0 1
0 1 06 | 0 1
0 1 4f | 0 1
0 1 ed | 0 1
0 1 d9 | 0 1
0 1 6a | 0 1
0 1 cf | 1 1
0 1 ed | 1 1
0 1 fb | 1 1
0 1 a8 | 1 1
0 1 1f | 1 1
0 1 c2 | 1 1
0 1 61 | 1 1
0 1 67 | 1 1
0 1 a7 | 1 1
0 1 65 | 1 1
0 1 ca | 1 1
0 1 fb | 1 1
0 1 47 | 0 1
0 1 76 | 0 1
0 1 1b | 0 1
0 1 70 | 0 1
0 1 d5 | 0 1
0 1 a6 | 0 1
0 1 b8 | 0 1
0 1 9f | 0 1
0 1 dc | 0 1
0 1 99 | 0 1
0 1 93 | 0 1
0 1 93 | 0 1
0 1 71 | 0 1
0 1 e1 | 0 1
0 1 0f | 0 1
0 1 06 | 0 1
0 1 7e | 1 1
0 1 a3 | 1 1
0 1 63 | 1 1
0 1 51 | 1 1
0 1 30 | 1 0
0 1 85 | 0 1
0 1 ba | 0 1
0 1 b1 | 0 1
0 1 59 | 0 1
0 1 83 | 1 1
0 1 48 | 1 1
0 1 c4 | 1 1
0 1 29 | 1 1
0 1 07 | 0 1
0 1 c6 | 0 1
0 1 e4 | 0 1
0 1 c1 | 0 1
0 1 85 | 1 1
0 1 d4 | 1 1
0 1 f2 | 1 1
0 1 b8 | 1 1
0 1 82 | 0 1
0 1 99 | 0 1
0 1 85 | 0 1
0 1 17 | 0 1
0 1 5d | 0 1
0 1 d9 | 0 1
0 1 86 | 0 1
0 1 86 | 0 1
0 1 60 | 0 1
0 1 55 | 0 1
0 1 a2 | 0 1
0 1 7b | 0 1
0 1 e2 | 0 1
0 1 3e | 0 1
0 1 51 | 0 1
0 1 b2 | 0 1
0 1 55 | 1 1
0 1 66 | 1 1
0 1 c9 | 1 1
0 1 e4 | 1 1
0 1 f4 | 1 1
0 1 89 | 1 1
0 1 b1 | 1 1
0 1 f8 | 1 1
0 1 a9 | 1 0
0 1 4b | 0 1
0 1 d9 | 0 1
0 1 07 | 0 1
0 1 8d | 0 1
0 1 08 | 1 1
0 1 11 | 1 1
0 1 73 | 1 1
0 1 00 | 1 1
0 1 38 | 1 1
0 1 3b | 1 1
0 1 7d | 1 1
0 1 b0 | 1 1
0 1 51 | 0 1
0 1 90 | 0 1
0 1 6e | 0 1
0 1 bd | 0 1
0 1 35 | 1 1
0 1 79 | 1 1
0 1 28 | 1 1
0 1 06 | 1 1
0 1 2c | 0 1
0 1 71 | 0 1
0 1 ba | 0 1
0 1 dd | 0 1
0 1 f7 | 0 1
0 1 91 | 0 1
0 1 8b | 0 1
0 1 2d | 0 1
0 1 e5 | 1 1
0 1 73 | 1 1
0 1 54 | 1 1
0 1 81 | 1 1
0 1 e3 | 0 1
0 1 83 | 0 1
0 1 2c | 0 1
0 1 b6 | 0 1
0 1 ae | 1 1
0 1 33 | 1 1
0 1 9d | 1 1
0 1 d7 | 1 1
0 1 6f | 1 0
0 1 5f | 0 1
0 1 a4 | 0 1
0 1 32 | 0 1
0 1 4b | 0 1
0 1 b4 | 1 1
0 1 5b | 1 1
0 1 6e | 1 1
0 0 03 | 1 1
0 0 07 | 1 1
0 0 f6 | 1 1
0 0 eb | 1 1
0 0 93 | 1 1
0 0 21 | 1 1
0 0 2a | 1 1
0 0 a7 | 1 1
0 0 2f | 1 1
0 0 8f | 1 1
0 0 d0 | 1 1
0 0 80 | 1 1
0 0 26 | 1 1
0 0 d8 | 1 1
0 0 b6 | 1 1
0 0 a4 | 1 1
0 0 fd | 1 1
0 0 20 | 0 1
0 0 4c | 0 1
0 0 34 | 0 1
0 0 66 | 0 1
0 0 d2 | 1 1
0 0 e6 | 1 1
0 0 6a | 1 1
0 0 2a | 1 1
0 0 cf | 0 1
0 0 6b | 0 1
0 0 8b | 0 1
0 0 bb | 0 1
0 0 12 | 1 1
0 0 93 | 1 1
0 0 3e | 1 1
0 1 c6 | 1 1
0 0 26 | 1 0
0 0 dd | 1 0
0 0 aa | 1 0
0 0 b7 | 1 0
0 0 82 | 1 0
0 0 68 | 1 0
0 0 38 | 1 0
0 0 15 | 1 0
0 0 49 | 1 0
0 1 bb | 0 1
0 0 da | 0 1
0 0 bc | 0 1
0 0 2e | 0 1
0 0 7e | 1 1
0 0 f7 | 1 1
0 0 f5 | 1 1
0 0 5a | 1 1
0 0 71 | 1 1
0 0 d8 | 1 1
0 0 20 | 1 1
0 0 70 | 1 1
0 0 ad | 0 1
0 0 d2 | 0 1
0 0 3a | 0 1
0 0 23 | 0 1
0 0 f9 | 1 1
0 0 b8 | 1 1
0 0 3f | 1 1
0 0 c5 | 1 1
0 0 dd | 1 1
0 0 45 | 1 1
0 1 74 | 1 1
0 0 30 | 1 1
0 0 0d | 1 1
0 0 1c | 1 1
0 0 75 | 1 1
0 0 13 | 1 1
0 0 79 | 0 1
0 0 5f | 0 1
0 0 04 | 0 1
0 0 10 | 0 1
0 1 1d | 1 1
0 0 c5 | 1 1
0 1 f9 | 1 1
1 1 8f | 1 0
0 0 24 | 1 0
0 0 57 | 1 0
0 0 c2 | 1 0
0 0 e7 | 1 0
0 1 bf | 0 1
0 0 d1 | 0 1
0 0 de | 0 1
0 0 ca | 0 1
0 0 02 | 1 1
0 0 d5 | 1 1
0 0 81 | 1 1
0 0 9e | 1 1
0 0 d0 | 1 1
0 0 7f | 1 1
0 0 80 | 1 1
0 0 7d | 1 1
0 0 6f | 1 1
0 0 27 | 1 1
0 0 2b | 1 1
0 0 3d | 1 1
0 0 f1 | 1 1
0 0 06 | 1 1
0 0 3e | 1 1
0 0 aa | 1 1
0 0 53 | 1 1
0 0 22 | 1 1
0 0 6d | 1 1
0 0 bc | 1 1
0 0 52 | 1 1
0 0 05 | 1 1
0 1 82 | 1 1
0 0 14 | 1 1
0 0 db | 0 1
0 0 aa | 0 1
0 0 a3 | 0 1
0 1 69 | 0 1
0 0 28 | 1 1
0 0 c3 | 1 1
0 0 cc | 1 1
0 0 3e | 1 1
0 1 38 | 1 1
0 0 de | 1 1
```
