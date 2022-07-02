import type { Tokenize } from './tokenize';
import type { Parse } from './parse';
import type { Check } from './checker';

type T = Tokenize<`
function foo () {
  function bar(a: string) {
    return 1
  }

  function bazz() {
    if (b) {
      return true
    }

    return 1
  }

  return bar(bazz())
}
`>;
type R = Parse<T>[0]['body'];
type C = Check<[R]>;
