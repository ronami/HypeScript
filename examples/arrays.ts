import type { TypeCheck } from '../src';

// Hover over `Errors1` to see what's wrong with this input
type Errors1 = TypeCheck<`

// Defining an array of numbers
const a = [1, 2, 3];

// Changing one of its members to a string, will it work?
a[1] = 'foo';

`>;

// Hover over `Errors2` to see what's wrong with this input
type Errors2 = TypeCheck<`

// Defining another array of strings and numbers
const b = [1, 'a', 2, 'b'];

// Trying to assign one of its members to a value of type string, will it work?
const value: string = b[0];

`>;

// Hover over `Errors3` to see what's wrong with this input
type Errors3 = TypeCheck<`

// Defining an object
const a = {hello: 'world'};

// Defining another object
const b = {hello: 5};

// An array with both objects
const c = [a, b];

// Accessing a member of the array and getting its property
// What's the value of result?
const result: string = c[1].hello

`>;
