import type { TypeCheck } from '../src';

// Hover over the `Errors` type to see its value
type Errors = TypeCheck<`

// Define a function, what does this function return?
// (Try to ommit the type annotation and see what happens)
function bar(a: number) {
  return a;
}

// Let's check its return value (No arguments have been passed, is there an error?)
const result1 = bar();

// Try again by passing arguments (Wrong argument type for 'b')
const result2 = bar('bazz');

// Calling the function correctly and trying to match its value to 'boolean'
const result3: boolean = bar(1);

`>;
