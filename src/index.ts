import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
// import type { Check } from './checker';

type T = Tokenize<`if (1) {}`>;
type R = Parse<T>;
// type C = Check<[R]>;
