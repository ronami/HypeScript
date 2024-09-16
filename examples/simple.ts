import type { TypeCheck } from '../src';

// Hover over the `Errors` type to see its value
type Errors = TypeCheck<`

function square(n: number) {
  return n * n;
}

square("2");

`>;
