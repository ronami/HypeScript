import type { Tokenize } from '../tokenizer';

const expectType = <T>(value: T) => {};

expectType<Tokenize<`hello`>>([
  {
    type: 'symbol',
    value: 'hello',
  },
]);

expectType<Tokenize<`"hello"`>>([
  {
    type: 'string',
    value: 'hello',
  },
]);

expectType<Tokenize<`123`>>([
  {
    type: 'number',
    value: '123',
  },
]);

expectType<Tokenize<`[1,2,3]`>>([
  {
    type: 'bracket',
    value: '[',
  },
  {
    type: 'number',
    value: '1',
  },
  {
    type: 'comma',
  },
  {
    type: 'number',
    value: '2',
  },
  {
    type: 'comma',
  },
  {
    type: 'number',
    value: '3',
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
