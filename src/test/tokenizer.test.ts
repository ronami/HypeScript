import type { Tokenize } from '../tokenizer';

const expectType = <T>(value: T) => {};

expectType<Tokenize<`hello`>>([
  {
    type: 'symbol',
    value: 'hello',
    precedingLinebreak: false,
  },
]);

expectType<Tokenize<`hello world`>>([
  {
    type: 'symbol',
    value: 'hello',
    precedingLinebreak: false,
  },
  {
    type: 'symbol',
    value: 'world',
    precedingLinebreak: false,
  },
]);

expectType<Tokenize<`hello\n world`>>([
  {
    type: 'symbol',
    value: 'hello',
    precedingLinebreak: false,
  },
  {
    type: 'symbol',
    value: 'world',
    precedingLinebreak: true,
  },
]);

expectType<Tokenize<`hello\nworld`>>([
  {
    type: 'symbol',
    value: 'hello',
    precedingLinebreak: false,
  },
  {
    type: 'symbol',
    value: 'world',
    precedingLinebreak: true,
  },
]);

expectType<Tokenize<`hello\n\n world`>>([
  {
    type: 'symbol',
    value: 'hello',
    precedingLinebreak: false,
  },
  {
    type: 'symbol',
    value: 'world',
    precedingLinebreak: true,
  },
]);

expectType<Tokenize<`"hello" "world"`>>([
  {
    type: 'string',
    value: 'hello',
    precedingLinebreak: false,
  },
  {
    type: 'string',
    value: 'world',
    precedingLinebreak: false,
  },
]);

expectType<Tokenize<`"hello"\n "world"`>>([
  {
    type: 'string',
    value: 'hello',
    precedingLinebreak: false,
  },
  {
    type: 'string',
    value: 'world',
    precedingLinebreak: true,
  },
]);

expectType<Tokenize<`\n123 456 \n789`>>([
  {
    type: 'number',
    value: '123',
    precedingLinebreak: true,
  },
  {
    type: 'number',
    value: '456',
    precedingLinebreak: false,
  },
  {
    type: 'number',
    value: '789',
    precedingLinebreak: true,
  },
]);

expectType<Tokenize<`"hello"\n \n"world"`>>([
  {
    type: 'string',
    value: 'hello',
    precedingLinebreak: false,
  },
  {
    type: 'string',
    value: 'world',
    precedingLinebreak: true,
  },
]);

expectType<Tokenize<`"hello"`>>([
  {
    type: 'string',
    value: 'hello',
    precedingLinebreak: false,
  },
]);

expectType<Tokenize<`123`>>([
  {
    type: 'number',
    value: '123',
    precedingLinebreak: false,
  },
]);

expectType<Tokenize<`[1, 2, 3]`>>([
  {
    type: 'bracket',
    value: '[',
  },
  {
    type: 'number',
    value: '1',
    precedingLinebreak: false,
  },
  {
    type: 'comma',
  },
  {
    type: 'number',
    value: '2',
    precedingLinebreak: false,
  },
  {
    type: 'comma',
  },
  {
    type: 'number',
    value: '3',
    precedingLinebreak: false,
  },
  {
    type: 'bracket',
    value: ']',
  },
]);

expectType<Tokenize<`foo()`>>([
  {
    type: 'symbol',
    value: 'foo',
    precedingLinebreak: false,
  },
  {
    type: 'paren',
    value: '(',
  },
  {
    type: 'paren',
    value: ')',
  },
]);

expectType<Tokenize<`"foo"()`>>([
  {
    type: 'string',
    value: 'foo',
    precedingLinebreak: false,
  },
  {
    type: 'paren',
    value: '(',
  },
  {
    type: 'paren',
    value: ')',
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
