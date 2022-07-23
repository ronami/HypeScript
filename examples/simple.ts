import type { TypeCheck } from '../src';

// Hover over the `Errors` type to see its value
type Errors = TypeCheck<`

function foo(name: number) {
  return name;
}

foo('not a number');

`>;
