import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

const a = { b: true }
const b: boolean = a.b

`>;
type R = Parse<T>;
type C = Check<R>;
