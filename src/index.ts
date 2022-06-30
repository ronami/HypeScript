import type { Tokenize } from './tokenize';
import type { Parse } from './parse';
import type { Check } from './checker';

type T = Tokenize<`
function foo () {
  const a = "1"
  const b = a
  
  return b
}
`>;
type R = Parse<T>[0]['body'];
type C = Check<[R]>;
