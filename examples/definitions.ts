import type { TypeCheck } from '../src';

// Hover over `Errors1` to see what's wrong with this input
type Errors1 = TypeCheck<`

// Checking if an element is included in the array
const a = [1, 2, 'a', 'b'].includes('a');

`>;

// Hover over `Errors2` to see what's wrong with this input
type Errors2 = TypeCheck<`

// Trying to push a string into an array of numbers
[1, 2, 3].push('a');

`>;

// Hover over `Errors3` to see what's wrong with this input
type Errors3 = TypeCheck<`

// Checking for the index of a substring
const b = 'hello world'.indexOf(true);

`>;

// Hover over `Errors4` to see what's wrong with this input
type Errors4 = TypeCheck<`

// Trying to split a string but forgetting the separator
const c = "a, b, c".split();

`>;
