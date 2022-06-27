import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`const a = 5`>;
type R = Parse<T>;
