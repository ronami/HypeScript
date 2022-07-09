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
  IfStatement,
  ReturnStatement,
  BlockStatement,
  TypeAnnotation,
  GenericTypeAnnotation,
  StringTypeAnnotation,
  BooleanTypeAnnotation,
  NullLiteralTypeAnnotation,
  NumberTypeAnnotation,
  AnyTypeAnnotation,
  NodeData,
  Node,
} from './ast';
import type { Error, SyntaxError } from './errors';
import type {
  GenericToken,
  NumberToken,
  StringToken,
  SymbolToken,
  Token,
  TokenData,
} from './tokens';
import type { Push, Tail, TailBy } from './utils/arrayUtils';

type ExtractTokenData<
  T extends Token<any>,
  R extends Token<any> = T,
> = T extends Token<TokenData<any, infer D>>
  ? R extends Token<TokenData<any, infer H>>
    ? NodeData<D, H>
    : never
  : never;

type ParseVariableDeclarationHelper<
  L extends Node<any>,
  N extends string,
  NL extends number,
  FL extends number,
  T extends Array<Token<any>>,
> = L extends Node<NodeData<any, infer E>>
  ? [
      VariableDeclaration<
        [
          VariableDeclarator<
            Identifier<N, null, NodeData<NL, NL>>,
            L,
            NodeData<NL, E>
          >,
        ],
        'const',
        NodeData<FL, E>
      >,
      T,
    ]
  : never;

type ParseVariableDeclaration<T extends Array<Token<any>>> =
  T[0] extends SymbolToken<'const', TokenData<any, infer FL>>
    ? T[1] extends SymbolToken<infer N, TokenData<any, infer NL>>
      ? T[2] extends SymbolToken<'=', TokenData<any, infer KL>>
        ? ParseExpression<TailBy<T, 3>> extends [infer L, infer T]
          ? L extends Node<any>
            ? T extends Array<Token<any>>
              ? ParseVariableDeclarationHelper<L, N, NL, FL, T>
              : never
            : never
          : SyntaxError<'Expression expected.', KL>
        : SyntaxError<"'const' declarations must be initialized.", NL>
      : SyntaxError<'Variable declaration list cannot be empty.', FL>
    : null;

type ParseMemberExpression<
  O extends Node<any>,
  T extends Array<Token<any>>,
> = T[0] extends GenericToken<'.', TokenData<any, infer E>>
  ? T[1] extends SymbolToken<infer N, TokenData<any, infer L>>
    ? O extends Node<NodeData<infer S, infer E>>
      ? [
          MemberExpression<
            O,
            Identifier<N, null, NodeData<L, L>>,
            NodeData<S, L>
          >,
          TailBy<T, 2>,
        ]
      : never
    : SyntaxError<'Identifier expected.', E>
  : null;

type ParseCallExpression<
  O extends Node<any>,
  T extends Array<Token<any>>,
> = T[0] extends GenericToken<'(', TokenData<any, infer E>>
  ? ParseCallExpressionArguments<Tail<T>, E, ')'> extends infer G
    ? G extends Array<any>
      ? O extends Node<NodeData<infer S, any>>
        ? G[2] extends Token<TokenData<any, infer L>>
          ? [CallExpression<O, G[0], NodeData<S, L>>, G[1]]
          : never
        : never
      : G
    : never
  : null;

type ParseCallExpressionArguments<
  T extends Array<Token<any>>,
  E extends number,
  J extends string,
  N extends boolean = false,
  R extends Array<Node<any>> = [],
> = T[0] extends GenericToken<J, any>
  ? [R, Tail<T>, T[0]]
  : T extends []
  ? SyntaxError<`'${J}' expected.`, E>
  : N extends true
  ? T[0] extends GenericToken<',', any>
    ? ParseCallExpressionArgumentsHelper<Tail<T>, E, J, R>
    : T[0] extends Token<TokenData<any, infer L>>
    ? SyntaxError<"',' expected.", L>
    : never
  : ParseCallExpressionArgumentsHelper<T, E, J, R>;

