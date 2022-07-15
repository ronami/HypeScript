import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

function foo(a: number) {}

foo('a', bar, bazz)

`>;
type R = Parse<T>;
type C = Check<R>;
