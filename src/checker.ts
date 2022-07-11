// import type {
//   AnyTypeAnnotation,
//   ArrayExpression,
//   BlockStatement,
//   BooleanLiteral,
//   BooleanTypeAnnotation,
//   CallExpression,
//   ExpressionStatement,
//   FunctionDeclaration,
//   GenericTypeAnnotation,
//   Identifier,
//   IfStatement,
//   MemberExpression,
//   NullLiteral,
//   NullLiteralTypeAnnotation,
//   NumberTypeAnnotation,
//   NumericLiteral,
//   ObjectExpression,
//   ObjectProperty,
//   ReturnStatement,
//   StringLiteral,
//   StringTypeAnnotation,
//   TypeAnnotation,
//   VariableDeclaration,
//   VariableDeclarator,
// } from './ast';
// import type {
//   AnyType,
//   ArrayType,
//   BooleanType,
//   FunctionType,
//   GenericType,
//   NullType,
//   NumberType,
//   ObjectType,
//   StringType,
//   UnknownType,
//   VoidType,
// } from './types';
// import type { Concat, Reverse, Tail, Unshift } from './utils/arrayUtils';
// import type { Cast, MergeWithOverride } from './utils/generalUtils';

import type {
  AnyTypeAnnotation,
  ArrayExpression,
  BlockStatement,
  BooleanLiteral,
  BooleanTypeAnnotation,
  CallExpression,
  ExpressionStatement,
  FunctionDeclaration,
  Identifier,
  MemberExpression,
  Node,
  NodeData,
  NullLiteral,
  NullLiteralTypeAnnotation,
  NumberTypeAnnotation,
  NumericLiteral,
  ObjectExpression,
  ObjectProperty,
  ReturnStatement,
  StringLiteral,
  StringTypeAnnotation,
  TypeAnnotation,
  VariableDeclaration,
  VariableDeclarator,
} from './ast';
import type { Error, SyntaxError } from './errors';
import type {
  AnyType,
  ArrayType,
  BooleanLiteralType,
  BooleanType,
  FunctionType,
  NullType,
  NumberLiteralType,
  NumberType,
  ObjectType,
  StaticType,
  StringLiteralType,
  StringType,
  UnknownType,
  VoidType,
} from './types';
import type { Push, Tail } from './utils/arrayUtils';
import type { MergeWithOverride } from './utils/generalUtils';

export type Check<
  T extends Array<Node<any>>,
  S extends {} = {},
  R extends Array<any> = [],
> = T extends []
  ? R
  : T[0] extends ExpressionStatement<any, any>
  ? InferExpressionStatement<T[0], S> extends infer G
    ? G extends Array<any>
      ? Check<Tail<T>, G[1], R>
      : Check<Tail<T>, S, Push<R, G>>
    : never
  : T[0] extends VariableDeclaration<any, any, any>
  ? InferVariableDeclaration<T[0], S> extends infer G
    ? G extends Array<any>
      ? Check<Tail<T>, G[1], R>
      : Check<Tail<T>, S, Push<R, G>>
    : never
  : T[0] extends FunctionDeclaration<any, any, any, any>
  ? InferFunctionDeclaration<T[0], S> extends infer G
    ? G extends Array<any>
      ? Check<Tail<T>, G[1], R>
      : Check<Tail<T>, S, Push<R, G>>
    : never
  : never;

type MapAnnotationToType<A extends Node<any>> =
  A extends StringTypeAnnotation<any>
    ? StringType
    : A extends NumberTypeAnnotation<any>
    ? NumberType
    : A extends BooleanTypeAnnotation<any>
    ? BooleanType
    : A extends NullLiteralTypeAnnotation<any>
    ? NullType
    : A extends AnyTypeAnnotation<any>
    ? AnyType
    : never;

type InferFunctionParams<
  T extends Array<Node<any>>,
  S extends {},
  R extends Array<StaticType> = [],
  H extends Record<string, StaticType> = {},
