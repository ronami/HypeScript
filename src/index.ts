import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`
function foo() {
    return 1
}
`>;
type R = Parse<T>;
