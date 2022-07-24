import type { TypeCheck } from '../src';

// Hover over the `Errors` type to see its value
type Errors = TypeCheck<`

// Define a string
const hello = 'world';

// Define a number
const foo = 5;

// Can we compare them? What's the type of 'result'?
const result = foo === hello;

`>;