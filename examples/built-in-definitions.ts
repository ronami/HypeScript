import type { TypeCheck } from '../src';

// Hover over the `Errors` type to see its value
type Errors = TypeCheck<`

// Checking if an element is included in the array
const a = [1, 2, 'a', 'b'].includes('a');

// Trying to push a string into an array of numbers
[1, 2, 3].push('a');

// Checking for the index of a substring
const b = 'hello world'.indexOf('hello');

// Trying to split a string but forgetting the separator
const c = "a, b, c".split();

`>;
