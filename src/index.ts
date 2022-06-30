import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`
function foo() {
    const a = {}
}
`>;
type R = Parse<T>;
