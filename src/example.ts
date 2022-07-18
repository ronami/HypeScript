// import type { TypeCheck } from '.';
import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';
// import type { Format } from './formatter';
// import type { Error } from './errors';
// import type { Token } from './tokens';
// import type { BaseNode } from './ast';

type T = Tokenize<`

function f1(a: number) {
  return 1;
}

function f2(a: string) {
  return 'a';
}

const a = [f1, f2];

const fn = a[0];

const b: number = fn(1);

`>;
type P = Parse<T>;
type C = Check<P>;
