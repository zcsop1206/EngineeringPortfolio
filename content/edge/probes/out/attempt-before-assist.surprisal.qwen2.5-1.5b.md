# surprisal: attempt-before-assist

model: Qwen/Qwen2.5-1.5B  threshold: 10.0 bits

## highlighted (>= threshold)
Retrieval ==attempted== before the answer is shown ==strengthens== later recall more than ==studying== the answer directly, even when the attempt fails, ==provided== feedback follows the attempt.

## mean surprisal per token
5.69 bits

## completion test
head: Retrieval attempted before the answer is shown strengthens later recall more than studying

model continues: the answer after the retrieval attempt. This is known as the ____ effect.
A. Retrieval
B. Retrieval Failure
C. Retrieval Induction
D. Retrieval Prompting

mine: the answer directly, even when the attempt fails, provided feedback follows the attempt.

## interpretation
<!-- by hand. original / idiosyncratic / confused, per highlight. borrowed? -->
