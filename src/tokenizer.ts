import type { Push } from './utils/arrayUtils';
import type {
  EatFirstChar,
  FirstChar,
  ConcatStrings,
} from './utils/stringUtils';
import type { Cast, Numbers, Symbols } from './utils/generalUtils';
import type {
  CurlyToken,
  ParenToken,
  DotToken,
  SemicolonToken,
  ColonToken,
  Token,
  NumberToken,
  SymbolToken,
  StringToken,
  BracketToken,
  CommaToken,
} from './tokens';
import type { Error, SyntaxError } from './errors';

type TokenizeInput<I extends string> = FirstChar<I> extends infer F
  ? EatFirstChar<I> extends infer E
    ? F extends ' '
      ? ['', E]
      : F extends ','
      ? [CommaToken, E]
      : F extends '('
      ? [ParenToken<'('>, E]
      : F extends ')'
      ? [ParenToken<')'>, E]
      : F extends '['
      ? [BracketToken<'['>, E]
      : F extends ']'
      ? [BracketToken<']'>, E]
      : F extends '{'
      ? [CurlyToken<'{'>, E]
      : F extends '}'
      ? [CurlyToken<'}'>, E]
      : F extends '.'
      ? [DotToken, E]
      : F extends ';'
      ? [SemicolonToken, E]
      : F extends ':'
      ? [ColonToken, E]
      : F extends Numbers
      ? TokenizeNumber<I, '', F>
      : F extends '"'
      ? TokenizeString<E, '"'>
      : F extends "'"
      ? TokenizeString<E, "'">
      : F extends Symbols
      ? TokenizeSymbol<I, '', F>
      : SyntaxError<`Invalid character.`>
    : never
  : never;

type TokenizeNumber<
  I extends string,
  A extends string = '',
  C extends string = FirstChar<I>,
> = C extends Numbers
  ? TokenizeNumber<EatFirstChar<I>, ConcatStrings<A, C>>
  : [NumberToken<A>, I];

type TokenizeString<
  I,
  W extends '"' | "'",
> = I extends `${infer H}${W}${infer G}`
  ? [StringToken<H>, G]
  : SyntaxError<'Unterminated string literal.'>;

type TokenizeSymbol<
  I extends string,
  A extends string = '',
  C extends string = FirstChar<I>,
> = C extends Symbols
  ? TokenizeSymbol<EatFirstChar<I>, ConcatStrings<A, C>>
  : [SymbolToken<A>, I];

export type TokenizeSequence<
  I extends string,
  R extends Array<Token<any>> = [],
> = I extends ''
  ? R
  : TokenizeInput<I> extends infer P
  ? P extends SyntaxError<any>
    ? P
    : TokenizeSequence<
        Cast<P, Array<any>>[1],
        Cast<P, Array<any>>[0] extends '' ? R : Push<R, Cast<P, Array<any>>[0]>
      >
  : never;

export type Tokenize<I extends string> = TokenizeSequence<I> extends infer G
  ? G extends Array<any>
    ? G
    : G extends Error<any, any>
    ? G
    : never
  : never;
