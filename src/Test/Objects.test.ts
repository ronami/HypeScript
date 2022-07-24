import type { TypeCheck } from '..';
import { expectType } from '../TestUtils';

expectType<
  TypeCheck<`

const a = {};

`>
>([]);

expectType<
  TypeCheck<`

const a = {
  hello: "world",
};

const b: number = a.hello;

const c = a.world;

`>
>([
  "7: Type 'string' is not assignable to type 'number'.",
  "9: Property 'world' does not exist on type '{ hello: string; }'.",
]);

expectType<
  TypeCheck<`

const a = {
  hello: "world",
};

const b = {
  hello: 5,
}

const c = [a, b];

const d: number = c[0].hello;

const e: number = c[0].world;
`>
>([
  "13: Type 'string | number' is not assignable to type 'number'.",
  "15: Type 'undefined | undefined' is not assignable to type 'number'.",
]);

expectType<
  TypeCheck<`

const a = {
  hey: "ho",
};

const b = "hey";

const c: string = a[b];

`>
>([]);

expectType<
  TypeCheck<`

const a = {
  hey: "ho",
};

const b = {};

const c: string = a[b];

`>
>(["9: Type '{}' cannot be used as an index type."]);
