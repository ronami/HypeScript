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
  BaseNode,
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
import type { TypeError } from './errors';
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
import type { TypeResult } from './utils/utilityTypes';

export type Check<
  T extends Array<BaseNode<any>>,
  S extends Record<string, StaticType> = {},
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

type MapAnnotationToType<A extends BaseNode<any>> =
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
  T extends Array<BaseNode<any>>,
  R extends Array<[string, StaticType]> = [],
  H extends Record<string, StaticType> = {},
> = T extends []
  ? [R, H]
  : T[0] extends Identifier<infer N, infer K, any>
  ? K extends TypeAnnotation<infer V, any>
    ? InferFunctionParamsHelper<T, R, H, MapAnnotationToType<V>, N>
    : InferFunctionParamsHelper<T, R, H, AnyType, N>
  : never;

type InferFunctionParamsHelper<
  T extends Array<BaseNode<any>>,
  R extends Array<[string, StaticType]>,
  H extends Record<string, StaticType>,
  V extends StaticType,
  N extends string,
> = InferFunctionParams<
  Tail<T>,
  Push<R, [N, V]>,
  MergeWithOverride<H, { [a in N]: V }>
>;

type InferFunctionDeclaration<
  O extends FunctionDeclaration<any, any, any, any>,
  S extends Record<string, StaticType>,
> = O extends FunctionDeclaration<
  Identifier<infer N, any, NodeData<infer L, any>>,
  infer P,
  BlockStatement<infer B, any>,
  any
>
  ? InferFunctionParams<P> extends infer H
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
  T extends Array<BaseNode<any>>,
  S extends Record<string, StaticType> = {},
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
  ? F extends BaseNode<any>
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
  T extends Array<[string, StaticType]>,
  H extends Array<StaticType>,
  L extends number,
> = T extends []
  ? true
  : MatchType<T[0][1], H[0]> extends true
  ? MatchTypeArrays<Tail<T>, Tail<H>, L>
  : SyntaxError<
      `Argument of type '${Serialize<
        H[0]
      >}' is not assignable to parameter of type '${Serialize<T[0][1]>}'.`,
      L
    >;

type InferVariableDeclaration<
  O extends VariableDeclaration<any, any, any>,
  S extends Record<string, StaticType>,
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
  S extends Record<string, StaticType>,
> = O extends ExpressionStatement<infer E, any>
  ? InferExpression<E, S> extends infer G
    ? G extends Array<any>
      ? [null, S]
      : G
    : never
  : never;

type InferExpression<
  Node extends BaseNode<any>,
  State extends Record<string, StaticType>,
> = Node extends StringLiteral<infer Value, any>
  ? TypeResult<StringLiteralType<Value>, State>
  : Node extends NumericLiteral<infer Value, any>
  ? TypeResult<NumberLiteralType<Value>, State>
  : Node extends NullLiteral<any>
  ? TypeResult<NullType, State>
  : Node extends BooleanLiteral<infer Value, any>
  ? TypeResult<BooleanLiteralType<Value>, State>
  : Node extends Identifier<infer Name, any, NodeData<infer StartLine, any>>
  ? Name extends keyof State
    ? TypeResult<State[Name], State>
    : TypeResult<
        AnyType,
        State,
        [TypeError<`Cannot find name '${Name}'.`, StartLine>]
      >
  : Node extends ObjectExpression<infer Properties, any>
  ? InferObjectProperties<Properties, State>
  : Node extends MemberExpression<
      infer Object,
      infer Properties,
      infer Computed,
      any
    >
  ? InferMemberExpression<Object, Properties, Computed, State>
  : Node extends ArrayExpression<infer Elements, any>
  ? InferArrayElements<Elements, State>
  : Node extends CallExpression<infer Callee, infer Arguments, any>
  ? InferCallExpression<Callee, Arguments, State>
  : UnknownType;

type InferCallExpression<
  C extends BaseNode<any>,
  A extends Array<BaseNode<any>>,
  S extends Record<string, StaticType>,
> = C extends BaseNode<NodeData<infer L, any>>
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
  P extends Array<[string, StaticType]>,
  H extends Array<StaticType>,
  R extends StaticType,
  S extends Record<string, StaticType>,
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
  T extends Array<BaseNode<any>>,
  S extends Record<string, StaticType>,
  R extends Array<StaticType> = [],
> = T extends []
  ? [R, S]
  : InferExpression<T[0], S> extends infer H
  ? H extends Array<any>
    ? InferExpressionsArray<Tail<T>, MergeWithOverride<S, H[1]>, Push<R, H[0]>>
    : H
  : never;

type InferArrayElements<
  T extends Array<BaseNode<any>>,
  S extends Record<string, StaticType>,
  R extends StaticType = AnyType,
> = T extends []
  ? [ArrayType<R>, S]
  : T[0] extends BaseNode<any>
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
  O extends BaseNode<any>,
  P extends BaseNode<any>,
  C extends boolean,
  S extends Record<string, StaticType>,
> = InferExpression<O, S> extends infer J
  ? J extends Array<any>
    ? C extends false
      ? P extends Identifier<infer N, any, NodeData<infer L, any>>
        ? InferMemberExpressionHelper<J[0], N, S, L>
        : never
      : InferExpression<P, S> extends infer G
      ? P extends BaseNode<NodeData<infer L, any>>
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

type InferMemberExpressionObjectHelper<
  V extends Array<[string, StaticType]>,
  N extends string,
> = V extends []
  ? null
  : V[0][0] extends N
  ? V[0][1]
  : InferMemberExpressionObjectHelper<Tail<V>, N>;

type InferMemberExpressionHelper<
  O extends StaticType,
  N extends string,
  S extends Record<string, StaticType>,
  L extends number,
> = O extends ObjectType<infer V>
  ? InferMemberExpressionObjectHelper<V, N> extends infer I
    ? I extends null
      ? SyntaxError<
          `Property '${N}' does not exist on type '${Serialize<O>}'.`,
          L
        >
      : [I, S]
    : never
  : O extends ArrayType<infer V>
  ? [V, S]
  : O extends UnionType<infer U>
  ? InferMemberExpressionUnionHelper<U, N, S, L>
  : SyntaxError<`Property '${N}' does not exist on type '${Serialize<O>}'.`, L>;

type InferMemberExpressionUnionHelper<
  U extends Array<StaticType>,
  N extends string,
  S extends Record<string, StaticType>,
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
  S extends Record<string, StaticType>,
  R extends Array<any> = [],
> = T extends []
  ? [ObjectType<R>, S]
  : T[0] extends ObjectProperty<Identifier<infer K, any, any>, infer V, any>
  ? InferExpression<V, S> extends infer J
    ? J extends Array<any>
      ? InferObjectProperties<Tail<T>, S, Push<R, [K, J[0]]>>
      : J
    : never
  : never;
