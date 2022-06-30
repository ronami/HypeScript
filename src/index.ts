import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`
"hello"
`>;
type R = Parse<T>;
