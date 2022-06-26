import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`{ hello: "world", foo: 123 }`>;
type R = Parse<T>;
