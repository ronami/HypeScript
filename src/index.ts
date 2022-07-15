import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

const a: number = '123'
const b: string = a

`>;
type R = Parse<T>;
type C = Check<R>;
