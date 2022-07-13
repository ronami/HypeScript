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
    type: 'SyntaxError',
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
    type: 'SyntaxError',
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

const hello = { foo: "bar" };
hello.world

`>
>([
  {
    type: 'SyntaxError',
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
    type: 'SyntaxError',
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
    type: 'SyntaxError',
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
    type: 'SyntaxError',
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
    type: 'SyntaxError',
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
    type: 'SyntaxError',
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
    type: 'SyntaxError',
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
    type: 'SyntaxError',
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
    type: 'SyntaxError',
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
    type: 'SyntaxError',
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
    type: 'SyntaxError',
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
    type: 'SyntaxError',
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
    type: 'SyntaxError',
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
    type: 'SyntaxError',
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
    type: 'SyntaxError',
    message: "Type '(number | string)[]' is not assignable to type 'string'.",
    lineNumber: 5,
  },
]);

expectType<
  TypeCheck<`

const a = [1,2,'3'][0];

const b: string = a;

`>
>([
  {
    type: 'SyntaxError',
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
    type: 'SyntaxError',
    message: "Type 'number[][]' is not assignable to type 'string'.",
    lineNumber: 5,
  },
]);
