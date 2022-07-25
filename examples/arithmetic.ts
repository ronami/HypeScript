import type { TypeCheck } from '../src';

// Hover over the `Errors` type to see its value
type Errors = TypeCheck<`

// What's the type of 'a'? Try adding an annotation to see its 
// type in the error
const a = 2 * 3;

// What about this computation? Should this show an error?
const b = 3 / false;

`>;
