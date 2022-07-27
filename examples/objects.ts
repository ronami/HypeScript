import type { TypeCheck } from '../src';

// Hover over `Errors1` to see what's wrong with this input
type Errors1 = TypeCheck<`

// Defining an object
const a = {
  hello: "world",
  foo: 5,
};

// Changing one of its values from type number to type string, will it work?
a.foo = 'world';

`>;

// Hover over `Errors2` to see what's wrong with this input
type Errors2 = TypeCheck<`

const hello = 'world';

const a = {
  hello,
  foo: 5,
};

// Creating another object that references 'a'
const b = {
    a: a,
};

// Trying to assign one of b's properties to a string, will it work?
const c: string = b.a;

`>;
