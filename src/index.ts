import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

function foo(a: string) {
  return a;
}

const bar = foo;

const w = bar(false);

`>;
type R = Parse<T>;
type C = Check<R>;
