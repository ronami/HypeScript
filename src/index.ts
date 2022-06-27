import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`const a = { hello: "world" }`>;
type R = Parse<T>;
