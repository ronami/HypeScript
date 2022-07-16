import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

const a = [1, 'f', false];

const b: number = a[0];

`>;
type R = Parse<T>;
type C = Check<R>;
