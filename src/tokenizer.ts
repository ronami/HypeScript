import type { Reverse, Unshift } from './utils/arrayUtils';
import type {
  EatFirstChar,
  FirstChar,
  ConcatStrings,
} from './utils/stringUtils';
import type { Numbers, Symbols } from './utils/generalUtils';
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

type TokenizeInput<I extends string> = FirstChar<I> extends infer F
  ? EatFirstChar<I> extends infer E
    ? F extends ' ' | '\n'
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
      : never
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
> = I extends `${infer H}${W}${infer G}` ? [StringToken<H>, G] : never;

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
  P extends [any, string] = TokenizeInput<I>,
> = I extends ''
  ? R
  : TokenizeSequence<P[1], P[0] extends '' ? R : Unshift<R, P[0]>>;

export type Tokenize<I extends string> = Reverse<TokenizeSequence<I>>;
