import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

let a = [1, '2'][0];

[true, 1][0] = a;

`>;
type P = Parse<T>;
type C = Check<P>;
