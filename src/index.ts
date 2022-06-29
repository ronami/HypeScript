import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`a.b()`>;
type R = Parse<T>;
