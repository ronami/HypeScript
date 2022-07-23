import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

const a = { foo: 5 };
const b = 'foo';

const c: number = a[b];

`>;
type P = Parse<T>;
type C = Check<P>;
