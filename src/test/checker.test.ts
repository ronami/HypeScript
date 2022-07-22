import type { Tokenize } from '../tokenizer';
import type { Parse } from '../parser';
import type { Check } from '../checker';
import { expectType } from './utils';

type TypeCheck<T extends string> = Tokenize<T> extends infer G
  ? G extends Array<any>
    ? Parse<G> extends infer J
      ? J extends Array<any>
        ? Check<J>
        : never
      : never
    : never
  : never;

expectType<
  TypeCheck<`

hello

`>
>([
  {
    type: 'TypeError',
    message: "Cannot find name 'hello'.",
    lineNumber: 3,
  },
]);

expectType<
  TypeCheck<`

world;

`>
>([
  {
    type: 'TypeError',
    message: "Cannot find name 'world'.",
    lineNumber: 3,
  },
]);

expectType<
  TypeCheck<`

"string"

`>
>([]);

expectType<
  TypeCheck<`

123;

`>
>([]);

expectType<
  TypeCheck<`

const a = null

`>
>([]);

expectType<
  TypeCheck<`

const b = "world";

`>
>([]);

expectType<
  TypeCheck<`

const hello = 1;
hello;

`>
>([]);

expectType<
  TypeCheck<`

let a = null

`>
>([]);

expectType<
  TypeCheck<`

let b = "world";

`>
>([]);

expectType<
  TypeCheck<`

let hello = 1;
hello;

`>
>([]);

expectType<
  TypeCheck<`

let hello;
let world: number = hello;

`>
>([]);

expectType<
  TypeCheck<`

let hello = 'world';
let world: number = hello;

`>
>([
  {
    type: 'TypeError',
    message: "Type 'string' is not assignable to type 'number'.",
    lineNumber: 4,
  },
]);

expectType<
  TypeCheck<`

const hello = { foo: "bar" };
hello.world

`>
>([
  {
    type: 'TypeError',
    message: "Property 'world' does not exist on type '{ foo: string; }'.",
    lineNumber: 4,
  },
]);

expectType<
  TypeCheck<`

const hello = { foo: "bar" };
hello.foo;

`>
>([]);

expectType<
  TypeCheck<`

const hello = {
  foo: {
    bar: "bazz"
  }
};

hello.foo.bar;

`>
>([]);

expectType<
  TypeCheck<`

const hello = {
  foo: {
    bar: "bazz"
  }
};

hello
  .foo
  .hey;

`>
>([
  {
    type: 'TypeError',
    message: "Property 'hey' does not exist on type '{ bar: string; }'.",
    lineNumber: 11,
  },
]);

expectType<
  TypeCheck<`

const hello = "world";

hello.foo

`>
>([
  {
    type: 'TypeError',
    message: "Property 'foo' does not exist on type 'string'.",
    lineNumber: 5,
  },
]);

expectType<
  TypeCheck<`

const hello = "world";
const foo = hello;

`>
>([]);

expectType<
  TypeCheck<`

const hello = "world";
const foo = hello;

foo;

`>
>([]);

expectType<
  TypeCheck<`

const hello: string = "hello";

`>
>([]);

expectType<
  TypeCheck<`

const hello: number = 123;

`>
>([]);

expectType<
  TypeCheck<`

const hello: number = "hello";

`>
>([
  {
    type: 'TypeError',
    message: "Type 'string' is not assignable to type 'number'.",
    lineNumber: 3,
  },
]);

expectType<
  TypeCheck<`

const hello: string = 123;

`>
>([
  {
    type: 'TypeError',
    message: "Type 'number' is not assignable to type 'string'.",
    lineNumber: 3,
  },
]);

expectType<
  TypeCheck<`

const hello = "world";
const foo: number = hello;

`>
>([
  {
    type: 'TypeError',
    message: "Type 'string' is not assignable to type 'number'.",
    lineNumber: 4,
  },
]);

expectType<
  TypeCheck<`

const hello = "world";

const foo: string = hello;

`>
>([]);

expectType<
  TypeCheck<`
  
const hello = {hey: "world"};

const foo: number = hello;

`>
>([
  {
    type: 'TypeError',
    message: "Type '{ hey: string; }' is not assignable to type 'number'.",
    lineNumber: 5,
  },
]);

