import type { TypeCheck } from '.';

type Errors = TypeCheck<`

function foo(name: number) {
  return name;
}

foo('not a number');

`>;
