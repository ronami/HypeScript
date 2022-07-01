import type { Tokenize } from './tokenize';
import type { Parse } from './parse';
import type { Check } from './checker';

type T = Tokenize<`
function foo () {
  function hey() {
    if (a) {
      return 1
    }

    if (a) {
      return true
    }
  }

  function ho() {
    if (a) {
      return null
    }

    return hey()
  }

  return ho()
}
`>;
type R = Parse<T>[0]['body'];
type C = Check<[R]>;