expectType<
  TypeCheck<`
  
const hello = {hey: "world"};

const foo: number = hello.hey;
  
`>
>([
  {
    type: 'TypeError',
    message: "Type 'string' is not assignable to type 'number'.",
    lineNumber: 5,
  },
]);

expectType<
  TypeCheck<`

const hello = {hey: "world"};

const foo: string = hello.hey;

`>
>([]);

expectType<
  TypeCheck<`

const o = {};

o["hey"];

`>
>([
  {
    type: 'TypeError',
    message: "Property 'hey' does not exist on type '{}'.",
    lineNumber: 5,
  },
]);

expectType<
  TypeCheck<`

const o = {hey: "ho"};

o["hey"];

`>
>([]);

expectType<
  TypeCheck<`

const o = {};
const k = "hey";

o
 [k];

`>
>([
  {
    type: 'TypeError',
    message: "Property 'hey' does not exist on type '{}'.",
    lineNumber: 7,
  },
]);

expectType<
  TypeCheck<`

const o = {hey: "ho"};
const k = "hey";

o[k];

`>
>([]);

expectType<
  TypeCheck<`
  
const o = {
  hey: {
    ho:"let's go"
  }
};

const k = "hey";

o[k]["ho"];
  
`>
>([]);

expectType<
  TypeCheck<`

const o = {
  hey: {
    ho:"let's go"
  }
};

const k = "hey";

o[k]["hi"];

`>
>([
  {
    type: 'TypeError',
    message: "Property 'hi' does not exist on type '{ ho: string; }'.",
    lineNumber: 11,
  },
]);

expectType<
  TypeCheck<`

const o = {
  hey: {
    ho:"let's go"
  }
};

const k = "hey";

o[k][{}];

`>
>([
  {
    type: 'TypeError',
    message: "Type '{}' cannot be used as an index type.",
    lineNumber: 11,
  },
]);

expectType<
  TypeCheck<`

const o = {
  hey: "ho:"
};

o[true];

`>
>([
  {
    type: 'TypeError',
    message: "Type 'boolean' cannot be used as an index type.",
    lineNumber: 7,
  },
]);

expectType<
  TypeCheck<`

const a = [1,2,3];

const b: string = a;

`>
>([
  {
    type: 'TypeError',
    message: "Type 'number[]' is not assignable to type 'string'.",
    lineNumber: 5,
  },
]);

expectType<
  TypeCheck<`

const a = [1,2,'3'];

const b: string = a;

`>
>([
  {
    type: 'TypeError',
    message: "Type '(number | string)[]' is not assignable to type 'string'.",
    lineNumber: 5,
  },
]);

expectType<
  TypeCheck<`

const c: any = 1;

const a = [c, 2, '3'];

const b: string = a;

`>
>([
  {
    type: 'TypeError',
    message: "Type 'any[]' is not assignable to type 'string'.",
    lineNumber: 7,
  },
]);
expectType<
  TypeCheck<`

const a = [1,2,'3'][0];

const b: string = a;

`>
>([
  {
    type: 'TypeError',
    message: "Type 'number | string' is not assignable to type 'string'.",
    lineNumber: 5,
  },
]);

expectType<
  TypeCheck<`

const a = [[1, 2]];

const b: string = a;

`>
>([
  {
    type: 'TypeError',
    message: "Type 'number[][]' is not assignable to type 'string'.",
    lineNumber: 5,
  },
]);

expectType<
  TypeCheck<`

hello

world

`>
>([
  {
    type: 'TypeError',
    message: "Cannot find name 'hello'.",
    lineNumber: 3,
  },
  {
    type: 'TypeError',
    message: "Cannot find name 'world'.",
    lineNumber: 5,
  },
]);

expectType<
  TypeCheck<`

const a: number = hello

const b: number = a

`>
>([
  {
    type: 'TypeError',
    message: "Cannot find name 'hello'.",
    lineNumber: 3,
  },
]);

expectType<
  TypeCheck<`

const a: string = hello

const b: number = a

`>
>([
  {
    type: 'TypeError',
    message: "Cannot find name 'hello'.",
    lineNumber: 3,
  },
  {
    type: 'TypeError',
    message: "Type 'string' is not assignable to type 'number'.",
    lineNumber: 5,
  },
]);

expectType<
  TypeCheck<`

const a: string = hello()

const b: number = a

`>
>([
  {
    type: 'TypeError',
    message: "Cannot find name 'hello'.",
    lineNumber: 3,
  },
  {
    type: 'TypeError',
    message: "Type 'string' is not assignable to type 'number'.",
    lineNumber: 5,
  },
]);

