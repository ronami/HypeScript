import type { TypeCheck } from '../src';

// Hover over `Errors1` to see what's wrong with this input
type Errors1 = TypeCheck<`

// Define a function, what does this function return?
function bar(a) {
  // (Try adding a type annotation on 'a' to fix the type error)
  return a;
}

`>;

// Hover over `Errors2` to see what's wrong with this input
type Errors2 = TypeCheck<`

function bar(a: number) {
  return a;
}

// Not passing any arguments, should this show an error?
const result1 = bar();

`>;

// Hover over `Errors3` to see what's wrong with this input
type Errors3 = TypeCheck<`

function bar(a: number) {
  return a;
}

// Passing the wrong type of argument (string instead of a number)
const result2 = bar('bazz');

`>;

// Hover over `Errors4` to see what's wrong with this input
type Errors4 = TypeCheck<`

function bar(a: string) {
  return function () {
    return a.includes('hello');
  };
}

// Calling the function correctly and trying to match its value to 'boolean'
const fn = bar(1);

// Can 'fn' be called? Try below

`>;
