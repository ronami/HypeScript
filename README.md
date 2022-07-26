## 🐬 HypeScript

> A simplified implementation of TypeScript's type system written in TypeScript's own type system

### Introduction

This is a simplified implementation of [TypeScript](https://github.com/microsoft/TypeScript)'s type system that's written in TypeScript's type annotations. This means that it uses types only — with no runtime code whatsoever.

You pass TypeScript code as a string to the `TypeCheck` generic and get possible type errors back (**[See the live demo]()**):

```typescript
import type { TypeCheck } from 'hypescript';

type Errors = TypeCheck<`

function square(n: number) {
  return n * n;
}

square("2");

`>;

// Errors is now equal to the following type:
type Expected = [
  "7: Argument of type 'string' is not assignable to parameter of type 'number'."
];
```

Or you can try a more complex example (**[See the live demo]()**):

```typescript
import type { TypeCheck } from 'hypescript';

type Errors = TypeCheck<`

function foo(message: string) {
  if (message.includes("hello")) {
    return message;
  }

  return message.length;
}

const obj = {
  func: foo,
};

const result: number = obj.func("hello world");

`>;

// Errors is now equal to the following type:
type Expected = [
  "15: Type 'string | number' is not assignable to type 'number'."
];
```

*☝ Please note that this project is meant to be used for fun and learning purposes and not for practical use.*

### Try running the code

See a live demo in your browser on the [TypeScript Playground]().

Alternatively, install `hypescript` in your project with `yarn` or `npm` (TypeScript 4.7 or later is required):

```
yarn add hypescript
```

### Example showcase

Only a subset of TypeScript's syntax and features are available. Here's a list of examples (with browser demo links) for some capabilities:

- [Declaring and assigning variables with primitive values]()
- [Defining and calling functions]()
- [Instantiating arrays and accessing their members]()
- [Creating objects and accessing their properties]()
- [Using built-in members for string, array, and function types]()
- [Inferring complex return value of functions]()
- [Comparing between different types of values]()
- [Using arithmetic operations on numbers]()

### Additional links

- [TypeScripts Type System is Turing Complete](https://github.com/microsoft/TypeScript/issues/14833)
- [Functions and algorithms implemented purely with TypeScript's type system](https://github.com/ronami/meta-typing)
- [Typing the Technical Interview in TypeScript](https://gal.hagever.com/posts/typing-the-technical-interview-in-typescript/)
- [A collection of TypeScript type challenges with online judge](https://github.com/type-challenges/type-challenges)
- [Extreme Explorations of TypeScript's Type System](https://www.learningtypescript.com/articles/extreme-explorations-of-typescripts-type-system)
- [A SQL database implemented purely in TypeScript type annotations](https://github.com/codemix/ts-sql)
