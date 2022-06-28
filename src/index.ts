import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`const a = console.log(1, 2, 3)`>;
type R = Parse<T>;
