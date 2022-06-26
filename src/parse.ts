import type {
  ArrayExpression,
  BooleanLiteral,
  NumericLiteral,
  ObjectExpression,
  StringLiteral,
  ObjectProperty,
  VariableDeclaration,
  VariableDeclarator,
  FunctionDeclaration,
} from './ast';
import type {
  BracketToken,
  ColonToken,
  CommaToken,
  CurlyToken,
  NumberToken,
  ParenToken,
  StringToken,
  SymbolToken,
  Token,
} from './tokens';
import type { Reverse, Tail, Unshift } from './utils/arrayUtils';
import type { Cast } from './utils/generalUtils';

export type ParseLiteral<
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
  : F extends BracketToken<'['>
  ? ParseArray<Tail<T>>
  : F extends CurlyToken<'{'>
  ? ParseObject<Tail<T>>
  : [never, []];

export type ParseExpression<
  T extends Array<Token<any>>,
  F = T[0],
> = F extends SymbolToken<'const'>
  ? ParseVariableDeclaration<Tail<T>>
  : F extends SymbolToken<'function'>
  ? ParseFunctionDeclaration<Tail<T>>
  : never;

type ParseFunctionDeclaration<T extends Array<Token<any>>> =
  T[0] extends SymbolToken<infer I>
    ? T[1] extends ParenToken<'('>
      ? T[2] extends ParenToken<')'>
        ? T[3] extends CurlyToken<'{'>
          ? T[4] extends CurlyToken<'}'>
            ? [FunctionDeclaration<I, [], []>, Tail<Tail<Tail<Tail<Tail<T>>>>>]
            : never
          : never
        : never
      : never
    : never;

type ParseVariableDeclaration<T extends Array<Token<any>>> =
  T[0] extends SymbolToken<infer K>
    ? T[1] extends SymbolToken<'='>
      ? ParseLiteral<Tail<Tail<T>>> extends infer G
        ? [
            VariableDeclaration<
              [VariableDeclarator<K, Cast<G, Array<any>>[0]>],
              'const'
            >,
            Cast<G, Array<any>>[1],
          ]
        : never
      : never
    : never;

type ParseObject<T extends Array<Token<any>>> =
  ParseObjectBody<T> extends infer G
    ? [ObjectExpression<Cast<G, Array<any>>[0]>, Cast<G, Array<any>>[1]]
    : never;

type ParseObjectBody<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
  F extends Token<any> = T[0],
> = F extends CurlyToken<'}'>
  ? [Reverse<R>, Tail<T>]
  : T extends []
  ? never
  : T[0] extends CommaToken
  ? ParseObjectBody<Tail<T>, R>
  : T[0] extends SymbolToken<infer H>
  ? T[1] extends ColonToken
    ? ParseLiteral<Tail<Tail<T>>> extends infer G
      ? ParseObjectBody<
          Cast<G, Array<any>>[1],
          Unshift<R, ObjectProperty<H, Cast<G, Array<any>>[0]>>
        >
      : never
    : never
  : never;

type ParseArray<T extends Array<Token<any>>> = ParseArrayBody<T> extends infer G
  ? [ArrayExpression<Cast<G, Array<any>>[0]>, Cast<G, Array<any>>[1]]
  : never;

type ParseArrayBody<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
  F extends Token<any> = T[0],
> = F extends BracketToken<']'>
  ? [Reverse<R>, Tail<T>]
  : T extends []
  ? never
  : T[0] extends CommaToken
  ? ParseArrayBody<Tail<T>, R>
  : ParseLiteral<T> extends infer G
  ? ParseArrayBody<Cast<G, Array<any>>[1], Unshift<R, Cast<G, Array<any>>[0]>>
  : never;

export type ParseSequence<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
  P extends [any, Array<Token<any>>] = ParseExpression<T>,
> = T extends [] ? R : ParseSequence<P[1], Unshift<R, P[0]>>;

export type Parse<T extends Array<Token<any>>> = Reverse<ParseSequence<T>>;
