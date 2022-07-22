// import type { TypeCheck } from '.';
import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';
// import type { Format } from './formatter';
// import type { Error } from './errors';
// import type { Token } from './tokens';
// import type { BaseNode } from './ast';

type T = Tokenize<`

let a: number;

`>;
type P = Parse<T>;
// type C = Check<P>;