expectType<
  TypeCheck<`

const a: string = hello(foo, bar)

const b: number = a

`>
>([
  {
    type: 'TypeError',
    message: "Cannot find name 'hello'.",
    lineNumber: 3,
  },
  {
    type: 'TypeError',
    message: "Cannot find name 'foo'.",
    lineNumber: 3,
  },
  {
    type: 'TypeError',
    message: "Cannot find name 'bar'.",
    lineNumber: 3,
  },
  {
    type: 'TypeError',
    message: "Type 'string' is not assignable to type 'number'.",
    lineNumber: 5,
  },
]);

expectType<
  TypeCheck<`

function foo(a: string, b: number) {}

foo(1, 'a')

`>
>([
  {
    type: 'TypeError',
    message:
      "Argument of type 'number' is not assignable to parameter of type 'string'.",
    lineNumber: 5,
  },
]);

expectType<
  TypeCheck<`

function foo(a: number) {
  return 5
}

const a = foo('a', bar, bazz)

const b: string = a;

`>
>([
  {
    type: 'TypeError',
    message: "Cannot find name 'bar'.",
    lineNumber: 7,
  },
  {
    type: 'TypeError',
    message: "Cannot find name 'bazz'.",
    lineNumber: 7,
  },
  {
    type: 'TypeError',
    message: 'Expected 1 arguments, but got 3.',
    lineNumber: 7,
  },
  {
    type: 'TypeError',
    message: "Type 'number' is not assignable to type 'string'.",
    lineNumber: 9,
  },
]);

expectType<
  TypeCheck<`

function foo(a: number, b: boolean) {
  return 5
}

const b: string = foo;

`>
>([
  {
    type: 'TypeError',
    message:
      "Type '(a: number, b: boolean) => number' is not assignable to type 'string'.",
    lineNumber: 7,
  },
]);

expectType<
  TypeCheck<`

function foo(a: number, b: boolean) {
  return 5
}

const b: string = { hello: true, world: foo, hey: [1, {}] };

`>
>([
  {
    type: 'TypeError',
    message:
      "Type '{ hello: boolean; world: (a: number, b: boolean) => number; hey: (number | {})[]; }' is not assignable to type 'string'.",
    lineNumber: 7,
  },
]);

expectType<
  TypeCheck<`

function bar() {
  if (a) {
    return 2;
  }

  return 1;
}

const b: number = bar;

`>
>([
  {
    type: 'TypeError',
    message: "Cannot find name 'a'.",
    lineNumber: 4,
  },
  {
    type: 'TypeError',
    message: "Type '() => number' is not assignable to type 'number'.",
    lineNumber: 11,
  },
]);

expectType<
  TypeCheck<`

function bar() {
  if (a) {
    return 'foo';
  }

  return 1;
}

const b: number = bar;

`>
>([
  {
    type: 'TypeError',
    message: "Cannot find name 'a'.",
    lineNumber: 4,
  },
  {
    type: 'TypeError',
    message: "Type '() => string | number' is not assignable to type 'number'.",
    lineNumber: 11,
  },
]);

expectType<
  TypeCheck<`

function bar() {
  return {
    hello: 'world'
  }
}

const b: number = bar;

`>
>([
  {
    type: 'TypeError',
    message:
      "Type '() => { hello: string; }' is not assignable to type 'number'.",
    lineNumber: 9,
  },
]);

expectType<
  TypeCheck<`

const a = [1, 'a'];
const b = [true, null];
const c = [a[1], b[0]];

const num: number = c;

`>
>([
  {
    type: 'TypeError',
    message:
      "Type '(number | string | boolean | null)[]' is not assignable to type 'number'.",
    lineNumber: 7,
  },
]);

expectType<
  TypeCheck<`

function bar() {
  if (a) {
    return {
      hello: 'world'
      };
  }

  if (a) {
    return {
      hello: 123
    };
  }

  return {
    hello: '1'
  };
}

const b: string = bar().hello;

`>
>([
  {
    type: 'TypeError',
    message: "Cannot find name 'a'.",
    lineNumber: 4,
  },
  {
    type: 'TypeError',
    message: "Cannot find name 'a'.",
    lineNumber: 10,
  },
  {
    type: 'TypeError',
    message: "Type 'string | number' is not assignable to type 'string'.",
    lineNumber: 21,
  },
]);

