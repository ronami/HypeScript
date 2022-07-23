import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

const a = [1, '2'];

a[0] = true;

`>;
type P = Parse<T>;
type C = Check<P>;
