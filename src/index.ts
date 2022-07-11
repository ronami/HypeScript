import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

const a = [1, "2"];
const b = a[0];
const c = [true, "3", b];
const d = c[0]

d()

`>;
type R = Parse<T>;
type C = Check<R>;
