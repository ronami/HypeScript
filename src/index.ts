import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`
function foo() {
    function foo() {
        bar()
    }
    
    bar()
}
`>;
type R = Parse<T>;
