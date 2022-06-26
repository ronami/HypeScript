import type { Reverse, Tail, Unshift } from './utils/arrayUtils';

export type ParseInput<
  T extends Array<any>,
  F = T[0],
> = F extends ParenToken<'('>
  ? ParseList<Tail<T>>
  : F extends SymbolToken<'True'>
  ? [{ type: 'Boolean'; value: true }, Tail<T>]
  : F extends SymbolToken<'False'>
  ? [{ type: 'Boolean'; value: false }, Tail<T>]
  : F extends SymbolToken<'Null'>
  ? [{ type: 'Null'; value: null }, Tail<T>]
  : F extends NumberToken<infer V>
  ? [{ type: 'Number'; value: V }, Tail<T>]
  : F extends StringToken<infer V>
  ? [{ type: 'String'; value: V }, Tail<T>]
  : F extends SymbolToken<infer V>
  ? [{ type: 'Variable'; value: V }, Tail<T>]
  : [never, []];

export type ParseSequence<
  T extends Array<any>,
  R extends Array<any> = [],
  P extends [any, Array<any>] = ParseInput<T>,
> = T extends [] ? R : ParseSequence<P[1], Unshift<R, P[0]>>;

export type Parse<T extends Array<any>> = Reverse<ParseSequence<T>>;
