import type { TypeCheck } from '../src';

// Hover over the `Errors` type to see its value
type Errors = TypeCheck<`

// Define a function, what does this function return?
function bar(a: number) {
  // (Try to ommit the type annotation on 'a' and see what happens)
  return a;
}

// Not passing any arguments, should this show an error?
const result1 = bar();

// Passing the wrong type of argument (string instead of a number)
const result2 = bar('bazz');

// Calling the function correctly and trying to match its value to 'boolean'
const result3: boolean = bar(1);

`>;
