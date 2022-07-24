import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

1 == 2 == 3

`>;
type P = Parse<T>[0]['expression'];
type C = Check<P>;
