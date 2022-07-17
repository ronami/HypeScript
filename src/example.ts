// import type { TypeCheck } from '.';
import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';
// import type { Format } from './formatter';
// import type { Error } from './errors';
// import type { Token } from './tokens';
// import type { BaseNode } from './ast';

type T = Tokenize<`

function bar() {
    if (a) {
        return 2;
    }

    return 1;
}

const b: number = bar;

`>;
type P = Parse<T>;
type C = Check<P>;
