import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

function foo(a: number) {
    return 5
}

const a = foo('a', bar, bazz)

const b: string = a;

`>;
type R = Parse<T>;
type C = Check<R>;
