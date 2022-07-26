import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

const a = function () {}

const b: boolean = a.name;

`>;
type P = Parse<T>;
type C = Check<P>;
