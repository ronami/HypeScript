import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

function foo(a: number, b: number) {}

foo(
  1,
  2,
)


`>;
type P = Parse<T>;
type C = Check<P>;
