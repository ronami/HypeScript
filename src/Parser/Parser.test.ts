import type { Tokenize } from '../Tokenizer';
import type { Parse } from '../Parser';
import { expectType } from '../test-utils';

type ParseAst<T extends string> = Tokenize<T> extends infer G
  ? G extends Array<any>
    ? Parse<G>
    : never
  : never;

expectType<ParseAst<`hello`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'Identifier',
      name: 'hello',
      typeAnnotation: null,
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`"hello"`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'StringLiteral',
      value: 'hello',
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`123`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'NumericLiteral',
      value: '123',
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`true`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'BooleanLiteral',
      value: true,
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`\nfalse`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'BooleanLiteral',
      value: false,
      data: { startLineNumber: 2, endLineNumber: 2 },
    },
    data: {
      startLineNumber: 2,
      endLineNumber: 2,
    },
  },
]);

expectType<ParseAst<`null`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'NullLiteral',
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`\n\nnull`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'NullLiteral',
      data: { startLineNumber: 3, endLineNumber: 3 },
    },
    data: {
      startLineNumber: 3,
      endLineNumber: 3,
    },
  },
]);

expectType<ParseAst<`hello world`>>({
  type: 'ParsingError',
  message: "';' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`hello "world"`>>({
  type: 'ParsingError',
  message: "';' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`function foo () { hello "world" }`>>({
  type: 'ParsingError',
  message: "';' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`hello\n "world"`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'Identifier',
      name: 'hello',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'StringLiteral',
      value: 'world',
      data: {
        startLineNumber: 2,
        endLineNumber: 2,
      },
    },
    data: {
      startLineNumber: 2,
      endLineNumber: 2,
    },
  },
]);

expectType<ParseAst<`hello; "world"`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'Identifier',
      name: 'hello',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'StringLiteral',
      value: 'world',
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`hello;;;"world"`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'Identifier',
      name: 'hello',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'StringLiteral',
      value: 'world',
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`hello  ; "world"`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'Identifier',
      name: 'hello',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'StringLiteral',
      value: 'world',
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`const hello = "world"`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'StringLiteral',
          value: 'world',
          data: { startLineNumber: 1, endLineNumber: 1 },
        },
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: null,
          data: { startLineNumber: 1, endLineNumber: 1 },
        },
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
    ],
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`\nconst \nhello\n = \n123;`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'NumericLiteral',
          value: '123',
          data: { startLineNumber: 5, endLineNumber: 5 },
        },
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: null,
          data: { startLineNumber: 3, endLineNumber: 3 },
        },
        data: { startLineNumber: 3, endLineNumber: 5 },
      },
    ],
    data: { startLineNumber: 2, endLineNumber: 5 },
  },
]);

expectType<ParseAst<`const`>>({
  type: 'ParsingError',
  message: 'Variable declaration list cannot be empty.',
  lineNumber: 1,
});

expectType<ParseAst<`const hello`>>({
  type: 'ParsingError',
  message: "'const' declarations must be initialized.",
  lineNumber: 1,
});

expectType<ParseAst<`const hello =`>>({
  type: 'ParsingError',
  message: 'Expression expected.',
  lineNumber: 1,
});

expectType<ParseAst<`const hello \n = ;`>>({
  type: 'ParsingError',
  message: 'Expression expected.',
  lineNumber: 2,
});

expectType<ParseAst<`const hello: `>>({
  type: 'ParsingError',
  message: 'Type expected.',
  lineNumber: 1,
});

expectType<ParseAst<`let hello = "world"`>>([
  {
    type: 'VariableDeclaration',
    kind: 'let',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'StringLiteral',
          value: 'world',
          data: { startLineNumber: 1, endLineNumber: 1 },
        },
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: null,
          data: { startLineNumber: 1, endLineNumber: 1 },
        },
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
    ],
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`\nlet \nhello\n = \n123;`>>([
  {
    type: 'VariableDeclaration',
    kind: 'let',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'NumericLiteral',
          value: '123',
          data: { startLineNumber: 5, endLineNumber: 5 },
        },
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: null,
          data: { startLineNumber: 3, endLineNumber: 3 },
        },
        data: { startLineNumber: 3, endLineNumber: 5 },
      },
    ],
    data: { startLineNumber: 2, endLineNumber: 5 },
  },
]);

