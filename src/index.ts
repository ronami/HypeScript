import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`123`>;
type R = Parse<T>[0]['expression'];
type C = Check<[R]>;
