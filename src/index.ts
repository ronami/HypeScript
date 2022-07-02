import type { Tokenize } from './tokenize';
import type { Parse } from './parse';
import type { Check } from './checker';

type T = Tokenize<`
function foo () {
  function bar(a: number) {
    return 1
  }

  return bar(2)
}
`>;
type R = Parse<T>[0]['body'];
type C = Check<[R]>;
