import type { Reverse, Unshift } from './utils/arrayUtils';
import type {
  EatFirstChar,
  FirstChar,
  ConcatStrings,
} from './utils/stringUtils';
import type { Numbers, Symbols } from './utils/generalUtils';
import type { Token } from './dataTypes';

type TokenizeInput<I extends string> = FirstChar<I> extends ' ' | '\n'
  ? ['', EatFirstChar<I>]
  : FirstChar<I> extends '('
  ? [
      {
        type: 'paren';
        value: '(';
      },
      EatFirstChar<I>,
    ]
  : FirstChar<I> extends ')'
  ? [
      {
        type: 'paren';
        value: ')';
      },
      EatFirstChar<I>,
    ]
  : FirstChar<I> extends Numbers
  ? TokenizeNumber<I, '', FirstChar<I>>
  : FirstChar<I> extends '"'
  ? TokenizeString<EatFirstChar<I>>
  : FirstChar<I> extends Symbols
  ? TokenizeSymbol<I, '', FirstChar<I>>
  : never;

type TokenizeNumber<
  I extends string,
  A extends string = '',
  C extends string = FirstChar<I>,
> = C extends Numbers
  ? TokenizeNumber<EatFirstChar<I>, ConcatStrings<A, C>>
  : [{ type: 'number'; value: A }, I];

type TokenizeString<I extends string> = I extends `${infer H}"${infer G}`
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
