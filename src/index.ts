import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
// import type { Check } from './checker';

type T = Tokenize<`[\ntrue, \nnull\n]`>;
type R = Parse<T>[0]['data'];
// type C = Check<[R]>;
