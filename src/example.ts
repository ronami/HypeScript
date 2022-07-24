import type { Tokenize } from './Tokenizer';
import type { Parse } from './Parser';
import type { Check } from './Checker';

type T = Tokenize<`

// Define a string
const hello = '5';

// Define a number
const foo = 'world';

// Can we compare them?
const result = foo === hello;

`>;
type P = Parse<T>;
type C = Check<P>;
