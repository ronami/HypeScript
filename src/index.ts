import type { Tokenize } from './tokenize';
import type { Parse } from './parse';
import type { Check } from './checker';

type T = Tokenize<`
function foo () {
  const hey = null

  function bar(num: string) {
    return hey
  }

  return bar
}
`>;
type R = Parse<T>[0]['body'];
type C = Check<[R]>;
