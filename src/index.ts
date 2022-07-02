import type { Tokenize } from './tokenize';
import type { Parse } from './parse';
import type { Check } from './checker';

type T = Tokenize<`
function foo () {
  return 3.toString().length.toString().length.toString().length
}
`>;
type R = Parse<T>[0]['body'];
type C = Check<[R]>;
