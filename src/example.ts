import type { TypeCheck } from '.';

type Errors = TypeCheck<`

function foo() {
  if (a) {
    return 'hello';
  }

  return 'world';
}

const b = {
    hello: 'hello'
};

const c = b[b.hello]

`>;