expectType<ParseAst<`let`>>({
  type: 'ParsingError',
  message: 'Variable declaration list cannot be empty.',
  lineNumber: 1,
});

expectType<ParseAst<`let hello`>>([
  {
    type: 'VariableDeclaration',
    kind: 'let',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: null,
          data: { startLineNumber: 1, endLineNumber: 1 },
        },
        init: null,
        data: { startLineNumber: 1, endLineNumber: 1 },
      },
    ],
    data: { startLineNumber: 1, endLineNumber: 1 },
  },
]);

expectType<ParseAst<`let hello; \n\nlet hello;`>>({
  type: 'ParsingError',
  message: "Cannot redeclare block-scoped variable 'hello'.",
  lineNumber: 3,
});

expectType<ParseAst<`const hello = 1; \n\nconst hello = 2;`>>({
  type: 'ParsingError',
  message: "Cannot redeclare block-scoped variable 'hello'.",
  lineNumber: 3,
});

expectType<ParseAst<`let hello; \n\nconst hello = 1;`>>({
  type: 'ParsingError',
  message: "Cannot redeclare block-scoped variable 'hello'.",
  lineNumber: 3,
});

expectType<ParseAst<`let hello: number; if(a) { let hello; }`>>([
  {
    type: 'VariableDeclaration',
    kind: 'let',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: {
            type: 'TypeAnnotation',
            typeAnnotation: {
              type: 'NumberTypeAnnotation',
              data: { startLineNumber: 1, endLineNumber: 1 },
            },
            data: { startLineNumber: 1, endLineNumber: 1 },
          },
          data: { startLineNumber: 1, endLineNumber: 1 },
        },
        init: null,
        data: { startLineNumber: 1, endLineNumber: 1 },
      },
    ],
    data: { startLineNumber: 1, endLineNumber: 1 },
  },
  {
    type: 'IfStatement',
    test: {
      type: 'Identifier',
      name: 'a',
      typeAnnotation: null,
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    consequent: {
      type: 'BlockStatement',
      body: [
        {
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [
            {
              type: 'VariableDeclarator',
              id: {
                type: 'Identifier',
                name: 'hello',
                typeAnnotation: null,
                data: { startLineNumber: 1, endLineNumber: 1 },
              },
              init: null,
              data: { startLineNumber: 1, endLineNumber: 1 },
            },
          ],
          data: { startLineNumber: 1, endLineNumber: 1 },
        },
      ],
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: { startLineNumber: 1, endLineNumber: 1 },
  },
]);

expectType<ParseAst<`let hello: number`>>([
  {
    type: 'VariableDeclaration',
    kind: 'let',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: {
            type: 'TypeAnnotation',
            typeAnnotation: {
              type: 'NumberTypeAnnotation',
              data: { startLineNumber: 1, endLineNumber: 1 },
            },
            data: { startLineNumber: 1, endLineNumber: 1 },
          },
          data: { startLineNumber: 1, endLineNumber: 1 },
        },
        init: null,
        data: { startLineNumber: 1, endLineNumber: 1 },
      },
    ],
    data: { startLineNumber: 1, endLineNumber: 1 },
  },
]);

expectType<ParseAst<`let hello =`>>({
  type: 'ParsingError',
  message: 'Expression expected.',
  lineNumber: 1,
});

expectType<ParseAst<`let hello \n = ;`>>({
  type: 'ParsingError',
  message: 'Expression expected.',
  lineNumber: 2,
});

expectType<ParseAst<`let hello: `>>({
  type: 'ParsingError',
  message: 'Type expected.',
  lineNumber: 1,
});

expectType<ParseAst<`hello.`>>({
  type: 'ParsingError',
  message: 'Identifier expected.',
  lineNumber: 1,
});

expectType<ParseAst<`hello..world`>>({
  type: 'ParsingError',
  message: 'Identifier expected.',
  lineNumber: 1,
});

expectType<ParseAst<`\nhello."world"`>>({
  type: 'ParsingError',
  message: 'Identifier expected.',
  lineNumber: 2,
});

