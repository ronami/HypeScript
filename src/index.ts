import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`
function foo(a: string) {}
`>;
type R = Parse<T>;
