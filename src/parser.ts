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
  TokenData,
} from './tokens';
import type { Push, Tail, TailBy } from './utils/arrayUtils';
import type { IsNever } from './utils/generalUtils';

// type Wrap<T extends [any, Array<Token<any>>]> = T[1][0] extends DotToken
//   ? T[1][1] extends SymbolToken<infer V>
//     ? Wrap<[MemberExpression<T[0], Identifier<V>>, Tail<Tail<T[1]>>]>
//     : T
//   : T[1][0] extends ParenToken<'('>
//   ? ParseFunctionArguments<Tail<T[1]>> extends infer G
//     ? Wrap<
//         [CallExpression<T[0], Cast<G, Array<any>>[0]>, Cast<G, Array<any>>[1]]
//       >
//     : never
//   : T;

// type DoParseExpression<
//   T extends Array<Token<any>>,
//   F = T[0],
// > = F extends SymbolToken<'true'>
//   ? [BooleanLiteral<true>, Tail<T>]
//   : F extends SymbolToken<'false'>
//   ? [BooleanLiteral<false>, Tail<T>]
//   : F extends SymbolToken<'null'>
//   ? [NullLiteral, Tail<T>]
//   : F extends NumberToken<infer V>
//   ? [NumericLiteral<V>, Tail<T>]
//   : F extends StringToken<infer V>
//   ? [StringLiteral<V>, Tail<T>]
//   : F extends BracketToken<'['>
//   ? ParseArray<Tail<T>>
//   : F extends CurlyToken<'{'>
//   ? ParseObject<Tail<T>>
//   : F extends SymbolToken<infer V>
//   ? [Identifier<V>, Tail<T>]
//   : [never, []];

// type ParseExpression<T extends Array<Token<any>>> =
//   DoParseExpression<T> extends infer G
//     ? Wrap<Cast<G, [any, Array<any>]>>
//     : never;

// type ParseStatement<
//   T extends Array<Token<any>>,
//   F = T[0],
// > = F extends SymbolToken<'const'>
//   ? ParseVariableDeclaration<Tail<T>>
//   : F extends SymbolToken<'function'>
//   ? ParseFunctionDeclaration<Tail<T>>
//   : F extends SymbolToken<'if'>
//   ? ParseIfStatement<Tail<T>>
//   : ParseExpression<T> extends infer G
//   ? [ExpressionStatement<Cast<G, Array<any>>[0]>, Cast<G, Array<any>>[1]]
//   : never;

// type ParseFunctionStatement<T extends Array<Token<any>>> =
//   T[0] extends SymbolToken<'return'>
//     ? ParseExpression<Tail<T>> extends infer G
//       ? [ReturnStatement<Cast<G, Array<any>>[0]>, Cast<G, Array<any>>[1]]
//       : never
//     : ParseStatement<T>;

// type ParseIfStatement<T extends Array<Token<any>>> =
//   T[0] extends ParenToken<'('>
//     ? ParseExpression<Tail<T>> extends infer G
//       ? Cast<G, Array<any>>[1] extends infer J
//         ? Cast<J, Array<any>>[0] extends ParenToken<')'>
//           ? Cast<J, Array<any>>[1] extends CurlyToken<'{'>
//             ? ParseBlockStatement<
//                 Tail<Tail<Cast<J, Array<any>>>>
//               > extends infer B
//               ? [
//                   IfStatement<Cast<G, Array<any>>[0], Cast<B, Array<any>>[0]>,
//                   Cast<B, Array<any>>[1],
//                 ]
//               : never
//             : never
//           : never
//         : never
//       : never
//     : never;

// type ParseFunctionArguments<
//   T extends Array<Token<any>>,
//   R extends Array<any> = [],
//   N extends boolean = false,
// > = T[0] extends ParenToken<')'>
//   ? [Reverse<R>, Tail<T>]
//   : T extends []
//   ? never
//   : N extends true
//   ? T[0] extends CommaToken
//     ? ParseFunctionArgumentsItem<Tail<T>, R>
//     : never
//   : ParseFunctionArgumentsItem<T, R>;

// type ParseFunctionArgumentsItem<
//   T extends Array<Token<any>>,
//   R extends Array<any> = [],
// > = ParseExpression<T> extends infer G
//   ? ParseFunctionArguments<
//       Cast<G, Array<any>>[1],
//       Unshift<R, Cast<G, Array<any>>[0]>,
//       true
//     >
//   : never;

