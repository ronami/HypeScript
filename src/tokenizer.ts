import type { Push } from './utils/arrayUtils';
import type {
  EatFirstChar,
  FirstChar,
  ConcatStrings,
  StringContains,
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
import type { SyntaxError } from './errors';

type TokenizeInput<
  I extends string,
  F extends string,
  E extends string,
  G extends boolean,
> = F extends ','
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
  ? TokenizeNumber<I, '', G, F>
  : F extends '"'
  ? TokenizeString<E, '"', G>
  : F extends "'"
  ? TokenizeString<E, "'", G>
  : F extends Symbols
  ? TokenizeSymbol<I, '', G, F>
  : SyntaxError<`Invalid character.`>;

type TokenizeNumber<
  I extends string,
  A extends string,
  G extends boolean,
  C extends string = FirstChar<I>,
> = C extends Numbers
  ? TokenizeNumber<EatFirstChar<I>, ConcatStrings<A, C>, G>
  : [NumberToken<A, G>, I];

type TokenizeString<
  I,
  W extends '"' | "'",
  J extends boolean,
> = I extends `${infer H}${W}${infer G}`
  ? StringContains<H, '\n'> extends true
    ? SyntaxError<'Unterminated string literal.'>
    : [StringToken<H, J>, G]
  : SyntaxError<'Unterminated string literal.'>;

type TokenizeSymbol<
  I extends string,
  A extends string,
  G extends boolean,
  C extends string = FirstChar<I>,
> = C extends Symbols
  ? TokenizeSymbol<EatFirstChar<I>, ConcatStrings<A, C>, G>
  : [SymbolToken<A, G>, I];

export type TokenizeSequence<
  I extends string,
  R extends Array<Token<any>> = [],
  G extends boolean = false,
  F extends string = FirstChar<I>,
  E extends string = EatFirstChar<I>,
> = I extends ''
  ? R
  : F extends ' '
  ? TokenizeSequence<E, R, G>
  : F extends '\n'
  ? TokenizeSequence<E, R, true>
  : TokenizeInput<I, F, E, G> extends infer P
  ? TokenizeHelper<P, R>
  : never;

export type TokenizeHelper<P, R extends Array<any>> = P extends Array<any>
  ? TokenizeSequence<P[1], Push<R, P[0]>>
  : P;

export type Tokenize<I extends string> = TokenizeSequence<I>;
