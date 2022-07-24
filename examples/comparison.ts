import type { TypeCheck } from '../src';

// Hover over the `Errors` type to see its value
type Errors = TypeCheck<`

// Define a string
let hello = 'world';

// Define a number
let foo = 5;

// Can we compare them?
const result = foo === hello;

`>;
