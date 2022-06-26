import type { BooleanLiteral, NumericLiteral, StringLiteral } from './ast';
import type { NumberToken, StringToken, SymbolToken, Token } from './tokens';
import type { Reverse, Tail, Unshift } from './utils/arrayUtils';

export type ParseInput<
  T extends Array<Token<any>>,
  F = T[0],
> = F extends SymbolToken<'true'>
  ? [BooleanLiteral<true>, Tail<T>]
  : F extends SymbolToken<'false'>
  ? [BooleanLiteral<false>, Tail<T>]
  : F extends SymbolToken<'null'>
  ? [{ type: 'null'; value: null }, Tail<T>]
  : F extends NumberToken<infer V>
  ? [NumericLiteral<V>, Tail<T>]
  : F extends StringToken<infer V>
  ? [StringLiteral<V>, Tail<T>]
  : [never, []];

export type ParseSequence<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
  P extends [any, Array<Token<any>>] = ParseInput<T>,
> = T extends [] ? R : ParseSequence<P[1], Unshift<R, P[0]>>;

export type Parse<T extends Array<Token<any>>> = Reverse<ParseSequence<T>>;
