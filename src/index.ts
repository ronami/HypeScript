import type { Tokenize } from './tokenize';
// import type { Parse } from './parse';

type T = Tokenize<`function foo (foo: string): bar {}`>;
// type R = Parse<T>;
