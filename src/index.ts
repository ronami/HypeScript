import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

const a = ['b', 1];
const b = a[1]

function foo(c: number) {}

foo(b);

`>;
type R = Parse<T>;
type C = Check<R>;
