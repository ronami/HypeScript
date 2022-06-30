import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`[].foo`>;
type R = Parse<T>;