// type ParseFunctionDeclaration<T extends Array<Token<any>>> =
//   T[0] extends SymbolToken<infer I>
//     ? T[1] extends ParenToken<'('>
//       ? ParseFunctionParams<Tail<Tail<T>>> extends infer G
//         ? ParseBlockStatement<Cast<G, Array<any>>[1]> extends infer H
//           ? [
//               FunctionDeclaration<
//                 Identifier<I>,
//                 Cast<G, Array<any>>[0],
//                 Cast<H, Array<any>>[0]
//               >,
//               Cast<H, Array<any>>[1],
//             ]
//           : never
//         : never
//       : never
//     : never;

// type ParseBlockStatement<
//   T extends Array<Token<any>>,
//   R extends Array<any> = [],
// > = T[0] extends CurlyToken<'}'>
//   ? [BlockStatement<Reverse<R>>, Tail<T>]
//   : ParseFunctionStatement<T> extends infer F
//   ? ParseBlockStatement<
//       Cast<F, Array<any>>[1],
//       Unshift<R, Cast<F, Array<any>>[0]>
//     >
//   : never;

// type ParseFunctionParams<
//   T extends Array<Token<any>>,
//   R extends Array<any> = [],
//   N extends boolean = false,
// > = T[0] extends ParenToken<')'>
//   ? T[1] extends CurlyToken<'{'>
//     ? [Reverse<R>, Tail<Tail<T>>]
//     : never
//   : T extends []
//   ? never
//   : N extends true
//   ? T[0] extends CommaToken
//     ? ParseFunctionParamsItem<Tail<T>, R>
//     : never
//   : ParseFunctionParamsItem<T, R>;

// type ParseTypeAnnotation<T extends Array<Token<any>>> =
//   T[0] extends SymbolToken<'string'>
//     ? [TypeAnnotation<StringTypeAnnotation>, Tail<T>]
//     : T[0] extends SymbolToken<'boolean'>
//     ? [TypeAnnotation<BooleanTypeAnnotation>, Tail<T>]
//     : T[0] extends SymbolToken<'null'>
//     ? [TypeAnnotation<NullLiteralTypeAnnotation>, Tail<T>]
//     : T[0] extends SymbolToken<'number'>
//     ? [TypeAnnotation<NumberTypeAnnotation>, Tail<T>]
//     : T[0] extends SymbolToken<'any'>
//     ? [TypeAnnotation<AnyTypeAnnotation>, Tail<T>]
//     : T[0] extends SymbolToken<infer E>
//     ? [TypeAnnotation<GenericTypeAnnotation<E>>, Tail<T>]
//     : never;

// type ParseFunctionParamsItem<
//   T extends Array<Token<any>>,
//   R extends Array<any> = [],
// > = T[0] extends SymbolToken<infer V>
//   ? T[1] extends ColonToken
//     ? ParseTypeAnnotation<Tail<Tail<T>>> extends infer G
//       ? ParseFunctionParams<
//           Cast<G, Array<any>>[1],
//           Unshift<R, Identifier<V, Cast<G, Array<any>>[0]>>,
//           true
//         >
//       : never
//     : ParseFunctionParams<Tail<T>, Unshift<R, Identifier<V>>, true>
//   : never;

// type ParseVariableDeclarationHelper<
//   T extends Array<Token<any>>,
//   K,
//   Q = null,
// > = ParseExpression<T> extends infer G
//   ? [
//       VariableDeclaration<
//         [VariableDeclarator<Identifier<K, Q>, Cast<G, Array<any>>[0]>],
//         'const'
//       >,
//       Cast<G, Array<any>>[1],
//     ]
//   : never;

// type ParseVariableDeclaration<T extends Array<Token<any>>> =
//   T[0] extends SymbolToken<infer K>
//     ? T[1] extends ColonToken
//       ? ParseTypeAnnotation<Tail<Tail<T>>> extends infer G
//         ? Cast<G, Array<any>>[1][0] extends SymbolToken<'='>
//           ? Cast<G, Array<any>>[1] extends infer J
//             ? ParseVariableDeclarationHelper<
//                 Tail<Cast<J, Array<any>>>,
//                 K,
//                 Cast<G, Array<any>>[0]
//               >
//             : never
//           : never
//         : never
//       : T[1] extends SymbolToken<'='>
//       ? ParseVariableDeclarationHelper<Tail<Tail<T>>, K>
//       : never
//     : never;

// type ParseObject<
//   T extends Array<Token<any>>,
//   R extends Array<any> = [],
//   N extends boolean = false,
//   F extends Token<any> = T[0],
// > = F extends CurlyToken<'}'>
//   ? [ObjectExpression<Reverse<R>>, Tail<T>]
//   : T extends []
//   ? never
//   : N extends true
//   ? F extends CommaToken
//     ? ParseObjectItem<Tail<T>, R>
//     : never
//   : ParseObjectItem<T, R>;

