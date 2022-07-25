import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

const a = {a: ['a', true][0]} == {a: [null, 'a', 1][0]}

`>;
type P = Parse<T>;
type C = Check<P>;
