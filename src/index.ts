import type { Tokenize } from './tokenize';
import type { Parse } from './parse';
import type { Check } from './checker';

type T = Tokenize<`
function foo () {
  const c = 5

  function bar (a: number) {
    return true
  }

  return bar(c)
}
`>;
type R = Parse<T>[0]['body'];
type C = Check<[R]>[0];
