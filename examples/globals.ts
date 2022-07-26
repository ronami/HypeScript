import type { TypeCheck } from '../src';

// Hover over the `Errors` type to see its value
type Errors = TypeCheck<`

// Try breaking any of these

// Using globally available console, limited to a single argument
console.log(123);

// Or setting a timeout
setTimeout(function () {
    console.log(1);
}, 100);

// Or eval'ing
eval("what is this even")

`>;