> = T extends []
  ? [R, H, S]
  : T[0] extends Identifier<infer N, infer K, any>
  ? K extends TypeAnnotation<infer V, any>
    ? InferFunctionParamsHelper<T, S, R, H, MapAnnotationToType<V>, N>
    : InferFunctionParamsHelper<T, S, R, H, AnyType, N>
  : never;

type InferFunctionParamsHelper<
  T extends Array<Node<any>>,
  S extends {},
  R extends Array<StaticType>,
  H extends Record<string, StaticType>,
  V extends StaticType,
  N extends string,
> = InferFunctionParams<
  Tail<T>,
  S,
  Push<R, V>,
  MergeWithOverride<H, { [a in N]: V }>
>;

type InferFunctionDeclaration<
  O extends FunctionDeclaration<any, any, any, any>,
  S extends {},
> = O extends FunctionDeclaration<
  Identifier<infer N, any, NodeData<infer L, any>>,
  infer P,
  BlockStatement<infer B, any>,
  any
>
  ? InferFunctionParams<P, S> extends infer H
    ? H extends Array<any>
      ? InferBlockStatement<B, MergeWithOverride<S, H[1]>> extends infer G
        ? G extends Array<any>
          ? [null, MergeWithOverride<S, { [a in N]: FunctionType<H[0], G[0]> }>]
          : G
        : never
      : H
    : never
  : never;

type InferBlockStatement<
  T extends Array<Node<any>>,
  S extends {} = {},
  R extends StaticType = VoidType,
> = T extends []
  ? [R, S]
  : T[0] extends ExpressionStatement<any, any>
  ? InferExpressionStatement<T[0], S> extends infer G
    ? G extends Array<any>
      ? InferBlockStatement<Tail<T>, G[1], R>
      : G
    : never
  : T[0] extends VariableDeclaration<any, any, any>
  ? InferVariableDeclaration<T[0], S> extends infer G
    ? G extends Array<any>
      ? InferBlockStatement<Tail<T>, G[1], R>
      : G
    : never
  : T[0] extends ReturnStatement<infer F, any>
  ? F extends Node<any>
    ? InferExpression<F, S> extends infer G
      ? G extends Array<any>
        ? InferBlockStatement<[], G[1], G[0]>
        : G
      : never
    : InferBlockStatement<Tail<T>, S, VoidType>
  : never;

type MatchType<A extends StaticType, B extends StaticType> = A extends AnyType
  ? true
  : B extends AnyType
  ? true
  : A extends B
  ? B extends A
    ? true
    : false
  : A extends StringType
  ? B extends StringLiteralType<any>
    ? true
    : false
  : A extends BooleanType
  ? B extends BooleanLiteralType<any>
    ? true
    : false
  : A extends NumberType
  ? B extends NumberLiteralType<any>
    ? true
    : false
  : false;

type MatchTypeArrays<
  T extends Array<StaticType>,
  H extends Array<StaticType>,
  L extends number,
> = T extends []
  ? true
  : MatchType<T[0], H[0]> extends true
  ? MatchTypeArrays<Tail<T>, Tail<H>, L>
  : SyntaxError<
      `Argument of type '...' is not assignable to parameter of type '...'.`,
      L
    >;

type InferVariableDeclaration<
  O extends VariableDeclaration<any, any, any>,
  S extends {},
> = O extends VariableDeclaration<
  [
    VariableDeclarator<
      Identifier<infer N, infer T, NodeData<infer L, any>>,
      infer I,
      any
    >,
  ],
  any,
  any
>
  ? InferExpression<I, S> extends infer G
    ? G extends Array<any>
      ? T extends TypeAnnotation<infer T, any>
        ? MapAnnotationToType<T> extends infer P
          ? P extends StaticType
            ? MatchType<P, G[0]> extends true
              ? [null, MergeWithOverride<S, { [a in N]: P }>]
              : SyntaxError<`Type '...' is not assignable to type '...'.`, L>
            : never
          : never
        : [null, MergeWithOverride<S, { [a in N]: G[0] }>]
      : G
    : never
  : never;

type InferExpressionStatement<
  O extends ExpressionStatement<any, any>,
  S extends {},
