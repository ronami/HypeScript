import type { TypeCheck } from '../src';

// Hover over `Errors1` to see what's wrong with this input
type Errors1 = TypeCheck<`

// Define a string
const hello = 'world';

// Define a number
const foo = 5;

// Can we compare them? What's the type of 'result'?
const result = foo === hello;

`>;

// Hover over `Errors2` to see what's wrong with this input
type Errors2 = TypeCheck<`

// What about checking if two string literals are equal?
if ('hello' == 'world') {
  console.log(1);
}

`>;
