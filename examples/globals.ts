import type { TypeCheck } from '../src';

// Hover over `Errors1` to see what's wrong with this input
type Errors1 = TypeCheck<`

// Try breaking this... and see what else is available

// Using globally available console, limited to a single argument
console.log(123);

`>;

// Hover over `Errors2` to see what's wrong with this input
type Errors2 = TypeCheck<`

// Try breaking this... and see what else is available

// Or setting a timeout
setTimeout(function () {
    console.log(1);
}, 100);

`>;

// Hover over `Errors3` to see what's wrong with this input
type Errors3 = TypeCheck<`

// Try breaking this... and see what else is available

// Or eval'ing
eval("what is this even")

`>;
