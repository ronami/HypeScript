import type { Tokenize } from './tokenize';
import type { Parse } from './parse';
import type { Check } from './checker';

type T = Tokenize<`
function foo () {
  const a = true
  const b = a
  const c = b
  
  return c
}
`>;
type R = Parse<T>[0]['body'];
type C = Check<[R]>;
