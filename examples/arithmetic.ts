import type { TypeCheck } from '../src';

// Hover over `Errors1` to see what's wrong with this input
type Errors1 = TypeCheck<`

// What's the type of 'a'? Try removing or changing the annotation to
// fix the type error

const a: string = 2 * 3;

`>;

// Hover over `Errors2` to see what's wrong with this input
type Errors2 = TypeCheck<`

// What about this computation? Should this show an error?
const b = 3 / false;

`>;
