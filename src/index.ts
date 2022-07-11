import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

[1, "hey", 2, 3, "foo", "bazz", false]

`>;
type R = Parse<T>;
type C = Check<R>;
