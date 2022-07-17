// import type { TypeCheck } from '.';
import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';
// import type { Format } from './formatter';
// import type { Error } from './errors';
// import type { Token } from './tokens';
// import type { BaseNode } from './ast';

type T = Tokenize<`

function bar() {
  if (a) {
    return {
      hello: 'world'
    };
  }

  if (a) {
    return {
      foo: '123'
    };
  }

  return {
    hello: '1'
  };
}

const b: string = bar().hello;

`>;
type P = Parse<T>;
type C = Check<P>;
