## 🐬 HypeScript

> A simplified implementation of TypeScript's type-system written in TypeScript's own type-system

### Introduction

This project includes a (very) simplified implementation of [TypeScript](https://github.com/microsoft/TypeScript)'s type-system that's written in [TypeScript](https://github.com/microsoft/TypeScript)'s own type-system.

The implementation uses types only — with no runtime code whatsoever, and to see it in action you'll need to hover your mouse over the resulting type.

You enter TypeScript code as string and get possible type errors back:

```typescript
import type { TypeCheck } from 'hypescript';

type Errors = TypeCheck<`

function foo(name: string) {
  return name
}

const result = foo()

`>;

// Errors is now equal to the following type:
type Expected = ["Expected 1 arguments, but got 0."];
```

The project contains a tokenizer, parser and type-checker and includes comments explaining how everything works.

*☝ Please note that this project is meant to be used for fun and learning purposes and not for practical use.*

### Try running the code

See it live on your browser on the [TypeScript Playground]().

Alternatively, install `hypescript` in your own project with `yarn` or `npm` ([TypeScript](https://github.com/microsoft/TypeScript) 4.1 or later is required):

```
yarn add hypescript
```

### Supported features and syntax

Some syntax or type checking features aren't supported (yet), here are some example for what currently works (see demo link for each).

#### Calling a function with missing arguments

The following would result in the `Errors` type showing the following error: `Expected 1 arguments, but got 0.`

```typescript
import type { TypeCheck } from 'hypescript';

type Errors = TypeCheck<`

function foo(name: string) {
  return name
}

const result = foo()

`>;
```

### Additional links

- [The Super Tiny Compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)
- [TypeScripts Type System is Turing Complete](https://github.com/microsoft/TypeScript/issues/14833)
- [Typing the Technical Interview in TypeScript](https://gal.hagever.com/posts/typing-the-technical-interview-in-typescript/)
- [Functions and algorithms implemented purely with TypeScript's type system](https://github.com/ronami/meta-typing)
- [A SQL database implemented purely in TypeScript type annotations](https://github.com/codemix/ts-sql)
