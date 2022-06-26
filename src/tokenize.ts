import type { Reverse, Unshift } from './utils/arrayUtils';
import type {
  EatFirstChar,
  FirstChar,
  ConcatStrings,
} from './utils/stringUtils';
import type { Numbers, Symbols } from './utils/generalUtils';
import type {} from './dataTypes';

type TokenizeInput<I extends string> = FirstChar<I> extends infer F
  ? EatFirstChar<I> extends infer E
    ? F extends ' ' | '\n'
      ? ['', E]
      : F extends '('
      ? [
          {
            type: 'paren';
            value: '(';
          },
          E,
        ]
      : F extends ')'
      ? [
          {
            type: 'paren';
            value: ')';
          },
          E,
        ]
      : F extends '{'
      ? [
          {
            type: 'curly';
            value: '{';
          },
          E,
        ]
      : F extends '}'
      ? [
          {
            type: 'curly';
            value: '}';
          },
          E,
        ]
      : F extends '.'
      ? [
          {
            type: 'dot';
            value: '.';
          },
          E,
        ]
      : F extends ';'
      ? [
          {
            type: ';';
            value: ';';
          },
          E,
        ]
      : F extends ':'
      ? [
          {
            type: ':';
            value: ':';
          },
          E,
        ]
      : F extends Numbers
      ? TokenizeNumber<I, '', F>
      : F extends '"'
      ? TokenizeString<E>
      : F extends Symbols
      ? TokenizeSymbol<I, '', F>
      : never
    : never
  : never;

type TokenizeNumber<
  I extends string,
  A extends string = '',
  C extends string = FirstChar<I>,
> = C extends Numbers
  ? TokenizeNumber<EatFirstChar<I>, ConcatStrings<A, C>>
  : [{ type: 'number'; value: A }, I];

type TokenizeString<I> = I extends `${infer H}"${infer G}`
  ? [{ type: 'string'; value: H }, G]
  : never;

type TokenizeSymbol<
  I extends string,
  A extends string = '',
  C extends string = FirstChar<I>,
> = C extends Symbols
  ? TokenizeSymbol<EatFirstChar<I>, ConcatStrings<A, C>>
  : [{ type: 'symbol'; value: A }, I];

export type TokenizeSequence<
  I extends string,
  R extends Array<Token<any>> = [],
  P extends [any, string] = TokenizeInput<I>,
> = I extends ''
  ? R
  : TokenizeSequence<P[1], P[0] extends '' ? R : Unshift<R, P[0]>>;

export type Tokenize<I extends string> = Reverse<TokenizeSequence<I>>;
