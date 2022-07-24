import type { TypeCheck } from '../src';

// Hover over the `Errors` type to see its value
type Errors = TypeCheck<`

// Defining an object
const a = {
  hello: "world",
  foo: 5,
};

// Changing one of its values from type number  to type string, will it work?
a.foo = 'world';

// Creating another object that references 'a'
const b = {
    a: a,
};

// Trying to assign one of b's properties to a string, will it work?
const c: string = b.a;

`>;
