import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`
if (foo) {
  log()
}
`>;
type R = Parse<T>;
