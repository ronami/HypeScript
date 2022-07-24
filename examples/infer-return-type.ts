import type { TypeCheck } from '../src';

// Hover over the `Errors` type to see its value
type Errors = TypeCheck<`

// Define a function, what does this function return?
function bar(a: number) {
  if (a == 1) {
    return 'one';
  }

  return a;
}

// Let's check its return value, will this show an error?
const result1: number = bar(5);

`>;
