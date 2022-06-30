import type { Tokenize } from '../tokenize';
import type { Parse } from '../parse';
import type { Cast } from '../utils/generalUtils';

const expectType = <T>(value: T) => {};

type ParseAst<T extends string> = Tokenize<T> extends infer G
  ? Parse<Cast<G, Array<any>>>
  : never;

expectType<ParseAst<`hello`>>([
  {
    type: 'ExpressionStatement',
    expression: { type: 'Identifier', name: 'hello' },
  },
]);

expectType<ParseAst<`hello.world`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'MemberExpression',
      object: { type: 'Identifier', name: 'hello' },
      property: { type: 'Identifier', name: 'world' },
    },
  },
]);

expectType<ParseAst<`"hello".world`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'MemberExpression',
      object: { type: 'StringLiteral', value: 'hello' },
      property: { type: 'Identifier', name: 'world' },
    },
  },
]);

expectType<ParseAst<`null.world`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'MemberExpression',
      object: { type: 'NullLiteral' },
      property: { type: 'Identifier', name: 'world' },
    },
  },
]);

expectType<ParseAst<`"hello"()`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: { type: 'StringLiteral', value: 'hello' },
      arguments: [],
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
      },
      arguments: [],
    },
  },
]);

expectType<ParseAst<`hello()()`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'hello',
        },
        arguments: [],
      },
      arguments: [],
    },
  },
]);

expectType<ParseAst<`hello().world()`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'hello' },
          arguments: [],
        },
        property: {
          type: 'Identifier',
          name: 'world',
        },
      },
      arguments: [],
    },
  },
]);

expectType<ParseAst<`hello(world(1))`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'hello',
      },
      arguments: [
        {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'world' },
          arguments: [
            {
              type: 'NumericLiteral',
              value: '1',
            },
          ],
        },
      ],
    },
  },
]);

expectType<ParseAst<`hello("world"(1))`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'hello',
      },
      arguments: [
        {
          type: 'CallExpression',
          callee: { type: 'StringLiteral', value: 'world' },
          arguments: [
            {
              type: 'NumericLiteral',
              value: '1',
            },
          ],
        },
      ],
    },
  },
]);

expectType<ParseAst<`hello(1, true)`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'hello',
      },
      arguments: [
        { type: 'NumericLiteral', value: '1' },
        { type: 'BooleanLiteral', value: true },
      ],
    },
  },
]);

expectType<ParseAst<`hello.world(1, true)`>>([
  {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'hello',
        },
        property: {
          type: 'Identifier',
          name: 'world',
        },
      },
      arguments: [
        { type: 'NumericLiteral', value: '1' },
        { type: 'BooleanLiteral', value: true },
      ],
    },
  },
]);

expectType<ParseAst<`function foo() {}`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
    },
    params: [],
    body: {
      type: 'BlockStatement',
      body: [],
    },
  },
]);

expectType<ParseAst<`function foo(first, last) {}`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
    },
    params: [
      { type: 'Identifier', name: 'first' },
      { type: 'Identifier', name: 'last' },
    ],
    body: {
      type: 'BlockStatement',
      body: [],
    },
  },
]);

expectType<ParseAst<`function foo() { return 5 }`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
    },
    params: [],
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ReturnStatement',
          argument: {
            type: 'NumericLiteral',
            value: '5',
          },
        },
      ],
    },
  },
]);

expectType<ParseAst<`function foo() { return bar() }`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
    },
    params: [],
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ReturnStatement',
          argument: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'bar',
            },
            arguments: [],
          },
        },
      ],
    },
  },
]);

expectType<ParseAst<`function foo(first, last) { console.log(1) }`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
    },
    params: [
      { type: 'Identifier', name: 'first' },
      { type: 'Identifier', name: 'last' },
    ],
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'MemberExpression',
              object: { type: 'Identifier', name: 'console' },
              property: { type: 'Identifier', name: 'log' },
            },
            arguments: [
              {
                type: 'NumericLiteral',
                value: '1',
              },
            ],
          },
        },
      ],
    },
  },
]);

expectType<
  ParseAst<`
function foo(foo) {
  console.log(foo)

  function bar() {
    console.log(foo)
  }
}
`>
>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
    },
    params: [{ type: 'Identifier', name: 'foo' }],
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'MemberExpression',
              object: { type: 'Identifier', name: 'console' },
              property: { type: 'Identifier', name: 'log' },
            },
            arguments: [
              {
                type: 'Identifier',
                name: 'foo',
              },
            ],
          },
        },
        {
          type: 'FunctionDeclaration',
          id: { type: 'Identifier', name: 'bar' },
          params: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'MemberExpression',
                    object: { type: 'Identifier', name: 'console' },
                    property: { type: 'Identifier', name: 'log' },
                  },
                  arguments: [{ type: 'Identifier', name: 'foo' }],
                },
              },
            ],
          },
        },
      ],
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
        init: { type: 'StringLiteral', value: 'world' },
        id: { type: 'Identifier', name: 'hello' },
      },
    ],
  },
]);

