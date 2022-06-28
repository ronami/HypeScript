import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`console.log(1)`>;
type R = Parse<T>;
