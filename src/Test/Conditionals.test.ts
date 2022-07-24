import type { TypeCheck } from '..';
import { expectType } from '../TestUtils';

expectType<
  TypeCheck<`

if (a) {
  b();
}

`>
>(["3: Cannot find name 'a'.", "4: Cannot find name 'b'."]);

expectType<
  TypeCheck<`

if (true) {
  if (false) {
    // empty
  }
}

`>
>([]);