type ParseCallExpressionArgumentsHelper<
  T extends Array<Token<any>>,
  E extends number,
  J extends string,
  R extends Array<any> = [],
> = ParseExpression<T> extends infer G
  ? G extends Array<any>
    ? ParseCallExpressionArguments<G[1], E, J, true, Push<R, G[0]>>
    : G
  : never;

type CheckExpression<
  O extends Node<any>,
  T extends Array<Token<any>>,
> = ParseMemberExpression<O, T> extends infer G
  ? G extends [infer O, infer T]
    ? O extends Node<any>
      ? T extends Array<Token<any>>
        ? CheckExpression<O, T>
        : never
      : never
    : G extends Error<any, any, any>
    ? G
    : ParseCallExpression<O, T> extends infer G
    ? G extends [infer O, infer T]
      ? O extends Node<any>
        ? T extends Array<Token<any>>
          ? CheckExpression<O, T>
          : never
        : never
      : G extends Error<any, any, any>
      ? G
      : [O, T]
    : never
  : never;

type ParseExpression<
  T extends Array<Token<any>>,
  H extends NodeData<any, any> = ExtractTokenData<T[0]>,
  G extends Array<Token<any>> = Tail<T>,
> = ParseExpressionHelper<T, H, G> extends infer P
  ? P extends Array<any>
    ? CheckExpression<P[0], P[1]>
    : P extends Error<any, any, any>
    ? P
    : null
  : never;

type ParseExpressionHelper<
  T extends Array<Token<any>>,
  H extends NodeData<any, any> = ExtractTokenData<T[0]>,
  G extends Array<Token<any>> = Tail<T>,
> = T[0] extends SymbolToken<'true', any>
  ? [BooleanLiteral<true, H>, G]
  : T[0] extends SymbolToken<'false', any>
  ? [BooleanLiteral<false, H>, G]
  : T[0] extends SymbolToken<'null', any>
  ? [NullLiteral<H>, G]
  : T[0] extends NumberToken<infer V, any>
  ? [NumericLiteral<V, H>, G]
  : T[0] extends StringToken<infer V, any>
  ? [StringLiteral<V, H>, G]
  : T[0] extends SymbolToken<infer V, any>
  ? [Identifier<V, null, H>, G]
  : T[0] extends GenericToken<'[', TokenData<any, infer E>>
  ? ParseArrayExpression<Tail<T>, E>
  : T[0] extends GenericToken<'{', TokenData<any, infer E>>
  ? ParseObject<Tail<T>, E>
  : null;

type ParseObject<
  T extends Array<Token<any>>,
  E extends number,
  R extends Array<any> = [],
  N extends boolean = false,
> = T[0] extends GenericToken<'}', TokenData<any, infer L>>
  ? [ObjectExpression<R, NodeData<E, L>>, Tail<T>]
  : T extends []
  ? SyntaxError<"'}' expected.", E>
  : N extends true
  ? T[0] extends GenericToken<',', any>
    ? ParseObjectItem<Tail<T>, E, R>
    : T[0] extends Token<TokenData<any, infer L>>
    ? SyntaxError<"',' expected.", L>
    : never
  : ParseObjectItem<T, E, R>;

type ParseObjectItem<
  T extends Array<Token<any>>,
  E extends number,
  R extends Array<any> = [],
> = T[0] extends SymbolToken<infer K, TokenData<any, infer L>>
  ? T[1] extends GenericToken<':', any>
    ? ParseExpression<TailBy<T, 2>> extends infer G
      ? G extends Array<any>
        ? G[0] extends Node<NodeData<any, infer W>>
          ? ParseObject<
              G[1],
              E,
              Push<
                R,
                ObjectProperty<
                  Identifier<K, null, NodeData<L, L>>,
                  G[0],
                  NodeData<L, W>
                >
              >,
              true
            >
          : never
        : G extends Error<any, any, any>
        ? G
        : SyntaxError<'Expression expected.', E>
      : never
    : SyntaxError<"'}' expected.", E>
  : SyntaxError<"'}' expected.", E>;

