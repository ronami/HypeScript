import type { TypeCheck } from '../src';

// Hover over the `Errors` type to see its value
type Errors = TypeCheck<`

// Defining an array of numbers
const a = [1, 2, 3];

// Changing one of its members to a string, will it work?
a[1] = 'foo';

// Defining another array of strings and numbers
const b = [1, 'a', 2, 'b'];

// Trying to assign one of its members to a value of type string, will it work?
const value: string = b[0];

`>;
