import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`const a = { hello: 1, world: 2 }`>;
type R = Parse<T>;
