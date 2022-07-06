import type { Tokenize } from '../tokenizer';
import type { Parse } from '../parser';
import type { Cast } from '../utils/generalUtils';
import { expectType } from './utils';

type ParseAst<T extends string> = Tokenize<T> extends infer G
  ? Parse<Cast<G, Array<any>>>
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
  type: 'SyntaxError',
  message: "';' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`hello "world"`>>({
  type: 'SyntaxError',
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
  type: 'SyntaxError',
  message: 'Variable declaration list cannot be empty.',
  lineNumber: 1,
});

expectType<ParseAst<`const hello`>>({
  type: 'SyntaxError',
  message: "'const' declarations must be initialized.",
  lineNumber: 1,
});

expectType<ParseAst<`const hello =`>>({
  type: 'SyntaxError',
  message: 'Expression expected.',
  lineNumber: 1,
});

expectType<ParseAst<`const hello \n = ;`>>({
  type: 'SyntaxError',
  message: 'Expression expected.',
  lineNumber: 2,
});

expectType<ParseAst<`hello.`>>({
  type: 'SyntaxError',
  message: 'Identifier expected.',
  lineNumber: 1,
});

expectType<ParseAst<`hello..world`>>({
  type: 'SyntaxError',
  message: 'Identifier expected.',
  lineNumber: 1,
});

expectType<ParseAst<`\nhello."world"`>>({
  type: 'SyntaxError',
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
  type: 'SyntaxError',
  message: 'Identifier expected.',
  lineNumber: 2,
});

