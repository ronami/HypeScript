import type { Tokenize } from '../tokenizer';

const expectType = <T>(value: T) => {};

expectType<Tokenize<`hello`>>([
  {
    type: 'symbol',
    value: 'hello',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
]);

expectType<Tokenize<`hello world`>>([
  {
    type: 'symbol',
    value: 'hello',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'symbol',
    value: 'world',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
]);

expectType<Tokenize<`hello\n world`>>([
  {
    type: 'symbol',
    value: 'hello',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'symbol',
    value: 'world',
    data: {
      precedingLinebreak: true,
      lineNumber: 2,
    },
  },
]);

expectType<Tokenize<`hello\nworld`>>([
  {
    type: 'symbol',
    value: 'hello',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'symbol',
    value: 'world',
    data: {
      precedingLinebreak: true,
      lineNumber: 2,
    },
  },
]);

expectType<Tokenize<`hello\n\n world`>>([
  {
    type: 'symbol',
    value: 'hello',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'symbol',
    value: 'world',
    data: {
      precedingLinebreak: true,
      lineNumber: 3,
    },
  },
]);

expectType<Tokenize<`"hello" "world"`>>([
  {
    type: 'string',
    value: 'hello',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'string',
    value: 'world',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
]);

expectType<Tokenize<`"hello"\n "world"`>>([
  {
    type: 'string',
    value: 'hello',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'string',
    value: 'world',
    data: {
      precedingLinebreak: true,
      lineNumber: 2,
    },
  },
]);

expectType<Tokenize<`\n123 456 \n\n789`>>([
  {
    type: 'number',
    value: '123',
    data: {
      precedingLinebreak: true,
      lineNumber: 2,
    },
  },
  {
    type: 'number',
    value: '456',
    data: {
      precedingLinebreak: false,
      lineNumber: 2,
    },
  },
  {
    type: 'number',
    value: '789',
    data: {
      precedingLinebreak: true,
      lineNumber: 4,
    },
  },
]);

expectType<Tokenize<`"hello"\n \n"world"`>>([
  {
    type: 'string',
    value: 'hello',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'string',
    value: 'world',
    data: {
      precedingLinebreak: true,
      lineNumber: 3,
    },
  },
]);

expectType<Tokenize<`"hello"`>>([
  {
    type: 'string',
    value: 'hello',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
]);

expectType<Tokenize<`123`>>([
  {
    type: 'number',
    value: '123',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
]);

expectType<Tokenize<`[1, 2, 3]`>>([
  {
    type: 'bracket',
    value: '[',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'number',
    value: '1',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'comma',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'number',
    value: '2',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'comma',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'number',
    value: '3',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'bracket',
    value: ']',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
]);

expectType<Tokenize<`foo()`>>([
  {
    type: 'symbol',
    value: 'foo',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'paren',
    value: '(',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'paren',
    value: ')',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
]);

expectType<Tokenize<`"foo"()`>>([
  {
    type: 'string',
    value: 'foo',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'paren',
    value: '(',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'paren',
    value: ')',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
]);

expectType<Tokenize<`"foo"\n()`>>([
  {
    type: 'string',
    value: 'foo',
    data: {
      precedingLinebreak: false,
      lineNumber: 1,
    },
  },
  {
    type: 'paren',
    value: '(',
    data: {
      precedingLinebreak: true,
      lineNumber: 2,
    },
  },
  {
    type: 'paren',
    value: ')',
    data: {
      precedingLinebreak: false,
      lineNumber: 2,
    },
  },
]);

expectType<Tokenize<`"foo`>>({
  type: 'SyntaxError',
  message: 'Unterminated string literal.',
});

expectType<Tokenize<`foo"`>>({
  type: 'SyntaxError',
  message: 'Unterminated string literal.',
});

expectType<Tokenize<`%`>>({
  type: 'SyntaxError',
  message: 'Invalid character.',
});

expectType<Tokenize<`"hello" %`>>({
  type: 'SyntaxError',
  message: 'Invalid character.',
});

expectType<Tokenize<`"foo\n"`>>({
  type: 'SyntaxError',
  message: 'Unterminated string literal.',
});
