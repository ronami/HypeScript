## 🐬 HypeScript

> A simplified implementation of TypeScript's type-system written in TypeScript's own type-system

### Introduction

This is a simplified implementation of [TypeScript](https://github.com/microsoft/TypeScript)'s type-system that's written in [TypeScript](https://github.com/microsoft/TypeScript)'s type annotations. This means that it uses types only — with no runtime code whatsoever.

You pass [TypeScript](https://github.com/microsoft/TypeScript) code as string to the `TypeCheck` generic and get possible type errors back (**[See the live demo]()**):

```typescript
import type { TypeCheck } from 'hypescript';

type Errors = TypeCheck<`

function foo(name: number) {
  return name;
}

foo('not a number');

`>;

// Errors is now equal to the following type:
type Expected = [
  "7: Argument of type 'string' is not assignable to parameter of type 'number'."
];
```

*☝ Please note that this project is meant to be used for fun and learning purposes and not for practical use.*

### Try running the code

See a live demo in your browser on the [TypeScript Playground]().

Alternatively, install `hypescript` in your own project with `yarn` or `npm` ([TypeScript](https://github.com/microsoft/TypeScript) 4.7 or later is required):

```
yarn add hypescript
```

### Example showcase

Some [TypeScript](https://github.com/microsoft/TypeScript) syntax and features haven't been implemented and won't work. Here's a list of examples (with browser demo links) for some capabilites:

- [Calling a function with insufficient arguments]()
- [Calling a function with wrong argument types]()
- [Trying to access a variable that haven't been defined]()
- [Accessing a property that doesn't exist on an object]()
- [Trying to assign a value to a variable that doesn't match its type annotation]()
- [Trying to access a variable that haven't been defined]()

### Additional links

- [TypeScripts Type System is Turing Complete](https://github.com/microsoft/TypeScript/issues/14833)
- [Typing the Technical Interview in TypeScript](https://gal.hagever.com/posts/typing-the-technical-interview-in-typescript/)
- [Functions and algorithms implemented purely with TypeScript's type system](https://github.com/ronami/meta-typing)
- [A SQL database implemented purely in TypeScript type annotations](https://github.com/codemix/ts-sql)
- [Collection of TypeScript type challenges with online judge](https://github.com/type-challenges/type-challenges)
