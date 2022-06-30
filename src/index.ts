import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`
function foo() {
    bar()
}

function foo() {
    bar()
}
`>;
type R = Parse<T>;