expectType<ParseAst<`hello.world`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: 'hello',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      property: {
        type: 'Identifier',
        name: 'world',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      computed: false,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`hello.world.foo`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'MemberExpression',
      object: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: null,
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        property: {
          type: 'Identifier',
          name: 'world',
          typeAnnotation: null,
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        computed: false,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      property: {
        type: 'Identifier',
        name: 'foo',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      computed: false,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`hello.\nworld.\nfoo`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'MemberExpression',
      object: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: null,
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        property: {
          type: 'Identifier',
          name: 'world',
          typeAnnotation: null,
          data: {
            startLineNumber: 2,
            endLineNumber: 2,
          },
        },
        computed: false,
        data: {
          startLineNumber: 1,
          endLineNumber: 2,
        },
      },
      property: {
        type: 'Identifier',
        name: 'foo',
        typeAnnotation: null,
        data: {
          startLineNumber: 3,
          endLineNumber: 3,
        },
      },
      computed: false,
      data: {
        startLineNumber: 1,
        endLineNumber: 3,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 3,
    },
  },
]);

expectType<ParseAst<`hello.\nworld..foo`>>({
  type: 'ParsingError',
  message: 'Identifier expected.',
  lineNumber: 2,
});

expectType<ParseAst<`hello.\nworld.`>>({
  type: 'ParsingError',
  message: 'Identifier expected.',
  lineNumber: 2,
});

expectType<ParseAst<`const hello = foo.bar;`>>([
  {
    type: 'VariableDeclaration',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: null,
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        init: {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: 'foo',
            typeAnnotation: null,
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          property: {
            type: 'Identifier',
            name: 'bar',
            typeAnnotation: null,
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          computed: false,
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
    ],
    kind: 'const',
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`hello()`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'hello',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      arguments: [],
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`\n\nhello(\n)`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'hello',
        typeAnnotation: null,
        data: {
          startLineNumber: 3,
          endLineNumber: 3,
        },
      },
      arguments: [],
      data: { startLineNumber: 3, endLineNumber: 4 },
    },
    data: {
      startLineNumber: 3,
      endLineNumber: 4,
    },
  },
]);

