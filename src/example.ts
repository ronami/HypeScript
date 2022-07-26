import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

setTimeout(1, 100);

`>;
type P = Parse<T>;
type C = Check<P>;
