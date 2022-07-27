import type { TypeCheck } from '../src';

// Hover over `Errors1` to see what's wrong with this input
type Errors1 = TypeCheck<`

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

// Hover over `Errors2` to see what's wrong with this input
type Errors2 = TypeCheck<`

// What about this one?

// Define a function
function foo(n: number) {
  return n;
}

// Define another one
function bar(n: number) {
  if (n) {
    return n;
  }

  return 'oops!';
}

// Create an array with both functions
const array = [foo, bar];

// Try calling a member of the array, what would it return?
const result: number = array[0](5)

`>;