> = O extends ExpressionStatement<infer E, any>
  ? InferExpression<E, S> extends infer G
    ? G extends Array<any>
      ? [null, S]
      : G
    : never
  : never;

type InferExpression<
  T extends Node<any>,
  S extends {},
> = T extends StringLiteral<infer I, any>
  ? [StringLiteralType<I>, S]
  : T extends NumericLiteral<infer I, any>
  ? [NumberLiteralType<I>, S]
  : T extends NullLiteral<any>
  ? [NullType, S]
  : T extends BooleanLiteral<infer I, any>
  ? [BooleanLiteralType<I>, S]
  : T extends Identifier<infer N, any, NodeData<infer I, any>>
  ? N extends keyof S
    ? [S[N], S]
    : SyntaxError<`Cannot find name '${N}'.`, I>
  : T extends ObjectExpression<infer O, any>
  ? InferObjectProperties<O, S>
  : T extends MemberExpression<infer O, infer P, infer C, any>
  ? InferMemberExpression<O, P, C, S>
  : T extends ArrayExpression<infer T, any>
  ? InferArrayElements<T, S>
  : T extends CallExpression<infer C, infer A, any>
  ? InferCallExpression<C, A, S>
  : UnknownType;

type InferCallExpression<
  C extends Node<any>,
  A extends Array<Node<any>>,
  S extends {},
> = C extends Node<NodeData<infer L, any>>
  ? InferExpression<C, S> extends infer G
    ? G extends Array<any>
      ? G[0] extends FunctionType<infer P, infer R>
        ? InferExpressionsArray<A, S> extends infer H
          ? H extends Array<any>
            ? InferCallExpressionHelper<P, H[0], R, S, L>
            : H
          : never
        : SyntaxError<
            `This expression is not callable. Type '...' has no call signatures.`,
            L
          >
      : G
    : never
  : never;

type InferCallExpressionHelper<
  P extends Array<StaticType>,
  H extends Array<StaticType>,
  R extends StaticType,
  S extends {},
  L extends number,
> = P['length'] extends H['length']
  ? MatchTypeArrays<P, H, L> extends infer W
    ? W extends true
      ? [R, S]
      : W
    : never
  : SyntaxError<
      `Expected ${P['length']} arguments, but got ${H['length']}.`,
      L
    >;

type InferExpressionsArray<
  T extends Array<Node<any>>,
  S extends {},
  R extends Array<StaticType> = [],
> = T extends []
  ? [R, S]
  : InferExpression<T[0], S> extends infer H
  ? H extends Array<any>
    ? InferExpressionsArray<Tail<T>, MergeWithOverride<S, H[1]>, Push<R, H[0]>>
    : H
  : never;

type InferArrayElements<
  T extends Array<Node<any>>,
  S extends {},
  R extends StaticType = AnyType,
> = T extends []
  ? [ArrayType<R>, S]
  : T[0] extends Node<any>
  ? InferExpression<T[0], S> extends infer J
    ? J extends Array<any>
      ? InferArrayElements<Tail<T>, S, J[0]>
      : J
    : never
  : never;

type InferMemberExpression<
  O extends Node<any>,
  P extends Node<any>,
  C extends boolean,
  S extends {},
> = InferExpression<O, S> extends infer J
  ? J extends Array<any>
    ? C extends false
      ? P extends Identifier<infer N, any, NodeData<infer L, any>>
        ? InferMemberExpressionHelper<J[0], N, S, L>
        : never
      : InferExpression<P, S> extends infer G
      ? P extends Node<NodeData<infer L, any>>
        ? G extends Array<any>
          ? G[0] extends StringLiteralType<infer N>
            ? InferMemberExpressionHelper<J[0], N, S, L>
            : SyntaxError<`Type '{}' cannot be used as an index type.`, L>
          : G extends null
          ? never
          : G
        : never
      : never
    : J
  : never;

type InferMemberExpressionHelper<
  O extends ObjectType<any>,
  N extends string,
  S extends {},
  L extends number,
