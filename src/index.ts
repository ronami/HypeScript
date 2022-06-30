import type { Tokenize } from './tokenize';
import type { Parse } from './parse';
import type { Check } from './checker';

type T = Tokenize<`
const a: string = foo()
`>;
type R = Parse<T>;
type C = Check<R>;
