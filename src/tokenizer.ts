import type { Push } from './utils/arrayUtils';
import type {
  EatFirstChar,
  FirstChar,
  ConcatStrings,
  StringContains,
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
  TokenData,
} from './tokens';
import type { SyntaxError } from './errors';
import type { Succ } from './utils/math';

type TokenizeInput<
  I extends string,
  F extends string,
  E extends string,
  G extends boolean,
  L extends number,
  D extends TokenData = { precedingLinebreak: G; lineNumber: L },
> = F extends ','
  ? [CommaToken<D>, E]
  : F extends '('
  ? [ParenToken<'(', D>, E]
  : F extends ')'
  ? [ParenToken<')', D>, E]
  : F extends '['
  ? [BracketToken<'[', D>, E]
  : F extends ']'
  ? [BracketToken<']', D>, E]
  : F extends '{'
  ? [CurlyToken<'{', D>, E]
  : F extends '}'
  ? [CurlyToken<'}', D>, E]
  : F extends '.'
  ? [DotToken<D>, E]
  : F extends ';'
  ? [SemicolonToken<D>, E]
  : F extends ':'
  ? [ColonToken<D>, E]
  : F extends Numbers
  ? TokenizeNumber<I, '', D, F>
  : F extends '"'
  ? TokenizeString<E, '"', D>
  : F extends "'"
  ? TokenizeString<E, "'", D>
  : F extends Symbols
  ? TokenizeSymbol<I, '', D, F>
  : SyntaxError<`Invalid character.`, L>;

type TokenizeNumber<
  I extends string,
  A extends string,
  G extends TokenData,
  C extends string = FirstChar<I>,
> = C extends Numbers
  ? TokenizeNumber<EatFirstChar<I>, ConcatStrings<A, C>, G>
  : [NumberToken<A, G>, I];

type TokenizeString<
  I,
  W extends '"' | "'",
  G extends TokenData,
> = I extends `${infer H}${W}${infer J}`
  ? StringContains<H, '\n'> extends true
    ? SyntaxError<'Unterminated string literal.', G['lineNumber']>
    : [StringToken<H, G>, J]
  : SyntaxError<'Unterminated string literal.', G['lineNumber']>;

type TokenizeSymbol<
  I extends string,
  A extends string,
  G extends TokenData,
  C extends string = FirstChar<I>,
> = C extends Symbols
  ? TokenizeSymbol<EatFirstChar<I>, ConcatStrings<A, C>, G>
  : [SymbolToken<A, G>, I];

export type TokenizeSequence<
  I extends string,
  R extends Array<Token<any, any>>,
  L extends number,
  G extends boolean,
  F extends string = FirstChar<I>,
  E extends string = EatFirstChar<I>,
> = I extends ''
  ? R
  : F extends ' '
  ? TokenizeSequence<E, R, L, G>
  : F extends '\n'
  ? TokenizeSequence<E, R, Succ<L>, true>
  : TokenizeInput<I, F, E, G, L> extends infer P
  ? TokenizeHelper<P, R, L>
  : never;

export type TokenizeHelper<
  P,
  R extends Array<any>,
  L extends number,
> = P extends Array<any> ? TokenizeSequence<P[1], Push<R, P[0]>, L, false> : P;

export type Tokenize<I extends string> = TokenizeSequence<I, [], 1, false>;
