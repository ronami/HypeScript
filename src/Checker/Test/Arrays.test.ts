import type { TypeCheck } from '../..';
import { expectType } from '../../TestUtils';

expectType<
  TypeCheck<`

let a = [1, 2, 3];

`>
>([]);

expectType<
  TypeCheck<`

let a = [1, 2, 3];

let b: string = a[0];

`>
>(["5: Type 'number' is not assignable to type 'string'."]);

expectType<
  TypeCheck<`

let a: number = [1, '2', 3];

`>
>(["3: Type '(number | string)[]' is not assignable to type 'number'."]);

expectType<
  TypeCheck<`

let a: number = [1, '2', 3][0];

`>
>(["3: Type 'number | string' is not assignable to type 'number'."]);