> = O extends ObjectType<infer Y>
  ? N extends keyof Y
    ? [Y[N], S]
    : SyntaxError<`Property '${N}' does not exist on type '{}'.`, L>
  : SyntaxError<`Property '${N}' does not exist on type '...'.`, L>;

type InferObjectProperties<
  T extends Array<ObjectProperty<any, any, any>>,
  S extends {},
  R extends {} = {},
> = T extends []
  ? [ObjectType<R>, S]
  : T[0] extends ObjectProperty<Identifier<infer K, any, any>, infer V, any>
  ? InferExpression<V, S> extends infer J
    ? J extends Array<any>
      ? InferObjectProperties<Tail<T>, S, R & { [a in K]: J[0] }>
      : J
    : never
  : never;

//   : T extends ArrayExpression<infer T>
//   ? ArrayType<InferArrayElements<Cast<T, Array<any>>, S>>
//   : T extends ObjectExpression<infer T>
//   ? ObjectType<InferObjectValues<Cast<T, Array<any>>, S>>
//   : T extends CallExpression<infer K, infer A>
//   ? InferCallArguments<Cast<A, Array<any>>, S> extends infer O
//     ? InferExpression<K, S> extends infer I
//       ? I extends FunctionType<infer P, infer R>
//         ? AssignableArgumentTypes<
//             Cast<P, Array<any>>,
//             Cast<O, Array<any>>
//           > extends true
//           ? R
//           : never
//         : never
//       : never
//     : never
//   : T extends MemberExpression<infer O, Identifier<infer P>>
//   ? InferExpression<O, S> extends infer D
//     ? D extends ObjectType<infer Y>
//       ? P extends keyof Y
//         ? Y[P]
//         : never
//       : D extends StringType
//       ? P extends 'length'
//         ? NumberType
//         : never
//       : D extends NumberType
//       ? P extends 'toString'
//         ? FunctionType<[], StringType>
//         : never
//       : never
//     : never
//   : UnknownType;

// type InferArrayElements<
//   T extends Array<any>,
//   S extends {},
//   R extends Array<any> = [],
// > = T extends []
//   ? R
//   : InferArrayElements<Tail<T>, S, Unshift<R, InferExpression<T[0], S>>>;

// type InferObjectValues<
//   T extends Array<any>,
//   S extends {},
//   R extends {} = {},
// > = T extends []
//   ? R
//   : T[0] extends ObjectProperty<Identifier<infer G>, infer K>
//   ? InferObjectValues<
//       Tail<T>,
//       S,
//       MergeWithOverride<R, { [a in Cast<G, string>]: InferExpression<K, S> }>
//     >
//   : never;

// type InferCallArguments<
//   T extends Array<any>,
//   S extends {},
//   R extends Array<any> = [],
// > = T extends []
//   ? Reverse<R>
//   : InferCallArguments<Tail<T>, S, Unshift<R, InferExpression<T[0], S>>>;

// type AssignableTypes<A, B> = A extends AnyType
//   ? true
//   : B extends A
//   ? true
//   : false;

// type AssignableArgumentTypes<
//   I extends Array<any>,
//   P extends Array<any>,
// > = I extends []
//   ? P extends []
//     ? true
//     : false
//   : AssignableTypes<I[0], P[0]> extends false
//   ? false
//   : AssignableArgumentTypes<Tail<I>, Tail<P>>;