expectType<ParseAst<`hello(1)`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'hello',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      arguments: [
        {
          type: 'NumericLiteral',
          value: '1',
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`hello(1, "2")`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'hello',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      arguments: [
        {
          type: 'NumericLiteral',
          value: '1',
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        {
          type: 'StringLiteral',
          value: '2',
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`hello(1,\n null\n, true)`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'hello',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      arguments: [
        {
          type: 'NumericLiteral',
          value: '1',
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        {
          type: 'NullLiteral',
          data: {
            startLineNumber: 2,
            endLineNumber: 2,
          },
        },
        {
          type: 'BooleanLiteral',
          value: true,
          data: {
            startLineNumber: 3,
            endLineNumber: 3,
          },
        },
      ],
      data: { startLineNumber: 1, endLineNumber: 3 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 3,
    },
  },
]);

expectType<ParseAst<`hello.world(1)`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: null,
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        property: {
          type: 'Identifier',
          name: 'world',
          typeAnnotation: null,
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        computed: false,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      arguments: [
        {
          type: 'NumericLiteral',
          value: '1',
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`hello.world(foo(1))`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: null,
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        property: {
          type: 'Identifier',
          name: 'world',
          typeAnnotation: null,
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        computed: false,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      arguments: [
        {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'foo',
            typeAnnotation: null,
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          arguments: [
            {
              type: 'NumericLiteral',
              value: '1',
              data: {
                startLineNumber: 1,
                endLineNumber: 1,
              },
            },
          ],
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`foo(`>>({
  type: 'ParsingError',
  message: "')' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`foo(1 2`>>({
  type: 'ParsingError',
  message: "',' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`[\n1 2`>>({
  type: 'ParsingError',
  message: "',' expected.",
  lineNumber: 2,
});
expectType<ParseAst<`[`>>({
  type: 'ParsingError',
  message: "']' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`[1 2`>>({
  type: 'ParsingError',
  message: "',' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`[\n1 2`>>({
  type: 'ParsingError',
  message: "',' expected.",
  lineNumber: 2,
});

expectType<ParseAst<`[]`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'ArrayExpression',
      elements: [],
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`[1]`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'ArrayExpression',
      elements: [
        {
          type: 'NumericLiteral',
          value: '1',
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`[\n1]`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'ArrayExpression',
      elements: [
        {
          type: 'NumericLiteral',
          value: '1',
          data: {
            startLineNumber: 2,
            endLineNumber: 2,
          },
        },
      ],
      data: { startLineNumber: 1, endLineNumber: 2 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 2,
    },
  },
]);

expectType<ParseAst<`[1, "hello"]`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'ArrayExpression',
      elements: [
        {
          type: 'NumericLiteral',
          value: '1',
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        {
          type: 'StringLiteral',
          value: 'hello',
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`[1, [2]]`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'ArrayExpression',
      elements: [
        {
          type: 'NumericLiteral',
          value: '1',
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        {
          type: 'ArrayExpression',
          elements: [
            {
              type: 'NumericLiteral',
              value: '2',
              data: {
                startLineNumber: 1,
                endLineNumber: 1,
              },
            },
          ],
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`const array = [1]`>>([
  {
    type: 'VariableDeclaration',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: 'array',
          typeAnnotation: null,
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        init: {
          type: 'ArrayExpression',
          elements: [
            {
              type: 'NumericLiteral',
              value: '1',
              data: {
                startLineNumber: 1,
                endLineNumber: 1,
              },
            },
          ],
          data: { startLineNumber: 1, endLineNumber: 1 },
        },
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
    ],
    kind: 'const',
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`{`>>({
  type: 'ParsingError',
  message: "'}' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`{ hello`>>({
  type: 'ParsingError',
  message: "'}' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`{hello world`>>({
  type: 'ParsingError',
  message: "'}' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`{\n1 2`>>({
  type: 'ParsingError',
  message: "'}' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`{}`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'ObjectExpression',
      properties: [],
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`{hello: "world"}`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'ObjectExpression',
      properties: [
        {
          type: 'ObjectProperty',
          key: {
            type: 'Identifier',
            name: 'hello',
            typeAnnotation: null,
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          value: {
            type: 'StringLiteral',
            value: 'world',
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`{hello\n:\n"world"\n}`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'ObjectExpression',
      properties: [
        {
          type: 'ObjectProperty',
          key: {
            type: 'Identifier',
            name: 'hello',
            typeAnnotation: null,
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          value: {
            type: 'StringLiteral',
            value: 'world',
            data: {
              startLineNumber: 3,
              endLineNumber: 3,
            },
          },
          data: {
            startLineNumber: 1,
            endLineNumber: 3,
          },
        },
      ],
      data: { startLineNumber: 1, endLineNumber: 4 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 4,
    },
  },
]);

expectType<ParseAst<`{hello: "hello", foo: bar()}`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'ObjectExpression',
      properties: [
        {
          type: 'ObjectProperty',
          key: {
            type: 'Identifier',
            name: 'hello',
            typeAnnotation: null,
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          value: {
            type: 'StringLiteral',
            value: 'hello',
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        {
          type: 'ObjectProperty',
          key: {
            type: 'Identifier',
            name: 'foo',
            typeAnnotation: null,
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          value: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'bar',
              typeAnnotation: null,
              data: {
                startLineNumber: 1,
                endLineNumber: 1,
              },
            },
            arguments: [],
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`{hello: {}}`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'ObjectExpression',
      properties: [
        {
          type: 'ObjectProperty',
          key: {
            type: 'Identifier',
            name: 'hello',
            typeAnnotation: null,
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          value: {
            type: 'ObjectExpression',
            properties: [],
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: { startLineNumber: 1, endLineNumber: 1 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`const array = {hello: "world"}`>>([
  {
    type: 'VariableDeclaration',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: 'array',
          typeAnnotation: null,
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        init: {
          type: 'ObjectExpression',
          properties: [
            {
              type: 'ObjectProperty',
              key: {
                type: 'Identifier',
                name: 'hello',
                typeAnnotation: null,
                data: {
                  startLineNumber: 1,
                  endLineNumber: 1,
                },
              },
              value: {
                type: 'StringLiteral',
                value: 'world',
                data: {
                  startLineNumber: 1,
                  endLineNumber: 1,
                },
              },
              data: {
                startLineNumber: 1,
                endLineNumber: 1,
              },
            },
          ],
          data: { startLineNumber: 1, endLineNumber: 1 },
        },
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
    ],
    kind: 'const',
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`function foo() {}`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    params: [],
    body: {
      type: 'BlockStatement',
      body: [],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`function foo(a) {}`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    params: [
      {
        type: 'Identifier',
        name: 'a',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`function foo(a, b) {}`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    params: [
      {
        type: 'Identifier',
        name: 'a',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      {
        type: 'Identifier',
        name: 'b',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`function foo(a, b) { foo() }`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    params: [
      {
        type: 'Identifier',
        name: 'a',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      {
        type: 'Identifier',
        name: 'b',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'foo',
              typeAnnotation: null,
              data: {
                startLineNumber: 1,
                endLineNumber: 1,
              },
            },
            arguments: [],
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`function foo(a, b) { foo(); "bar"; }`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    params: [
      {
        type: 'Identifier',
        name: 'a',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      {
        type: 'Identifier',
        name: 'b',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'foo',
              typeAnnotation: null,
              data: {
                startLineNumber: 1,
                endLineNumber: 1,
              },
            },
            arguments: [],
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'StringLiteral',
            value: 'bar',
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`function foo(a, b) { function bar() {} }`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    params: [
      {
        type: 'Identifier',
        name: 'a',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      {
        type: 'Identifier',
        name: 'b',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'FunctionDeclaration',
          id: {
            type: 'Identifier',
            name: 'bar',
            typeAnnotation: null,
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          body: {
            type: 'BlockStatement',
            body: [],
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          params: [],
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`function`>>({
  type: 'ParsingError',
  message: 'Identifier expected.',
  lineNumber: 1,
});

expectType<ParseAst<`function foo`>>({
  type: 'ParsingError',
  message: "'(' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`function foo(`>>({
  type: 'ParsingError',
  message: "')' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`function foo()`>>({
  type: 'ParsingError',
  message: "'{' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`function foo()`>>({
  type: 'ParsingError',
  message: "'{' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`function foo() {`>>({
  type: 'ParsingError',
  message: "'}' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`function foo(a, ) {}`>>({
  type: 'ParsingError',
  message: 'Identifier expected.',
  lineNumber: 1,
});

expectType<ParseAst<`function foo(a b) {}`>>({
  type: 'ParsingError',
  message: "',' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`}`>>({
  type: 'ParsingError',
  message: 'Declaration or statement expected.',
  lineNumber: 1,
});

expectType<ParseAst<`function foo(a, b) { } foo()`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    params: [
      {
        type: 'Identifier',
        name: 'a',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      {
        type: 'Identifier',
        name: 'b',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'foo',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      arguments: [],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`function foo(a, b) {}; foo()`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    params: [
      {
        type: 'Identifier',
        name: 'a',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      {
        type: 'Identifier',
        name: 'b',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'foo',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      arguments: [],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`if (a) {}`>>([
  {
    type: 'IfStatement',
    test: {
      type: 'Identifier',
      name: 'a',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    consequent: {
      type: 'BlockStatement',
      body: [],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`if (foo()) {}`>>([
  {
    type: 'IfStatement',
    test: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'foo',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      arguments: [],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    consequent: {
      type: 'BlockStatement',
      body: [],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`if (foo()) { bar(); }`>>([
  {
    type: 'IfStatement',
    test: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'foo',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      arguments: [],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    consequent: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'bar',
              typeAnnotation: null,
              data: {
                startLineNumber: 1,
                endLineNumber: 1,
              },
            },
            arguments: [],
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`if (foo()) { bar(); } bazz()`>>([
  {
    type: 'IfStatement',
    test: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'foo',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      arguments: [],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    consequent: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'bar',
              typeAnnotation: null,
              data: {
                startLineNumber: 1,
                endLineNumber: 1,
              },
            },
            arguments: [],
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'bazz',
        typeAnnotation: null,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      arguments: [],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`if`>>({
  type: 'ParsingError',
  message: "'(' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`if (`>>({
  type: 'ParsingError',
  message: 'Expression expected.',
  lineNumber: 1,
});

expectType<ParseAst<`if ("foo"`>>({
  type: 'ParsingError',
  message: "')' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`if (123)`>>({
  type: 'ParsingError',
  message: "'{' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`if (true) {`>>({
  type: 'ParsingError',
  message: "'}' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`if () {`>>({
  type: 'ParsingError',
  message: 'Expression expected.',
  lineNumber: 1,
});

expectType<ParseAst<`return 123`>>({
  type: 'ParsingError',
  message: "A 'return' statement can only be used within a function body.",
  lineNumber: 1,
});

expectType<ParseAst<`if (a) { return 123 }`>>({
  type: 'ParsingError',
  message: "A 'return' statement can only be used within a function body.",
  lineNumber: 1,
});

expectType<ParseAst<`return;`>>({
  type: 'ParsingError',
  message: "A 'return' statement can only be used within a function body.",
  lineNumber: 1,
});

expectType<ParseAst<`function foo() { return 1 }`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    params: [],
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ReturnStatement',
          argument: {
            type: 'NumericLiteral',
            value: '1',
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`function foo() { return 1; }`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    params: [],
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ReturnStatement',
          argument: {
            type: 'NumericLiteral',
            value: '1',
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`function foo() { return; }`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    params: [],
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ReturnStatement',
          argument: null,
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
      ],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`function foo() { \nreturn\n }`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    params: [],
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ReturnStatement',
          argument: null,
          data: {
            startLineNumber: 2,
            endLineNumber: 2,
          },
        },
      ],
      data: {
        startLineNumber: 1,
        endLineNumber: 3,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 3,
    },
  },
]);

expectType<ParseAst<`const hello: string = "world"`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'StringLiteral',
          value: 'world',
          data: { startLineNumber: 1, endLineNumber: 1 },
        },
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: {
            type: 'TypeAnnotation',
            typeAnnotation: {
              type: 'StringTypeAnnotation',
              data: { startLineNumber: 1, endLineNumber: 1 },
            },
            data: { startLineNumber: 1, endLineNumber: 1 },
          },
          data: { startLineNumber: 1, endLineNumber: 1 },
        },
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
    ],
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`const \nhello: \nnumber = \n"world"`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'StringLiteral',
          value: 'world',
          data: { startLineNumber: 4, endLineNumber: 4 },
        },
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: {
            type: 'TypeAnnotation',
            typeAnnotation: {
              type: 'NumberTypeAnnotation',
              data: { startLineNumber: 3, endLineNumber: 3 },
            },
            data: { startLineNumber: 3, endLineNumber: 3 },
          },
          data: { startLineNumber: 2, endLineNumber: 2 },
        },
        data: {
          startLineNumber: 2,
          endLineNumber: 4,
        },
      },
    ],
    data: {
      startLineNumber: 1,
      endLineNumber: 4,
    },
  },
]);

expectType<ParseAst<`const \nhello: \nnull = \n"world"`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'StringLiteral',
          value: 'world',
          data: { startLineNumber: 4, endLineNumber: 4 },
        },
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: {
            type: 'TypeAnnotation',
            typeAnnotation: {
              type: 'NullLiteralTypeAnnotation',
              data: { startLineNumber: 3, endLineNumber: 3 },
            },
            data: { startLineNumber: 3, endLineNumber: 3 },
          },
          data: { startLineNumber: 2, endLineNumber: 2 },
        },
        data: {
          startLineNumber: 2,
          endLineNumber: 4,
        },
      },
    ],
    data: {
      startLineNumber: 1,
      endLineNumber: 4,
    },
  },
]);

expectType<ParseAst<`const \nhello: \nboolean = \n"world"`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'StringLiteral',
          value: 'world',
          data: { startLineNumber: 4, endLineNumber: 4 },
        },
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: {
            type: 'TypeAnnotation',
            typeAnnotation: {
              type: 'BooleanTypeAnnotation',
              data: { startLineNumber: 3, endLineNumber: 3 },
            },
            data: { startLineNumber: 3, endLineNumber: 3 },
          },
          data: { startLineNumber: 2, endLineNumber: 2 },
        },
        data: {
          startLineNumber: 2,
          endLineNumber: 4,
        },
      },
    ],
    data: {
      startLineNumber: 1,
      endLineNumber: 4,
    },
  },
]);

expectType<ParseAst<`const \nhello: \nany = \n"world"`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'StringLiteral',
          value: 'world',
          data: { startLineNumber: 4, endLineNumber: 4 },
        },
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: {
            type: 'TypeAnnotation',
            typeAnnotation: {
              type: 'AnyTypeAnnotation',
              data: { startLineNumber: 3, endLineNumber: 3 },
            },
            data: { startLineNumber: 3, endLineNumber: 3 },
          },
          data: { startLineNumber: 2, endLineNumber: 2 },
        },
        data: {
          startLineNumber: 2,
          endLineNumber: 4,
        },
      },
    ],
    data: {
      startLineNumber: 1,
      endLineNumber: 4,
    },
  },
]);

expectType<ParseAst<`const \nhello: \nFoo = \n"world"`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'StringLiteral',
          value: 'world',
          data: { startLineNumber: 4, endLineNumber: 4 },
        },
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: {
            type: 'TypeAnnotation',
            typeAnnotation: {
              type: 'GenericTypeAnnotation',
              id: 'Foo',
              data: { startLineNumber: 3, endLineNumber: 3 },
            },
            data: { startLineNumber: 3, endLineNumber: 3 },
          },
          data: { startLineNumber: 2, endLineNumber: 2 },
        },
        data: {
          startLineNumber: 2,
          endLineNumber: 4,
        },
      },
    ],
    data: {
      startLineNumber: 1,
      endLineNumber: 4,
    },
  },
]);

expectType<ParseAst<`function foo(a: string) {}`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    params: [
      {
        type: 'Identifier',
        name: 'a',
        typeAnnotation: {
          type: 'TypeAnnotation',
          typeAnnotation: {
            type: 'StringTypeAnnotation',
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [],
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);

expectType<ParseAst<`function\n foo\n(\na: number)\n {\n}`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 2,
        endLineNumber: 2,
      },
    },
    params: [
      {
        type: 'Identifier',
        name: 'a',
        typeAnnotation: {
          type: 'TypeAnnotation',
          typeAnnotation: {
            type: 'NumberTypeAnnotation',
            data: {
              startLineNumber: 4,
              endLineNumber: 4,
            },
          },
          data: {
            startLineNumber: 4,
            endLineNumber: 4,
          },
        },
        data: {
          startLineNumber: 4,
          endLineNumber: 4,
        },
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [],
      data: {
        startLineNumber: 5,
        endLineNumber: 6,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 6,
    },
  },
]);

expectType<ParseAst<`function\n foo\n(\na: null, \nb: boolean)\n {\n}`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
      typeAnnotation: null,
      data: {
        startLineNumber: 2,
        endLineNumber: 2,
      },
    },
    params: [
      {
        type: 'Identifier',
        name: 'a',
        typeAnnotation: {
          type: 'TypeAnnotation',
          typeAnnotation: {
            type: 'NullLiteralTypeAnnotation',
            data: {
              startLineNumber: 4,
              endLineNumber: 4,
            },
          },
          data: {
            startLineNumber: 4,
            endLineNumber: 4,
          },
        },
        data: {
          startLineNumber: 4,
          endLineNumber: 4,
        },
      },
      {
        type: 'Identifier',
        name: 'b',
        typeAnnotation: {
          type: 'TypeAnnotation',
          typeAnnotation: {
            type: 'BooleanTypeAnnotation',
            data: {
              startLineNumber: 5,
              endLineNumber: 5,
            },
          },
          data: {
            startLineNumber: 5,
            endLineNumber: 5,
          },
        },
        data: {
          startLineNumber: 5,
          endLineNumber: 5,
        },
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [],
      data: {
        startLineNumber: 6,
        endLineNumber: 7,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 7,
    },
  },
]);

expectType<ParseAst<`\n\nhello[world]`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: 'hello',
        typeAnnotation: null,
        data: {
          startLineNumber: 3,
          endLineNumber: 3,
        },
      },
      property: {
        type: 'Identifier',
        name: 'world',
        typeAnnotation: null,
        data: {
          startLineNumber: 3,
          endLineNumber: 3,
        },
      },
      computed: true,
      data: {
        startLineNumber: 3,
        endLineNumber: 3,
      },
    },
    data: {
      startLineNumber: 3,
      endLineNumber: 3,
    },
  },
]);

expectType<ParseAst<`hello[world()]["foo"]`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'MemberExpression',
      object: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: null,
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        property: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'world',
            typeAnnotation: null,
            data: {
              startLineNumber: 1,
              endLineNumber: 1,
            },
          },
          arguments: [],
          data: {
            startLineNumber: 1,
            endLineNumber: 1,
          },
        },
        computed: true,
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      property: {
        type: 'StringLiteral',
        value: 'foo',
        data: {
          startLineNumber: 1,
          endLineNumber: 1,
        },
      },
      computed: true,
      data: {
        startLineNumber: 1,
        endLineNumber: 1,
      },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 1,
    },
  },
]);