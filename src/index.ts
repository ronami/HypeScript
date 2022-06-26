import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`[]`>;
type R = Parse<T>;
