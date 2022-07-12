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
import type { SyntaxError } from './errors';
import type { Serialize } from './serializer';
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
  UnionType,
  UnknownType,
  VoidType,
} from './types';
import type { Includes, Push, Tail, Uniq } from './utils/arrayUtils';
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
      `Argument of type '${Serialize<
        H[0]
      >}' is not assignable to parameter of type '${Serialize<T[0]>}'.`,
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
              : SyntaxError<
                  `Type '${Serialize<
                    G[0]
                  >}' is not assignable to type '${Serialize<P>}'.`,
                  L
                >
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
            `This expression is not callable. Type '${Serialize<
              G[0]
            >}' has no call signatures.`,
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
      ? MapLiteralToType<J[0]> extends infer E
        ? E extends StaticType
          ? InferArrayElementsHelper<R, E> extends infer U
            ? U extends StaticType
              ? InferArrayElements<Tail<T>, J[1], U>
              : never
            : never
          : never
        : never
      : J
    : never
  : never;

type InferArrayElementsHelper<
  R extends StaticType,
  E extends StaticType,
> = R extends AnyType
  ? E
  : R extends E
  ? E
  : R extends UnionType<infer U>
  ? E extends UnionType<infer I>
    ? UnionType<Uniq<[...U, ...I]>>
    : Includes<U, E> extends true
    ? R
    : UnionType<Push<U, E>>
  : E extends UnionType<infer U>
  ? UnionType<Push<U, R>>
  : UnionType<[R, E]>;

type MapLiteralToType<T extends StaticType> = T extends NumberLiteralType<any>
  ? NumberType
  : T extends StringLiteralType<any>
  ? StringType
  : T extends BooleanLiteralType<any>
  ? BooleanType
  : T extends ObjectType<infer O>
  ? ObjectType<{
      [P in keyof O]: O[P] extends StaticType ? MapLiteralToType<O[P]> : never;
    }>
  : T;

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
            : G[0] extends NumberLiteralType<infer N>
            ? InferMemberExpressionHelper<J[0], N, S, L>
            : SyntaxError<
                `Type '${Serialize<G[0]>}' cannot be used as an index type.`,
                L
              >
          : G extends null
          ? never
          : G
        : never
      : never
    : J
  : never;

type InferMemberExpressionHelper<
  O extends StaticType,
  N extends string,
  S extends {},
  L extends number,
> = O extends ObjectType<infer V>
  ? N extends keyof V
    ? [V[N], S]
    : SyntaxError<`Property '${N}' does not exist on type '{}'.`, L>
  : O extends ArrayType<infer V>
  ? [V, S]
  : O extends UnionType<infer U>
  ? InferMemberExpressionUnionHelper<U, N, S, L>
  : SyntaxError<`Property '${N}' does not exist on type '...'.`, L>;

type InferMemberExpressionUnionHelper<
  U extends Array<StaticType>,
  N extends string,
  S extends {},
  L extends number,
  R extends Array<any> = [],
> = U extends []
  ? [UnionType<R>, S]
  : InferMemberExpressionHelper<U[0], N, S, L> extends infer H
  ? H extends Array<any>
    ? InferMemberExpressionUnionHelper<Tail<U>, N, H[1], L, Push<R, H[0]>>
    : H
  : never;

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
