import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

const a = [[1, 'a'], [true]]
const b: number = a[0].length

`>;
type P = Parse<T>;
type C = Check<P>;
