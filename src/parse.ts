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

type ParseObject<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
  N extends boolean = false,
  F extends Token<any> = T[0],
> = F extends CurlyToken<'}'>
  ? [ObjectExpression<Reverse<R>>, Tail<T>]
  : T extends []
  ? never
  : N extends true
  ? F extends CommaToken
    ? ParseObjectItem<Tail<T>, R>
    : never
  : ParseObjectItem<T, R>;

type ParseObjectItem<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
> = T[0] extends SymbolToken<infer K>
  ? T[1] extends ColonToken
    ? ParseLiteral<Tail<Tail<T>>> extends infer G
      ? ParseObject<
          Cast<G, Array<any>>[1],
          Unshift<R, ObjectProperty<K, Cast<G, Array<any>>[0]>>,
          true
        >
      : never
    : never
  : never;

type ParseArray<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
  N extends boolean = false,
  F extends Token<any> = T[0],
> = F extends BracketToken<']'>
  ? [ArrayExpression<Reverse<R>>, Tail<T>]
  : T extends []
  ? never
  : N extends true
  ? F extends CommaToken
    ? ParseArrayItem<Tail<T>, R>
    : never
  : ParseArrayItem<T, R>;

type ParseArrayItem<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
> = ParseLiteral<T> extends infer G
  ? ParseArray<Cast<G, Array<any>>[1], Unshift<R, Cast<G, Array<any>>[0]>, true>
  : never;

export type ParseSequence<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
  P extends [any, Array<Token<any>>] = ParseExpression<T>,
> = T extends [] ? R : ParseSequence<P[1], Unshift<R, P[0]>>;

export type Parse<T extends Array<Token<any>>> = Reverse<ParseSequence<T>>;