type ParseArrayExpression<
  T extends Array<Token<any>>,
  E extends number,
> = ParseCallExpressionArguments<T, E, ']'> extends infer A
  ? A extends Array<any>
    ? A[2] extends Token<TokenData<any, infer L>>
      ? [ArrayExpression<A[0], NodeData<E, L>>, A[1]]
      : never
    : A
  : never;

type ParseExpressionStatement<T extends Array<Token<any>>> =
  ParseExpression<T> extends infer G
    ? G extends Array<any>
      ? G[0] extends Node<infer D>
        ? [ExpressionStatement<G[0], D>, G[1]]
        : never
      : G
    : never;

type ParseFunctionDeclaration<T extends Array<Token<any>>> =
  T[0] extends SymbolToken<'function', TokenData<any, infer L>>
    ? T[1] extends SymbolToken<infer N, TokenData<any, infer O>>
      ? T[2] extends GenericToken<'(', any>
        ? ParseFunctionParams<TailBy<T, 3>> extends infer G
          ? G extends Array<any>
            ? ParseBlockStatement<G[1], G[2], true> extends infer H
              ? H extends Array<any>
                ? H[0] extends Node<NodeData<any, infer E>>
                  ? [
                      FunctionDeclaration<
                        Identifier<N, null, NodeData<O, O>>,
                        G[0],
                        H[0],
                        NodeData<L, E>
                      >,
                      H[1],
                    ]
                  : never
                : H
              : never
            : G
          : never
        : SyntaxError<"'(' expected.", O>
      : SyntaxError<'Identifier expected.', L>
    : null;

type ParseFunctionParams<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
  N extends boolean = false,
> = T[0] extends GenericToken<')', TokenData<any, infer L>>
  ? T[1] extends GenericToken<'{', TokenData<any, infer K>>
    ? [R, TailBy<T, 2>, K]
    : SyntaxError<"'{' expected.", L>
  : T extends []
  ? SyntaxError<"')' expected.", 1>
  : N extends true
  ? T[0] extends GenericToken<',', any>
    ? ParseFunctionParamsHelper<Tail<T>, R>
    : SyntaxError<"',' expected.", 1>
  : ParseFunctionParamsHelper<T, R>;

type ParseFunctionParamsHelper<
  T extends Array<Token<any>>,
  R extends Array<any> = [],
> = T[0] extends SymbolToken<infer V, TokenData<any, infer L>>
  ? ParseFunctionParams<
      Tail<T>,
      Push<R, Identifier<V, null, NodeData<L, L>>>,
      true
    >
  : SyntaxError<'Identifier expected.', 1>;

type ParseBlockStatement<
  T extends Array<Token<any>>,
  L extends number,
  F extends boolean,
  R extends Array<Node<any>> = [],
  N extends boolean = false,
> = T extends []
  ? SyntaxError<"'}' expected.", 1>
  : T[0] extends GenericToken<'}', TokenData<any, infer E>>
  ? [BlockStatement<R, NodeData<L, E>>, Tail<T>]
  : T[0] extends GenericToken<';', any>
  ? ParseBlockStatement<Tail<T>, L, F, R, false>
  : N extends false
  ? ParseBlockStatementHelper<T, L, F, R>
  : T[0] extends Token<TokenData<infer P, infer L>>
  ? P extends true
    ? ParseBlockStatementHelper<T, L, F, R>
    : SyntaxError<"';' expected.", L>
  : never;

type ParseTopLevel<
  T extends Array<Token<any>>,
  R extends Array<Node<any>> = [],
  N extends boolean = false,
> = T extends []
  ? R
  : T[0] extends GenericToken<';', any>
  ? ParseTopLevel<Tail<T>, R, false>
  : N extends false
  ? ParseTopLevelHelper<T, R>
  : T[0] extends Token<TokenData<infer P, infer L>>
  ? P extends true
    ? ParseTopLevelHelper<T, R>
    : SyntaxError<"';' expected.", L>
  : never;

