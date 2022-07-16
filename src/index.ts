import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

function foo() {
  if (a) {
  }

  return 'world';
}

const a: number = foo;

`>;
type R = Parse<T>;
type C = Check<R>;
