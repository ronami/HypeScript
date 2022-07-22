import type { Check } from '.';
import type { Tokenize, Token } from '../Tokenizer';
import type { Parse, BaseNode } from '../Parser';
import { expectType } from '../TestUtils';

type CheckWrapper<Input extends string> =
  Tokenize<Input> extends infer TokenList
    ? TokenList extends Array<Token<any>>
      ? Parse<TokenList> extends infer NodeList
        ? NodeList extends Array<BaseNode<any>>
          ? Check<NodeList>
          : never
        : never
      : never
    : never;

expectType<
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

"string"

`>
>([]);

expectType<
  CheckWrapper<`

123;

`>
>([]);

expectType<
  CheckWrapper<`

const a = null

`>
>([]);

expectType<
  CheckWrapper<`

const b = "world";

`>
>([]);

expectType<
  CheckWrapper<`

const hello = 1;
hello;

`>
>([]);

expectType<
  CheckWrapper<`

let a = null

`>
>([]);

expectType<
  CheckWrapper<`

let b = "world";

`>
>([]);

expectType<
  CheckWrapper<`

let hello = 1;
hello;

`>
>([]);

expectType<
  CheckWrapper<`

let hello = 1;
let world: number = hello;

`>
>([]);

expectType<
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

const hello = { foo: "bar" };
hello.foo;

`>
>([]);

expectType<
  CheckWrapper<`

const hello = {
  foo: {
    bar: "bazz"
  }
};

hello.foo.bar;

`>
>([]);

expectType<
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

const hello = "world";
const foo = hello;

`>
>([]);

expectType<
  CheckWrapper<`

const hello = "world";
const foo = hello;

foo;

`>
>([]);

expectType<
  CheckWrapper<`

const hello: string = "hello";

`>
>([]);

expectType<
  CheckWrapper<`

const hello: number = 123;

`>
>([]);

expectType<
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

const hello = "world";

const foo: string = hello;

`>
>([]);

expectType<
  CheckWrapper<`
  
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
  CheckWrapper<`
  
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
  CheckWrapper<`

const hello = {hey: "world"};

const foo: string = hello.hey;

`>
>([]);

expectType<
  CheckWrapper<`

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
  CheckWrapper<`

const o = {hey: "ho"};

o["hey"];

`>
>([]);

expectType<
  CheckWrapper<`

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
  CheckWrapper<`

const o = {hey: "ho"};
const k = "hey";

o[k];

`>
>([]);

expectType<
  CheckWrapper<`
  
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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
  CheckWrapper<`

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
