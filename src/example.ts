import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

let a: number = [1, 2, 3];

a[0];

`>;
type P = Parse<T>;
type C = Check<P>;
