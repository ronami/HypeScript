import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

const a = [1, "2", 3];
const b = a[0];

const c: number = b;

`>;
type R = Parse<T>;
type C = Check<R>;
