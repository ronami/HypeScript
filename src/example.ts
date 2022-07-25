import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

function square(n: number) {
  return n * n;
}
  
square("2");  

`>;
type P = Parse<T>;
type C = Check<P>;
