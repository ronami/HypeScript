## 🐟 Type-Fusion

> A (very) simplified implementation of TypeScript's type-system written in TypeScript's own type-system

### Introduction

This project includes a simplified implementation of TypeScript's type-system that's written in TypeScript's own type-system.

The implementation includes an EcmaScript tokenizer and parser, along with a limited type-system. Here's an example of using it:

```typescript
import type Check from '.'

type R = Check<`
  function foo (name: string) {
    console.log(name)
  }

  foo(5)
`>
```

Hovering with the mouse on `R` (when cloned or in TypeScript's playground) will show the next type error:

```
Argument of type 'number' is not assignable to parameter of type 'string'.
```

Passing in a string instead (like `'hello'`) will resolve the error.

*☝ Please note that this project is meant to be used for fun and learning purposes and not for practical use.*

### Supported features and syntax