type ParseBlockStatementHelper<
  T extends Array<Token<any>>,
  L extends number,
  F extends boolean,
  R extends Array<Node<any>>,
> = ParseStatementHelper<T, F> extends infer G
  ? G extends Array<any>
    ? ParseBlockStatement<G[1], L, F, Push<R, G[0]>, true>
    : G
  : never;

type ParseTopLevelHelper<
  T extends Array<Token<any>>,
  R extends Array<Node<any>>,
> = ParseStatementHelper<T, false> extends infer G
  ? G extends Array<any>
    ? ParseTopLevel<G[1], Push<R, G[0]>, G[2]>
    : G
  : never;

type ParseIfStatement<
  T extends Array<Token<any>>,
  F extends boolean,
> = T[0] extends SymbolToken<'if', TokenData<any, infer L>>
  ? T[1] extends GenericToken<'(', any>
    ? ParseExpression<TailBy<T, 2>> extends infer G
      ? G extends Array<any>
        ? ParseIfStatementHelper<G, L, F>
        : G extends Error<any, any, any>
        ? G
        : SyntaxError<'Expression expected.', 1>
      : never
    : SyntaxError<"'(' expected.", 1>
  : null;

type ParseReturnStatementHelper<
  T extends Array<Token<any>>,
  L extends number,
> = T[0] extends GenericToken<';', TokenData<any, infer K>>
  ? [ReturnStatement<null, NodeData<L, K>>, Tail<T>]
  : ParseExpression<T> extends infer G
  ? G extends Array<any>
    ? G[0] extends Node<NodeData<any, infer K>>
      ? [ReturnStatement<G[0], NodeData<L, K>>, G[1]]
      : G
    : never
  : never;

type ParseReturnStatement<
  T extends Array<Token<any>>,
  F extends boolean,
> = T[0] extends SymbolToken<'return', TokenData<any, infer L>>
  ? F extends true
    ? T[1] extends Token<TokenData<infer P, any>, any>
      ? P extends false
        ? ParseReturnStatementHelper<Tail<T>, L>
        : [ReturnStatement<null, NodeData<L, L>>, Tail<T>]
      : [ReturnStatement<null, NodeData<L, L>>, []]
    : SyntaxError<
        "A 'return' statement can only be used within a function body.",
        L
      >
  : null;

type ParseIfStatementHelper<
  G extends Array<any>,
  L extends number,
  F extends boolean,
> = G[1] extends Array<any>
  ? G[1][0] extends GenericToken<')', any>
    ? G[1][1] extends GenericToken<'{', TokenData<any, infer H>>
      ? ParseBlockStatement<TailBy<G[1], 2>, H, F> extends infer B
        ? B extends Array<any>
          ? B[0] extends Node<NodeData<any, infer E>>
            ? [IfStatement<G[0], B[0], NodeData<L, E>>, B[1]]
            : never
          : B
        : never
      : SyntaxError<"'{' expected.", 1>
    : SyntaxError<"')' expected.", 1>
  : never;

type ParseStatementHelper<
  T extends Array<Token<any>>,
  F extends boolean,
> = ParseFunctionDeclaration<T> extends infer P
  ? P extends Array<any>
    ? [...P, false]
    : P extends Error<any, any, any>
    ? P
    : ParseVariableDeclaration<T> extends infer P
    ? P extends Array<any>
      ? [...P, true]
      : P extends Error<any, any, any>
      ? P
      : ParseIfStatement<T, F> extends infer P
      ? P extends Array<any>
        ? [...P, false]
        : P extends Error<any, any, any>
        ? P
        : ParseReturnStatement<T, F> extends infer P
        ? P extends Array<any>
          ? [...P, true]
          : P extends Error<any, any, any>
          ? P
          : ParseExpressionStatement<T> extends infer P
          ? P extends Array<any>
            ? [...P, true]
            : P extends Error<any, any, any>
            ? P
            : SyntaxError<'Declaration or statement expected.', 1>
          : never
        : never
      : never
    : never
  : never;

export type Parse<T extends Array<Token<any>>> = ParseTopLevel<T>;
