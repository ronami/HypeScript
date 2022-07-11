import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

const b = [1, { a: 'b' }, { a: 1 }];
const a = b[1]

a()

`>;
type R = Parse<T>;
type C = Check<R>;
