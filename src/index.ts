import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

const a = [{ a: 'b' }, { a: '1' }];
const b = a[1]
const c = b.a;

const d: string = c;

`>;
type R = Parse<T>;
type C = Check<R>;
