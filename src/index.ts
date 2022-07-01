import type { Tokenize } from './tokenize';
import type { Parse } from './parse';
import type { Check } from './checker';

type T = Tokenize<`
function foo () {
  function bar (a: number, b: string) {
    return true
  }

  const a = bar(1, "hello")

  return a
}
`>;
type R = Parse<T>[0]['body'];
type C = Check<[R]>;
