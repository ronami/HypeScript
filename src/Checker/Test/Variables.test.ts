import type { TypeCheck } from '../..';
import { expectType } from '../../TestUtils';

expectType<
  TypeCheck<`

let a: number = 1

`>
>([]);

expectType<
  TypeCheck<`

let a = 1;

`>
>([]);

expectType<
  TypeCheck<`

const a: number = 1

`>
>([]);

expectType<
  TypeCheck<`

const a = 1;

`>
>([]);

expectType<
  TypeCheck<`

foo;

`>
>(["3: Cannot find name 'foo'."]);
