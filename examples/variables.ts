import type { TypeCheck } from '../src';

// Hover over the `Errors` type to see its value
type Errors = TypeCheck<`

// Define a constant
const a = 5;

// Can it be changed?
a = 3;

// Define a let variable
let b = "hello";

// Can it be changed?
b = "world";

// What about changing its type?
b = true;

// Add type annotations
let c: number = b;

`>;
