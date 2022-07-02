import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`
function foo () {
  function bar(s: string, b: boolean) {
    return 1
  }

  return bar("", true)
}
`>;
type R = Parse<T>[0]['body'];
type C = Check<[R]>;
