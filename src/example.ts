import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

const a = { foo: 5 };

a.faoo = '4';

`>;
type P = Parse<T>;
type C = Check<P>;
