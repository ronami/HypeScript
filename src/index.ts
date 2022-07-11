import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

function foo(a) {
  return a;
}

const bar: any = foo(1)

const bazz: number = bar;

`>;
type R = Parse<T>;
type C = Check<R>;
