import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
// import type { Check } from './checker';

type T = Tokenize<`function \n\nfoo() {\n\n\n\n}`>;
type R = Parse<T>;
// type C = Check<[R]>;
