import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

const a = [1, 2].map(function (a: number) {})

`>;
type P = Parse<T>;
type C = Check<P>;