// type InferExpression<T, S extends {}> = T extends StringLiteral<any>
//   ? StringType
//   : T extends NumericLiteral<any>
//   ? NumberType
//   : T extends NullLiteral
//   ? NullType
//   : T extends BooleanLiteral<any>
//   ? BooleanType
//   : T extends Identifier<infer N>
//   ? N extends keyof S
//     ? S[N]
//     : never
//   : T extends ArrayExpression<infer T>
//   ? ArrayType<InferArrayElements<Cast<T, Array<any>>, S>>
//   : T extends ObjectExpression<infer T>
//   ? ObjectType<InferObjectValues<Cast<T, Array<any>>, S>>
//   : T extends CallExpression<infer K, infer A>
//   ? InferCallArguments<Cast<A, Array<any>>, S> extends infer O
//     ? InferExpression<K, S> extends infer I
//       ? I extends FunctionType<infer P, infer R>
//         ? AssignableArgumentTypes<
//             Cast<P, Array<any>>,
//             Cast<O, Array<any>>
//           > extends true
//           ? R
//           : never
//         : never
//       : never
//     : never
//   : T extends MemberExpression<infer O, Identifier<infer P>>
//   ? InferExpression<O, S> extends infer D
//     ? D extends ObjectType<infer Y>
//       ? P extends keyof Y
//         ? Y[P]
//         : never
//       : D extends StringType
//       ? P extends 'length'
//         ? NumberType
//         : never
//       : D extends NumberType
//       ? P extends 'toString'
//         ? FunctionType<[], StringType>
//         : never
//       : never
//     : never
//   : UnknownType;

// type MapTypeAnnotationToType<A> = A extends StringTypeAnnotation
//   ? StringType
//   : A extends NumberTypeAnnotation
//   ? NumberType
//   : A extends BooleanTypeAnnotation
//   ? BooleanType
//   : A extends NullLiteralTypeAnnotation
//   ? NullType
//   : A extends AnyTypeAnnotation
//   ? AnyType
//   : A extends GenericTypeAnnotation<infer I>
//   ? GenericType<I>
//   : never;

// type InferFunctionParams<
//   T extends Array<any>,
//   R extends Array<any> = [],
//   G = {},
// > = T extends []
//   ? [Reverse<R>, G]
//   : T[0] extends Identifier<infer N, TypeAnnotation<infer V>>
//   ? InferFunctionParams<
//       Tail<T>,
//       Unshift<R, MapTypeAnnotationToType<V>>,
//       MergeWithOverride<
//         G,
//         { [a in Cast<N, string>]: MapTypeAnnotationToType<V> }
//       >
//     >
//   : never;

// type InferBlock<
//   T extends Array<any>,
//   S extends {},
//   R extends Array<any> = [],
// > = T extends []
//   ? Unshift<R, VoidType>
//   : T[0] extends ReturnStatement<infer E>
//   ? InferExpression<E, S> extends infer G
//     ? G extends Array<any>
//       ? Concat<R, Cast<G, Array<any>>>
//       : Unshift<R, G>
//     : never
//   : T[0] extends VariableDeclaration<
//       [VariableDeclarator<Identifier<infer N>, infer I>],
//       any
//     >
//   ? InferBlock<
//       Tail<T>,
//       MergeWithOverride<S, { [a in Cast<N, string>]: InferExpression<I, S> }>,
//       R
//     >
//   : T[0] extends FunctionDeclaration<
//       Identifier<infer I>,
//       infer P,
//       BlockStatement<infer B>
//     >
//   ? InferFunctionParams<Cast<P, Array<any>>> extends infer O
//     ? InferBlock<
//         Tail<T>,
//         MergeWithOverride<
//           S,
//           {
//             [a in Cast<I, string>]: FunctionType<
//               Cast<O, Array<any>>[0],
//               InferBlock<
//                 Cast<B, Array<any>>,
//                 MergeWithOverride<S, Cast<O, Array<any>>[1]>
//               >
//             >;
//           }
//         >,
//         R
//       >
//     : never
//   : T[0] extends IfStatement<any, BlockStatement<infer C>>
//   ? InferBlock<Cast<C, Array<any>>, S> extends infer J
//     ? Concat<R, Cast<J, Array<any>>> extends infer G
//       ? InferBlock<Tail<T>, S, Cast<G, Array<any>>>
//       : never
//     : never
//   : InferBlock<Tail<T>, S, R>;

// type CheckBlock<
//   T extends Array<any>,
//   S extends {} = {},
// > = T[0] extends ExpressionStatement<infer E>
//   ? InferExpression<E, S>
//   : T[0] extends BlockStatement<infer B>
//   ? InferBlock<Cast<B, Array<any>>, S>
//   : [];
