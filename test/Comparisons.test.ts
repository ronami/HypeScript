import type { TypeCheck } from '../src';
import { expectType } from './TestUtils';

expectType<
  TypeCheck<`

const a: boolean = 1 == 2;

`>
>([
  "3: This condition will always return 'false' since the types '1' and '2' have no overlap.",
]);

expectType<
  TypeCheck<`

const a: boolean = '1' == 2;

`>
>([
  "3: This condition will always return 'false' since the types 'string' and 'number' have no overlap.",
]);

expectType<
  TypeCheck<`

let a = '1';

let b = '2';

const c: boolean = a === b;

`>
>([]);

expectType<
  TypeCheck<`

let a = [1, 2];

let b = [1];

const c: boolean = a[0] === b[0];

`>
>([]);

expectType<
  TypeCheck<`

let a = [1, '2'];

let b = [1];

const c: boolean = a[0] === b[0];

`>
>([]);

expectType<
  TypeCheck<`

let a = [true, '2'];

let b = [1];

const c: boolean = a[0] === b[0];

`>
>([
  "7: This condition will always return 'false' since the types 'boolean | string' and 'number' have no overlap.",
]);
