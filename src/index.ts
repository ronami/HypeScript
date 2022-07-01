import type { Tokenize } from './tokenize';
import type { Parse } from './parse';
import type { Check } from './checker';

type T = Tokenize<`
function foo () {
  const b = { hey: 2 }
  const a = { hello: { hi: b}, foo: 5 }

  return a.hello.hi.hey
}
`>;
type R = Parse<T>[0]['body'];
type C = Check<[R]>;
