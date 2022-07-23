import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

let a = { foo: 5 };

a = { foo: 1 }

`>;
type P = Parse<T>;
type C = Check<P>;
