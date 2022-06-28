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
  Identifier,
  NullLiteral,
  ExpressionStatement,
  CallExpression,
  MemberExpression,
} from './ast';
import type {
  BracketToken,
  ColonToken,
  CommaToken,
  CurlyToken,
  DotToken,
  NumberToken,
  ParenToken,
  SemicolonToken,
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
  ? [NullLiteral, Tail<T>]
  : F extends NumberToken<infer V>
  ? [NumericLiteral<V>, Tail<T>]
  : F extends StringToken<infer V>
  ? [StringLiteral<V>, Tail<T>]
  : F extends BracketToken<'['>
  ? ParseArray<Tail<T>>
  : F extends CurlyToken<'{'>
  ? ParseObject<Tail<T>>
  : F extends SymbolToken<infer V>
  ? [Identifier<V>, Tail<T>]
  : [never, []];

export type ParseExpression<
  T extends Array<Token<any>>,
  R extends Array<any>,
  F = T[0],
> = F extends SymbolToken<'const'>
  ? ParseVariableDeclaration<Tail<T>>
  : F extends SymbolToken<'function'>
  ? ParseFunctionDeclaration<Tail<T>>
  : F extends SymbolToken<infer V>
  ? [Identifier<V>, Tail<T>]
  : F extends DotToken
  ? T[1] extends SymbolToken<infer K>
    ? [
        [],
        Tail<Tail<T>>,
        Unshift<Tail<R>, MemberExpression<R[0], Identifier<K>>>,
      ]
    : never
  : T[0] extends ParenToken<'('>
  ? ParseFunctionArguments<Tail<T>> extends infer G
    ? [
        [],
        Cast<G, Array<any>>[1],
        Unshift<Tail<R>, CallExpression<R[0], Cast<G, Array<any>>[0]>>,
      ]
    : never
  : never;

type ParseFunctionArguments<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
  N extends boolean = false,
> = T[0] extends ParenToken<')'>
  ? [Reverse<R>, Tail<T>]
  : T extends []
  ? never
  : N extends true
  ? T[0] extends CommaToken
    ? ParseFunctionArgumentsItem<Tail<T>, R>
    : never
  : ParseFunctionArgumentsItem<T, R>;

type ParseFunctionArgumentsItem<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
> = ParseLiteral<T> extends infer G
  ? ParseFunctionArguments<
      Cast<G, Array<any>>[1],
      Unshift<R, Cast<G, Array<any>>[0]>,
      true
    >
  : never;

type ParseFunctionDeclaration<
  T extends Array<Token<any>>,
  G extends [any, Array<Token<any>>] = ParseFunctionParams<Tail<Tail<T>>>,
> = T[0] extends SymbolToken<infer I>
  ? T[1] extends ParenToken<'('>
    ? G[1][0] extends CurlyToken<'{'>
      ? G[1][1] extends CurlyToken<'}'>
        ? [FunctionDeclaration<Identifier<I>, G[0], []>, Tail<Tail<G[1]>>]
        : never
      : never
    : never
  : never;

type ParseFunctionParams<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
  N extends boolean = false,
> = T[0] extends ParenToken<')'>
  ? [Reverse<R>, Tail<T>]
  : T extends []
  ? never
  : N extends true
  ? T[0] extends CommaToken
    ? ParseFunctionParamsItem<Tail<T>, R>
    : never
  : ParseFunctionParamsItem<T, R>;

type ParseFunctionParamsItem<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
> = T[0] extends SymbolToken<infer V>
  ? ParseFunctionParams<Tail<T>, Unshift<R, Identifier<V>>, true>
  : never;

type ParseVariableDeclaration<T extends Array<Token<any>>> =
  T[0] extends SymbolToken<infer K>
    ? T[1] extends SymbolToken<'='>
      ? ParseLiteral<Tail<Tail<T>>> extends infer G
        ? [
            VariableDeclaration<
              [VariableDeclarator<Identifier<K>, Cast<G, Array<any>>[0]>],
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
          Unshift<R, ObjectProperty<Identifier<K>, Cast<G, Array<any>>[0]>>,
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
  P extends [any, Array<Token<any>>, Array<any>?] = ParseExpression<T, R>,
> = T extends []
  ? R
  : P[2] extends Array<any>
  ? ParseSequence<P[1], P[2]>
  : ParseSequence<P[1], Unshift<R, P[0]>>;

export type Parse<T extends Array<Token<any>>> = Reverse<ParseSequence<T>>;