expectType<ParseAst<`hello.\nworld.`>>({
  type: 'SyntaxError',
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

expectType<ParseAst<`hello(\n)`>>([
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
      data: { startLineNumber: 1, endLineNumber: 2 },
    },
    data: {
      startLineNumber: 1,
      endLineNumber: 2,
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
  type: 'SyntaxError',
  message: "Parsing error: ')' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`foo(1 2`>>({
  type: 'SyntaxError',
  message: "Parsing error: ',' expected.",
  lineNumber: 1,
});

expectType<ParseAst<`foo(\n1 2`>>({
  type: 'SyntaxError',
  message: "Parsing error: ',' expected.",
  lineNumber: 2,
});

// expectType<ParseAst<`hello.world`>>([
//   {
//     type: 'ExpressionStatement',
//     expression: {
//       type: 'MemberExpression',
//       object: { type: 'Identifier', name: 'hello' },
//       property: { type: 'Identifier', name: 'world' },
//     },
//   },
// ]);

// expectType<ParseAst<`"hello".world`>>([
//   {
//     type: 'ExpressionStatement',
//     expression: {
//       type: 'MemberExpression',
//       object: { type: 'StringLiteral', value: 'hello' },
//       property: { type: 'Identifier', name: 'world' },
//     },
//   },
// ]);

// expectType<ParseAst<`null.world`>>([
//   {
//     type: 'ExpressionStatement',
//     expression: {
//       type: 'MemberExpression',
//       object: { type: 'NullLiteral' },
//       property: { type: 'Identifier', name: 'world' },
//     },
//   },
// ]);

// expectType<ParseAst<`"hello"()`>>([
//   {
//     type: 'ExpressionStatement',
//     expression: {
//       type: 'CallExpression',
//       callee: { type: 'StringLiteral', value: 'hello' },
//       arguments: [],
//     },
//   },
// ]);

// expectType<ParseAst<`hello()`>>([
//   {
//     type: 'ExpressionStatement',
//     expression: {
//       type: 'CallExpression',
//       callee: {
//         type: 'Identifier',
//         name: 'hello',
//       },
//       arguments: [],
//     },
//   },
// ]);

// expectType<ParseAst<`hello()()`>>([
//   {
//     type: 'ExpressionStatement',
//     expression: {
//       type: 'CallExpression',
//       callee: {
//         type: 'CallExpression',
//         callee: {
//           type: 'Identifier',
//           name: 'hello',
//         },
//         arguments: [],
//       },
//       arguments: [],
//     },
//   },
// ]);

// expectType<ParseAst<`hello().world()`>>([
//   {
//     type: 'ExpressionStatement',
//     expression: {
//       type: 'CallExpression',
//       callee: {
//         type: 'MemberExpression',
//         object: {
//           type: 'CallExpression',
//           callee: { type: 'Identifier', name: 'hello' },
//           arguments: [],
//         },
//         property: {
//           type: 'Identifier',
//           name: 'world',
//         },
//       },
//       arguments: [],
//     },
//   },
// ]);

// expectType<ParseAst<`hello(world(1))`>>([
//   {
//     type: 'ExpressionStatement',
//     expression: {
//       type: 'CallExpression',
//       callee: {
//         type: 'Identifier',
//         name: 'hello',
//       },
//       arguments: [
//         {
//           type: 'CallExpression',
//           callee: { type: 'Identifier', name: 'world' },
//           arguments: [
//             {
//               type: 'NumericLiteral',
//               value: '1',
//             },
//           ],
//         },
//       ],
//     },
//   },
// ]);

// expectType<ParseAst<`hello("world"(1))`>>([
//   {
//     type: 'ExpressionStatement',
//     expression: {
//       type: 'CallExpression',
//       callee: {
//         type: 'Identifier',
//         name: 'hello',
//       },
//       arguments: [
//         {
//           type: 'CallExpression',
//           callee: { type: 'StringLiteral', value: 'world' },
//           arguments: [
//             {
//               type: 'NumericLiteral',
//               value: '1',
//             },
//           ],
//         },
//       ],
//     },
//   },
// ]);

// expectType<ParseAst<`hello(1, true)`>>([
//   {
//     type: 'ExpressionStatement',
//     expression: {
//       type: 'CallExpression',
//       callee: {
//         type: 'Identifier',
//         name: 'hello',
//       },
//       arguments: [
//         { type: 'NumericLiteral', value: '1' },
//         { type: 'BooleanLiteral', value: true },
//       ],
//     },
//   },
// ]);

// expectType<ParseAst<`hello.world(1, true)`>>([
//   {
//     type: 'ExpressionStatement',
//     expression: {
//       type: 'CallExpression',
//       callee: {
//         type: 'MemberExpression',
//         object: {
//           type: 'Identifier',
//           name: 'hello',
//         },
//         property: {
//           type: 'Identifier',
//           name: 'world',
//         },
//       },
//       arguments: [
//         { type: 'NumericLiteral', value: '1' },
//         { type: 'BooleanLiteral', value: true },
//       ],
//     },
//   },
// ]);

// expectType<ParseAst<`function foo() {}`>>([
//   {
//     type: 'FunctionDeclaration',
//     id: {
//       type: 'Identifier',
//       name: 'foo',
//     },
//     params: [],
//     body: {
//       type: 'BlockStatement',
//       body: [],
//     },
//   },
// ]);

// expectType<ParseAst<`function foo(first, last) {}`>>([
//   {
//     type: 'FunctionDeclaration',
//     id: {
//       type: 'Identifier',
//       name: 'foo',
//     },
//     params: [
//       { type: 'Identifier', name: 'first' },
//       { type: 'Identifier', name: 'last' },
//     ],
//     body: {
//       type: 'BlockStatement',
//       body: [],
//     },
//   },
// ]);

// expectType<ParseAst<`function foo() { return 5 }`>>([
//   {
//     type: 'FunctionDeclaration',
//     id: {
//       type: 'Identifier',
//       name: 'foo',
//     },
//     params: [],
//     body: {
//       type: 'BlockStatement',
//       body: [
//         {
//           type: 'ReturnStatement',
//           argument: {
//             type: 'NumericLiteral',
//             value: '5',
//           },
//         },
//       ],
//     },
//   },
// ]);

// expectType<ParseAst<`function foo() { return bar() }`>>([
//   {
//     type: 'FunctionDeclaration',
//     id: {
//       type: 'Identifier',
//       name: 'foo',
//     },
//     params: [],
//     body: {
//       type: 'BlockStatement',
//       body: [
//         {
//           type: 'ReturnStatement',
//           argument: {
//             type: 'CallExpression',
//             callee: {
//               type: 'Identifier',
//               name: 'bar',
//             },
//             arguments: [],
//           },
//         },
//       ],
//     },
//   },
// ]);

// expectType<ParseAst<`function foo(first, last) { console.log(1) }`>>([
//   {
//     type: 'FunctionDeclaration',
//     id: {
//       type: 'Identifier',
//       name: 'foo',
//     },
//     params: [
//       { type: 'Identifier', name: 'first' },
//       { type: 'Identifier', name: 'last' },
//     ],
//     body: {
//       type: 'BlockStatement',
//       body: [
//         {
//           type: 'ExpressionStatement',
//           expression: {
//             type: 'CallExpression',
//             callee: {
//               type: 'MemberExpression',
//               object: { type: 'Identifier', name: 'console' },
//               property: { type: 'Identifier', name: 'log' },
//             },
//             arguments: [
//               {
//                 type: 'NumericLiteral',
//                 value: '1',
//               },
//             ],
//           },
//         },
//       ],
//     },
//   },
// ]);

// expectType<
//   ParseAst<`
// function foo(foo) {
//   console.log(foo)

//   function bar() {
//     console.log(foo)
//   }
// }
// `>
// >([
//   {
//     type: 'FunctionDeclaration',
//     id: {
//       type: 'Identifier',
//       name: 'foo',
//     },
//     params: [{ type: 'Identifier', name: 'foo' }],
//     body: {
//       type: 'BlockStatement',
//       body: [
//         {
//           type: 'ExpressionStatement',
//           expression: {
//             type: 'CallExpression',
//             callee: {
//               type: 'MemberExpression',
//               object: { type: 'Identifier', name: 'console' },
//               property: { type: 'Identifier', name: 'log' },
//             },
//             arguments: [
//               {
//                 type: 'Identifier',
//                 name: 'foo',
//               },
//             ],
//           },
//         },
//         {
//           type: 'FunctionDeclaration',
//           id: { type: 'Identifier', name: 'bar' },
//           params: [],
//           body: {
//             type: 'BlockStatement',
//             body: [
//               {
//                 type: 'ExpressionStatement',
//                 expression: {
//                   type: 'CallExpression',
//                   callee: {
//                     type: 'MemberExpression',
//                     object: { type: 'Identifier', name: 'console' },
//                     property: { type: 'Identifier', name: 'log' },
//                   },
//                   arguments: [{ type: 'Identifier', name: 'foo' }],
//                 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   },
// ]);

// expectType<ParseAst<`const hello = [1, 2, 3]`>>([
//   {
//     type: 'VariableDeclaration',
//     kind: 'const',
//     declarations: [
//       {
//         type: 'VariableDeclarator',
//         init: {
//           type: 'ArrayExpression',
//           elements: [
//             { type: 'NumericLiteral', value: '1' },
//             { type: 'NumericLiteral', value: '2' },
//             { type: 'NumericLiteral', value: '3' },
//           ],
//         },
//         id: { type: 'Identifier', name: 'hello' },
//       },
//     ],
//   },
// ]);

// expectType<ParseAst<`const hello = { hey: "ho" }`>>([
//   {
//     type: 'VariableDeclaration',
//     kind: 'const',
//     declarations: [
//       {
//         type: 'VariableDeclarator',
//         init: {
//           type: 'ObjectExpression',
//           properties: [
//             {
//               type: 'ObjectProperty',
//               key: { type: 'Identifier', name: 'hey' },
//               value: { type: 'StringLiteral', value: 'ho' },
//             },
//           ],
//         },
//         id: { type: 'Identifier', name: 'hello' },
//       },
//     ],
//   },
// ]);

// expectType<ParseAst<`const hello = foo()`>>([
//   {
//     type: 'VariableDeclaration',
//     kind: 'const',
//     declarations: [
//       {
//         type: 'VariableDeclarator',
//         init: {
//           type: 'CallExpression',
//           callee: {
//             type: 'Identifier',
//             name: 'foo',
//           },
//           arguments: [],
//         },
//         id: { type: 'Identifier', name: 'hello' },
//       },
//     ],
//   },
// ]);

// expectType<ParseAst<`if (a) {}`>>([
//   {
//     type: 'IfStatement',
//     test: {
//       type: 'Identifier',
//       name: 'a',
//     },
//     consequent: {
//       type: 'BlockStatement',
//       body: [],
//     },
//   },
// ]);

// expectType<ParseAst<`if ("a") {}`>>([
//   {
//     type: 'IfStatement',
//     test: {
//       type: 'StringLiteral',
//       value: 'a',
//     },
//     consequent: {
//       type: 'BlockStatement',
//       body: [],
//     },
//   },
// ]);

// expectType<ParseAst<`if (a()) {}`>>([
//   {
//     type: 'IfStatement',
//     test: {
//       type: 'CallExpression',
//       callee: {
//         type: 'Identifier',
//         name: 'a',
//       },
//       arguments: [],
//     },
//     consequent: {
//       type: 'BlockStatement',
//       body: [],
//     },
//   },
// ]);

// expectType<ParseAst<`if (a) { console.log() }`>>([
//   {
//     type: 'IfStatement',
//     test: {
//       type: 'Identifier',
//       name: 'a',
//     },
//     consequent: {
//       type: 'BlockStatement',
//       body: [
//         {
//           type: 'ExpressionStatement',
//           expression: {
//             type: 'CallExpression',
//             callee: {
//               type: 'MemberExpression',
//               object: {
//                 type: 'Identifier',
//                 name: 'console',
//               },
//               property: {
//                 type: 'Identifier',
//                 name: 'log',
//               },
//             },
//             arguments: [],
//           },
//         },
//       ],
//     },
//   },
// ]);

// expectType<ParseAst<`const hello: string = "world"`>>([
//   {
//     type: 'VariableDeclaration',
//     kind: 'const',
//     declarations: [
//       {
//         type: 'VariableDeclarator',
//         init: { type: 'StringLiteral', value: 'world' },
//         id: {
//           type: 'Identifier',
//           name: 'hello',
//           typeAnnotation: {
//             type: 'TypeAnnotation',
//             typeAnnotation: { type: 'StringTypeAnnotation' },
//           },
//         },
//       },
//     ],
//   },
// ]);

// expectType<ParseAst<`const hello: number = "world"`>>([
//   {
//     type: 'VariableDeclaration',
//     kind: 'const',
//     declarations: [
//       {
//         type: 'VariableDeclarator',
//         init: { type: 'StringLiteral', value: 'world' },
//         id: {
//           type: 'Identifier',
//           name: 'hello',
//           typeAnnotation: {
//             type: 'TypeAnnotation',
//             typeAnnotation: { type: 'NumberTypeAnnotation' },
//           },
//         },
//       },
//     ],
//   },
// ]);

// expectType<ParseAst<`const hello: boolean = true`>>([
//   {
//     type: 'VariableDeclaration',
//     kind: 'const',
//     declarations: [
//       {
//         type: 'VariableDeclarator',
//         init: { type: 'BooleanLiteral', value: true },
//         id: {
//           type: 'Identifier',
//           name: 'hello',
//           typeAnnotation: {
//             type: 'TypeAnnotation',
//             typeAnnotation: { type: 'BooleanTypeAnnotation' },
//           },
//         },
//       },
//     ],
//   },
// ]);

// expectType<ParseAst<`const hello: null = "world"`>>([
//   {
//     type: 'VariableDeclaration',
//     kind: 'const',
//     declarations: [
//       {
//         type: 'VariableDeclarator',
//         init: { type: 'StringLiteral', value: 'world' },
//         id: {
//           type: 'Identifier',
//           name: 'hello',
//           typeAnnotation: {
//             type: 'TypeAnnotation',
//             typeAnnotation: { type: 'NullLiteralTypeAnnotation' },
//           },
//         },
//       },
//     ],
//   },
// ]);

// expectType<ParseAst<`function foo(bar: string) {}`>>([
//   {
//     type: 'FunctionDeclaration',
//     id: {
//       type: 'Identifier',
//       name: 'foo',
//     },
//     params: [
//       {
//         type: 'Identifier',
//         name: 'bar',
//         typeAnnotation: {
//           type: 'TypeAnnotation',
//           typeAnnotation: {
//             type: 'StringTypeAnnotation',
//           },
//         },
//       },
//     ],
//     body: {
//       type: 'BlockStatement',
//       body: [],
//     },
//   },
// ]);

// expectType<ParseAst<`function foo(bar: boolean) {}`>>([
//   {
//     type: 'FunctionDeclaration',
//     id: {
//       type: 'Identifier',
//       name: 'foo',
//     },
//     params: [
//       {
//         type: 'Identifier',
//         name: 'bar',
//         typeAnnotation: {
//           type: 'TypeAnnotation',
//           typeAnnotation: {
//             type: 'BooleanTypeAnnotation',
//           },
//         },
//       },
//     ],
//     body: {
//       type: 'BlockStatement',
//       body: [],
//     },
//   },
// ]);

// expectType<ParseAst<`function foo(bar: number) {}`>>([
//   {
//     type: 'FunctionDeclaration',
//     id: {
//       type: 'Identifier',
//       name: 'foo',
//     },
//     params: [
//       {
//         type: 'Identifier',
//         name: 'bar',
//         typeAnnotation: {
//           type: 'TypeAnnotation',
//           typeAnnotation: {
//             type: 'NumberTypeAnnotation',
//           },
//         },
//       },
//     ],
//     body: {
//       type: 'BlockStatement',
//       body: [],
//     },
//   },
// ]);

// expectType<ParseAst<`function foo(bar: string, baz: null) {}`>>([
//   {
//     type: 'FunctionDeclaration',
//     id: {
//       type: 'Identifier',
//       name: 'foo',
//     },
//     params: [
//       {
//         type: 'Identifier',
//         name: 'bar',
//         typeAnnotation: {
//           type: 'TypeAnnotation',
//           typeAnnotation: {
//             type: 'StringTypeAnnotation',
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         name: 'baz',
//         typeAnnotation: {
//           type: 'TypeAnnotation',
//           typeAnnotation: {
//             type: 'NullLiteralTypeAnnotation',
//           },
//         },
//       },
//     ],
//     body: {
//       type: 'BlockStatement',
//       body: [],
//     },
//   },
// ]);