expectType<
  TypeCheck<`

function bar() {
  if (a) {
    return {
      hello: 'world'
      };
  }

  if (a) {
    return {
      hello: '123'
    };
  }

  return {
    hello: '1'
  };
}

const b: string = bar().hello;

`>
>([
  {
    type: 'TypeError',
    message: "Cannot find name 'a'.",
    lineNumber: 4,
  },
  {
    type: 'TypeError',
    message: "Cannot find name 'a'.",
    lineNumber: 10,
  },
]);

expectType<
  TypeCheck<`

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

`>
>([
  {
    type: 'TypeError',
    message: "Cannot find name 'a'.",
    lineNumber: 4,
  },
  {
    type: 'TypeError',
    message: "Cannot find name 'a'.",
    lineNumber: 10,
  },
  {
    type: 'TypeError',
    message: "Type 'string | undefined' is not assignable to type 'string'.",
    lineNumber: 21,
  },
]);

expectType<
  TypeCheck<`

const c: any = 1

const a = [1, c, 'a'];

const b: string = a;

`>
>([
  {
    type: 'TypeError',
    message: "Type 'any[]' is not assignable to type 'string'.",
    lineNumber: 7,
  },
]);

expectType<
  TypeCheck<`

function foo(bar, hello) {
  hey()
}

const a: number = foo;

`>
>([
  {
    type: 'TypeError',
    message: "Parameter 'bar' implicitly has an 'any' type.",
    lineNumber: 3,
  },
  {
    type: 'TypeError',
    message: "Parameter 'hello' implicitly has an 'any' type.",
    lineNumber: 3,
  },
  {
    type: 'TypeError',
    message: "Cannot find name 'hey'.",
    lineNumber: 4,
  },
  {
    type: 'TypeError',
    message:
      "Type '(bar: any, hello: any) => void' is not assignable to type 'number'.",
    lineNumber: 7,
  },
]);

expectType<
  TypeCheck<`

function a (a: number) {
  return '1';
}

function b () {
    return 1;
}

const c = [a, 'b'];

const d: number = c[0](1);

`>
>([
  {
    type: 'TypeError',
    message:
      "This expression is not callable. Not all constituents of type '(a: number) => string | string' are callable.",
    lineNumber: 13,
  },
]);

expectType<
  TypeCheck<`

function a (a: number) {
  return '1';
}

function b () {
    return 1;
}

const c = [a, b];

const d: number = c[0](1);

`>
>([
  {
    type: 'TypeError',
    message: "Type 'number | string' is not assignable to type 'number'.",
    lineNumber: 13,
  },
]);

expectType<
  TypeCheck<`

function a (a: number) {
  return '1';
}

function b () {
    return 1;
}

const c = [a, b];

const d: number = c[0]();

`>
>([
  {
    type: 'TypeError',
    message: 'Expected 1 arguments, but got 0.',
    lineNumber: 13,
  },
  {
    type: 'TypeError',
    message: "Type 'number | string' is not assignable to type 'number'.",
    lineNumber: 13,
  },
]);

expectType<
  TypeCheck<`

function a (a: number) {
  return '1';
}

function b (b: string) {
    return 1;
}

const c = [a, b];

const d: number = c[0](1);

`>
>([
  {
    type: 'TypeError',
    message:
      "Argument of type 'number' is not assignable to parameter of type 'never'.",
    lineNumber: 13,
  },
  {
    type: 'TypeError',
    message: "Type 'number | string' is not assignable to type 'number'.",
    lineNumber: 13,
  },
]);

expectType<
  TypeCheck<`

function a (a: number) {
  return '1';
}

function b (b: any) {
    return 1;
}

const c = [a, b];

const d: number = c[0](1);

`>
>([
  {
    type: 'TypeError',
    message: "Type 'number | string' is not assignable to type 'number'.",
    lineNumber: 13,
  },
]);

expectType<
  TypeCheck<`

function a (a: number, c: boolean) {
  return '1';
}

function b (b: any) {
    return 1;
}

const c = [a, b];

const d: number = c[0](1, false);

`>
>([
  {
    type: 'TypeError',
    message: "Type 'number | string' is not assignable to type 'number'.",
    lineNumber: 13,
  },
]);
