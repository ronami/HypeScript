import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

[1, 2, 3]

`>;
type R = Parse<T>;
type C = Check<R>;
