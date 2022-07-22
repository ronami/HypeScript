import type { Parse } from '.';
import type { Tokenize, Token } from '../Tokenizer';
import { expectType } from '../TestUtils';

type ParseWrapper<Input extends string> =
  Tokenize<Input> extends infer TokenList
    ? TokenList extends Array<Token<any>>
      ? Parse<TokenList>
      : never
    : never;

expectType<ParseWrapper<`hello`>>([
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

expectType<ParseWrapper<`"hello"`>>([
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

expectType<ParseWrapper<`123`>>([
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

expectType<ParseWrapper<`true`>>([
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

expectType<ParseWrapper<`\nfalse`>>([
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

expectType<ParseWrapper<`null`>>([
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

expectType<ParseWrapper<`\n\nnull`>>([
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

expectType<ParseWrapper<`hello world`>>({
  type: 'ParsingError',
  message: "';' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`hello "world"`>>({
  type: 'ParsingError',
  message: "';' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`function foo () { hello "world" }`>>({
  type: 'ParsingError',
  message: "';' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`hello\n "world"`>>([
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

expectType<ParseWrapper<`hello; "world"`>>([
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

expectType<ParseWrapper<`hello;;;"world"`>>([
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

expectType<ParseWrapper<`hello  ; "world"`>>([
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

expectType<ParseWrapper<`const hello = "world"`>>([
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

expectType<ParseWrapper<`\nconst \nhello\n = \n123;`>>([
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

expectType<ParseWrapper<`const`>>({
  type: 'ParsingError',
  message: 'Variable declaration list cannot be empty.',
  lineNumber: 1,
});

expectType<ParseWrapper<`const hello`>>({
  type: 'ParsingError',
  message: "'const' declarations must be initialized.",
  lineNumber: 1,
});

expectType<ParseWrapper<`const hello =`>>({
  type: 'ParsingError',
  message: 'Expression expected.',
  lineNumber: 1,
});

expectType<ParseWrapper<`const hello \n = ;`>>({
  type: 'ParsingError',
  message: 'Expression expected.',
  lineNumber: 2,
});

expectType<ParseWrapper<`const hello: `>>({
  type: 'ParsingError',
  message: 'Type expected.',
  lineNumber: 1,
});

expectType<ParseWrapper<`let hello = "world"`>>([
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

expectType<ParseWrapper<`\nlet \nhello\n = \n123;`>>([
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

expectType<ParseWrapper<`let`>>({
  type: 'ParsingError',
  message: 'Variable declaration list cannot be empty.',
  lineNumber: 1,
});

expectType<ParseWrapper<`let hello = 1; \n\nlet hello = 2;`>>({
  type: 'ParsingError',
  message: "Cannot redeclare block-scoped variable 'hello'.",
  lineNumber: 3,
});

expectType<ParseWrapper<`const hello = 1; \n\nconst hello = 2;`>>({
  type: 'ParsingError',
  message: "Cannot redeclare block-scoped variable 'hello'.",
  lineNumber: 3,
});

expectType<ParseWrapper<`let hello = 1; \n\nconst hello = 1;`>>({
  type: 'ParsingError',
  message: "Cannot redeclare block-scoped variable 'hello'.",
  lineNumber: 3,
});

expectType<ParseWrapper<`let hello: number = 1; if(a) { let hello = 2; }`>>([
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
        init: {
          type: 'NumericLiteral',
          value: '1',
          data: { startLineNumber: 1, endLineNumber: 1 },
        },
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
              init: {
                type: 'NumericLiteral',
                value: '2',
                data: { startLineNumber: 1, endLineNumber: 1 },
              },
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

expectType<ParseWrapper<`let hello: number = 1;`>>([
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
        init: {
          type: 'NumericLiteral',
          value: '1',
          data: { startLineNumber: 1, endLineNumber: 1 },
        },
        data: { startLineNumber: 1, endLineNumber: 1 },
      },
    ],
    data: { startLineNumber: 1, endLineNumber: 1 },
  },
]);

expectType<ParseWrapper<`let hello =`>>({
  type: 'ParsingError',
  message: 'Expression expected.',
  lineNumber: 1,
});

expectType<ParseWrapper<`let hello \n = ;`>>({
  type: 'ParsingError',
  message: 'Expression expected.',
  lineNumber: 2,
});

expectType<ParseWrapper<`let hello: `>>({
  type: 'ParsingError',
  message: 'Type expected.',
  lineNumber: 1,
});

expectType<ParseWrapper<`hello.`>>({
  type: 'ParsingError',
  message: 'Identifier expected.',
  lineNumber: 1,
});

expectType<ParseWrapper<`hello..world`>>({
  type: 'ParsingError',
  message: 'Identifier expected.',
  lineNumber: 1,
});

expectType<ParseWrapper<`\nhello."world"`>>({
  type: 'ParsingError',
  message: 'Identifier expected.',
  lineNumber: 2,
});

expectType<ParseWrapper<`hello.world`>>([
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

expectType<ParseWrapper<`hello.world.foo`>>([
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

expectType<ParseWrapper<`hello.\nworld.\nfoo`>>([
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

expectType<ParseWrapper<`hello.\nworld..foo`>>({
  type: 'ParsingError',
  message: 'Identifier expected.',
  lineNumber: 2,
});

expectType<ParseWrapper<`hello.\nworld.`>>({
  type: 'ParsingError',
  message: 'Identifier expected.',
  lineNumber: 2,
});

expectType<ParseWrapper<`const hello = foo.bar;`>>([
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

expectType<ParseWrapper<`hello()`>>([
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

expectType<ParseWrapper<`\n\nhello(\n)`>>([
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

expectType<ParseWrapper<`hello(1)`>>([
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

expectType<ParseWrapper<`hello(1, "2")`>>([
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

expectType<ParseWrapper<`hello(1,\n null\n, true)`>>([
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

expectType<ParseWrapper<`hello.world(1)`>>([
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

expectType<ParseWrapper<`hello.world(foo(1))`>>([
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

expectType<ParseWrapper<`foo(`>>({
  type: 'ParsingError',
  message: "')' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`foo(1 2`>>({
  type: 'ParsingError',
  message: "',' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`[\n1 2`>>({
  type: 'ParsingError',
  message: "',' expected.",
  lineNumber: 2,
});
expectType<ParseWrapper<`[`>>({
  type: 'ParsingError',
  message: "']' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`[1 2`>>({
  type: 'ParsingError',
  message: "',' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`[\n1 2`>>({
  type: 'ParsingError',
  message: "',' expected.",
  lineNumber: 2,
});

expectType<ParseWrapper<`[]`>>([
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

expectType<ParseWrapper<`[1]`>>([
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

expectType<ParseWrapper<`[\n1]`>>([
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

expectType<ParseWrapper<`[1, "hello"]`>>([
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

expectType<ParseWrapper<`[1, [2]]`>>([
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

expectType<ParseWrapper<`const array = [1]`>>([
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

expectType<ParseWrapper<`{`>>({
  type: 'ParsingError',
  message: "'}' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`{ hello`>>({
  type: 'ParsingError',
  message: "'}' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`{hello world`>>({
  type: 'ParsingError',
  message: "'}' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`{\n1 2`>>({
  type: 'ParsingError',
  message: "'}' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`{}`>>([
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

expectType<ParseWrapper<`{hello: "world"}`>>([
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

expectType<ParseWrapper<`{hello\n:\n"world"\n}`>>([
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

expectType<ParseWrapper<`{hello: "hello", foo: bar()}`>>([
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

expectType<ParseWrapper<`{hello: {}}`>>([
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

expectType<ParseWrapper<`const array = {hello: "world"}`>>([
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

expectType<ParseWrapper<`function foo() {}`>>([
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

expectType<ParseWrapper<`function foo(a) {}`>>([
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

expectType<ParseWrapper<`function foo(a, b) {}`>>([
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

expectType<ParseWrapper<`function foo(a, b) { foo() }`>>([
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

expectType<ParseWrapper<`function foo(a, b) { foo(); "bar"; }`>>([
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

expectType<ParseWrapper<`function foo(a, b) { function bar() {} }`>>([
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

expectType<ParseWrapper<`function`>>({
  type: 'ParsingError',
  message: 'Identifier expected.',
  lineNumber: 1,
});

expectType<ParseWrapper<`function foo`>>({
  type: 'ParsingError',
  message: "'(' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`function foo(`>>({
  type: 'ParsingError',
  message: "')' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`function foo()`>>({
  type: 'ParsingError',
  message: "'{' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`function foo()`>>({
  type: 'ParsingError',
  message: "'{' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`function foo() {`>>({
  type: 'ParsingError',
  message: "'}' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`function foo(a, ) {}`>>({
  type: 'ParsingError',
  message: 'Identifier expected.',
  lineNumber: 1,
});

expectType<ParseWrapper<`function foo(a b) {}`>>({
  type: 'ParsingError',
  message: "',' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`}`>>({
  type: 'ParsingError',
  message: 'Declaration or statement expected.',
  lineNumber: 1,
});

expectType<ParseWrapper<`function foo(a, b) { } foo()`>>([
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

expectType<ParseWrapper<`function foo(a, b) {}; foo()`>>([
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

expectType<ParseWrapper<`if (a) {}`>>([
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

expectType<ParseWrapper<`if (foo()) {}`>>([
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

expectType<ParseWrapper<`if (foo()) { bar(); }`>>([
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

expectType<ParseWrapper<`if (foo()) { bar(); } bazz()`>>([
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

expectType<ParseWrapper<`if`>>({
  type: 'ParsingError',
  message: "'(' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`if (`>>({
  type: 'ParsingError',
  message: 'Expression expected.',
  lineNumber: 1,
});

expectType<ParseWrapper<`if ("foo"`>>({
  type: 'ParsingError',
  message: "')' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`if (123)`>>({
  type: 'ParsingError',
  message: "'{' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`if (true) {`>>({
  type: 'ParsingError',
  message: "'}' expected.",
  lineNumber: 1,
});

expectType<ParseWrapper<`if () {`>>({
  type: 'ParsingError',
  message: 'Expression expected.',
  lineNumber: 1,
});

expectType<ParseWrapper<`return 123`>>({
  type: 'ParsingError',
  message: "A 'return' statement can only be used within a function body.",
  lineNumber: 1,
});

expectType<ParseWrapper<`if (a) { return 123 }`>>({
  type: 'ParsingError',
  message: "A 'return' statement can only be used within a function body.",
  lineNumber: 1,
});

expectType<ParseWrapper<`return;`>>({
  type: 'ParsingError',
  message: "A 'return' statement can only be used within a function body.",
  lineNumber: 1,
});

expectType<ParseWrapper<`function foo() { return 1 }`>>([
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

expectType<ParseWrapper<`function foo() { return 1; }`>>([
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

expectType<ParseWrapper<`function foo() { return; }`>>([
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

expectType<ParseWrapper<`function foo() { \nreturn\n }`>>([
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

expectType<ParseWrapper<`const hello: string = "world"`>>([
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

expectType<ParseWrapper<`const \nhello: \nnumber = \n"world"`>>([
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

expectType<ParseWrapper<`const \nhello: \nnull = \n"world"`>>([
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

expectType<ParseWrapper<`const \nhello: \nboolean = \n"world"`>>([
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

expectType<ParseWrapper<`const \nhello: \nany = \n"world"`>>([
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

expectType<ParseWrapper<`const \nhello: \nFoo = \n"world"`>>([
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

expectType<ParseWrapper<`function foo(a: string) {}`>>([
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

expectType<ParseWrapper<`function\n foo\n(\na: number)\n {\n}`>>([
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

expectType<ParseWrapper<`function\n foo\n(\na: null, \nb: boolean)\n {\n}`>>([
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

expectType<ParseWrapper<`\n\nhello[world]`>>([
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

expectType<ParseWrapper<`hello[world()]["foo"]`>>([
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