expectType<ParseAst<`const hello = 123`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: { type: 'NumericLiteral', value: '123' },
        id: { type: 'Identifier', name: 'hello' },
      },
    ],
  },
]);

expectType<ParseAst<`const hello = [1, 2, 3]`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'ArrayExpression',
          elements: [
            { type: 'NumericLiteral', value: '1' },
            { type: 'NumericLiteral', value: '2' },
            { type: 'NumericLiteral', value: '3' },
          ],
        },
        id: { type: 'Identifier', name: 'hello' },
      },
    ],
  },
]);

expectType<ParseAst<`const hello = { hey: "ho" }`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'ObjectExpression',
          properties: [
            {
              type: 'ObjectProperty',
              key: { type: 'Identifier', name: 'hey' },
              value: { type: 'StringLiteral', value: 'ho' },
            },
          ],
        },
        id: { type: 'Identifier', name: 'hello' },
      },
    ],
  },
]);

expectType<ParseAst<`const hello = foo()`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'foo',
          },
          arguments: [],
        },
        id: { type: 'Identifier', name: 'hello' },
      },
    ],
  },
]);

expectType<ParseAst<`if (a) {}`>>([
  {
    type: 'IfStatement',
    test: {
      type: 'Identifier',
      name: 'a',
    },
    consequent: {
      type: 'BlockStatement',
      body: [],
    },
  },
]);

expectType<ParseAst<`if ("a") {}`>>([
  {
    type: 'IfStatement',
    test: {
      type: 'StringLiteral',
      value: 'a',
    },
    consequent: {
      type: 'BlockStatement',
      body: [],
    },
  },
]);

expectType<ParseAst<`if (a()) {}`>>([
  {
    type: 'IfStatement',
    test: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'a',
      },
      arguments: [],
    },
    consequent: {
      type: 'BlockStatement',
      body: [],
    },
  },
]);

expectType<ParseAst<`if (a) { console.log() }`>>([
  {
    type: 'IfStatement',
    test: {
      type: 'Identifier',
      name: 'a',
    },
    consequent: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'console',
              },
              property: {
                type: 'Identifier',
                name: 'log',
              },
            },
            arguments: [],
          },
        },
      ],
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
        init: { type: 'StringLiteral', value: 'world' },
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: {
            type: 'TypeAnnotation',
            typeAnnotation: { type: 'StringTypeAnnotation' },
          },
        },
      },
    ],
  },
]);

expectType<ParseAst<`const hello: number = "world"`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: { type: 'StringLiteral', value: 'world' },
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: {
            type: 'TypeAnnotation',
            typeAnnotation: { type: 'NumberTypeAnnotation' },
          },
        },
      },
    ],
  },
]);

expectType<ParseAst<`const hello: boolean = true`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: { type: 'BooleanLiteral', value: true },
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: {
            type: 'TypeAnnotation',
            typeAnnotation: { type: 'BooleanTypeAnnotation' },
          },
        },
      },
    ],
  },
]);

expectType<ParseAst<`const hello: null = "world"`>>([
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: { type: 'StringLiteral', value: 'world' },
        id: {
          type: 'Identifier',
          name: 'hello',
          typeAnnotation: {
            type: 'TypeAnnotation',
            typeAnnotation: { type: 'NullLiteralTypeAnnotation' },
          },
        },
      },
    ],
  },
]);

expectType<ParseAst<`function foo(bar: string) {}`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
    },
    params: [
      {
        type: 'Identifier',
        name: 'bar',
        typeAnnotation: {
          type: 'TypeAnnotation',
          typeAnnotation: {
            type: 'StringTypeAnnotation',
          },
        },
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [],
    },
  },
]);

expectType<ParseAst<`function foo(bar: boolean) {}`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
    },
    params: [
      {
        type: 'Identifier',
        name: 'bar',
        typeAnnotation: {
          type: 'TypeAnnotation',
          typeAnnotation: {
            type: 'BooleanTypeAnnotation',
          },
        },
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [],
    },
  },
]);

expectType<ParseAst<`function foo(bar: number) {}`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
    },
    params: [
      {
        type: 'Identifier',
        name: 'bar',
        typeAnnotation: {
          type: 'TypeAnnotation',
          typeAnnotation: {
            type: 'NumberTypeAnnotation',
          },
        },
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [],
    },
  },
]);

expectType<ParseAst<`function foo(bar: string, baz: null) {}`>>([
  {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: 'foo',
    },
    params: [
      {
        type: 'Identifier',
        name: 'bar',
        typeAnnotation: {
          type: 'TypeAnnotation',
          typeAnnotation: {
            type: 'StringTypeAnnotation',
          },
        },
      },
      {
        type: 'Identifier',
        name: 'baz',
        typeAnnotation: {
          type: 'TypeAnnotation',
          typeAnnotation: {
            type: 'NullLiteralTypeAnnotation',
          },
        },
      },
    ],
    body: {
      type: 'BlockStatement',
      body: [],
    },
  },
]);
