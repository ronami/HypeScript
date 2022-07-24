import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

const b = ['2', null];
const c = ['2'];
const d = ['2'];

const a = d == c == b;

// b[1] = 2

`>;
type P = Parse<T>;
type C = Check<P>;
