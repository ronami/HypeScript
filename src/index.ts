import type { Tokenize } from './tokenizer';
// import type { Parse } from './parser';
// import type { Check } from './checker';

type T = Tokenize<`"hello\n"`>;
// type R = Parse<T>[0]['body'];
// type C = Check<[R]>;
