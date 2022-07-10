import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

const a = {
    hello: 1
}

const foo = "world"

a[1]

`>;
type R = Parse<T>;
type C = Check<R>;