// type ParseObjectItem<
//   T extends Array<Token<any>>,
//   R extends Array<any> = [],
// > = T[0] extends SymbolToken<infer K>
//   ? T[1] extends ColonToken
//     ? ParseExpression<Tail<Tail<T>>> extends infer G
//       ? ParseObject<
//           Cast<G, Array<any>>[1],
//           Unshift<R, ObjectProperty<Identifier<K>, Cast<G, Array<any>>[0]>>,
//           true
//         >
//       : never
//     : never
//   : never;

// type ParseArray<
//   T extends Array<Token<any>>,
//   R extends Array<any> = [],
//   N extends boolean = false,
//   F extends Token<any> = T[0],
// > = F extends BracketToken<']'>
//   ? [ArrayExpression<Reverse<R>>, Tail<T>]
//   : T extends []
//   ? never
//   : N extends true
//   ? F extends CommaToken
//     ? ParseArrayItem<Tail<T>, R>
//     : never
//   : ParseArrayItem<T, R>;

// type ParseArrayItem<
//   T extends Array<Token<any>>,
//   R extends Array<any> = [],
// > = ParseExpression<T> extends infer G
//   ? ParseArray<Cast<G, Array<any>>[1], Unshift<R, Cast<G, Array<any>>[0]>, true>
//   : never;

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
> = T[0] extends DotToken<TokenData<any, infer E>>
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
> = T[0] extends ParenToken<'(', TokenData<any, infer E>>
  ? ParseCallExpressionArguments<Tail<T>, E> extends infer G
    ? G extends Array<any>
      ? [CallExpression<O, G[0], NodeData<1, 1>>, G[1]]
      : G
    : never
  : null;

type ParseCallExpressionArguments<
  T extends Array<Token<any>>,
  E extends number,
  N extends boolean = false,
  R extends Array<Node<any>> = [],
> = T[0] extends ParenToken<')', any>
  ? [R, Tail<T>]
  : T extends []
  ? SyntaxError<"Parsing error: ')' expected.", E>
  : N extends true
  ? T[0] extends CommaToken<any>
    ? ParseCallExpressionArgumentsHelper<Tail<T>, E, R>
    : T[0] extends Token<TokenData<any, infer L>>
    ? SyntaxError<"Parsing error: ',' expected.", L>
    : never
  : ParseCallExpressionArgumentsHelper<T, E, R>;

type ParseCallExpressionArgumentsHelper<
  T extends Array<Token<any>>,
  E extends number,
  R extends Array<any> = [],
> = ParseExpression<T> extends infer G
  ? G extends Array<any>
    ? ParseCallExpressionArguments<G[1], E, true, Push<R, G[0]>>
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
> = ParseExpressionHelper<T, H, G> extends [infer O, infer T]
  ? O extends Node<any>
    ? T extends Array<Token<any>>
      ? CheckExpression<O, T>
      : never
    : never
  : null;

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
  : null;

type ParseExpressionStatement<T extends Array<Token<any>>> =
  ParseExpression<T> extends infer G
    ? G extends Array<any>
      ? G[0] extends Node<infer D>
        ? [ExpressionStatement<G[0], D>, G[1]]
        : never
      : G
    : never;

type ParseTopLevel<
  T extends Array<Token<any>>,
  R extends Array<Node<any>>,
  N extends boolean,
> = T extends []
  ? R
  : T[0] extends SemicolonToken<any>
  ? ParseTopLevel<Tail<T>, R, false>
  : N extends false
  ? ParseTopLevelHelper<T, R>
  : T[0] extends Token<TokenData<infer P, infer L>>
  ? P extends true
    ? ParseTopLevelHelper<T, R>
    : SyntaxError<"';' expected.", L>
  : never;

type ParseTopLevelHelper<
  T extends Array<Token<any>>,
  R extends Array<Node<any>>,
> = ParseVariableDeclaration<T> extends infer P
  ? P extends Array<any>
    ? ParseTopLevel<P[1], Push<R, P[0]>, true>
    : P extends Error<any, any, any>
    ? P
    : ParseExpressionStatement<T> extends infer P
    ? P extends Array<any>
      ? ParseTopLevel<P[1], Push<R, P[0]>, true>
      : P extends Error<any, any, any>
      ? P
      : never
    : never
  : never;

export type Parse<T extends Array<Token<any>>> = ParseTopLevel<T, [], false>;
