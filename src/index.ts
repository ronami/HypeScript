import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
// import type { Check } from './checker';

type T = Tokenize<`const hello: number = 1`>;
type R = Parse<T>;
// type C = Check<[R]>;
