import type { TypeCheck } from '..';
import { expectType } from '../TestUtils';

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
