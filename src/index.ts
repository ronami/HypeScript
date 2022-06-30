import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`
const a: string = foo()
`>;
type R = Parse<T>;
