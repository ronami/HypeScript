import type { Tokenize } from './tokenize';
import type { Parse } from './parse';
import type { Check } from './checker';

// type T = Tokenize<`
// function ran (foo: string, bar: boolean) {}
// `>;
// type R = Parse<T>;

type T = Tokenize<`
function foo () {
  const a = true

  if (a) {
    return a
  }

  return "bar"
}
`>;
type R = Parse<T>[0]['body'];
type C = Check<[R]>;
