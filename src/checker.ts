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
import type { Concat, Includes, Push, Tail, Uniq } from './utils/arrayUtils';
import type { MergeWithOverride } from './utils/generalUtils';
import type { StateType, TypeResult } from './utils/utilityTypes';

export type Check<
  T extends Array<BaseNode<any>>,
  S extends StateType = {},
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

type InferBlockStatement<
  NodeList extends Array<BaseNode<any>>,
  Result extends StaticType = VoidType,
  State extends StateType = {},
  Errors extends Array<TypeError<any, any>> = [],
> = NodeList extends []
  ? TypeResult<Result, State, Errors>
  : NodeList[0] extends ExpressionStatement<infer Expression, any>
  ? InferExpression<Expression, State> extends TypeResult<
      any,
      infer ExpressionState,
      infer ExpressionErrors
    >
    ? InferBlockStatement<
        Tail<NodeList>,
        Result,
        ExpressionState,
        Concat<Errors, ExpressionErrors>
      >
    : never
  : NodeList[0] extends VariableDeclaration<any, any, any>
  ? InferVariableDeclaration<NodeList[0], State> extends infer G
    ? G extends Array<any>
      ? InferBlockStatement<Tail<NodeList>, G[1], Result>
      : G
    : never
  : NodeList[0] extends ReturnStatement<infer ReturnExpression, any>
  ? InferExpression<ReturnExpression, State> extends TypeResult<
      infer ExpressionValue,
      infer ExpressionState,
      infer ExpressionErrors
    >
    ? InferBlockStatement<
        [],
        ExpressionValue,
        ExpressionState,
        Concat<Errors, ExpressionErrors>
      >
    : never
  : InferBlockStatement<Tail<NodeList>, VoidType, State, Errors>;

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
  H extends StateType = {},
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
  H extends StateType,
  V extends StaticType,
  N extends string,
> = InferFunctionParams<
  Tail<T>,
  Push<R, [N, V]>,
  MergeWithOverride<H, { [a in N]: V }>
>;

type InferFunctionDeclaration<
  O extends FunctionDeclaration<any, any, any, any>,
  S extends StateType,
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
  S extends StateType,
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
  S extends StateType,
> = O extends ExpressionStatement<infer E, any>
  ? InferExpression<E, S> extends infer G
    ? G extends Array<any>
      ? [null, S]
      : G
    : never
  : never;

type InferExpression<
  Node extends BaseNode<any>,
  State extends StateType,
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
      infer Property,
      infer Computed,
      any
    >
  ? InferMemberExpression<Object, Property, Computed, State>
  : Node extends ArrayExpression<infer Elements, any>
  ? InferArrayElements<Elements, State>
  : Node extends CallExpression<infer Callee, infer Arguments, any>
  ? InferCallExpression<Callee, Arguments, State>
  : UnknownType;

type InferCallExpression<
  C extends BaseNode<any>,
  A extends Array<BaseNode<any>>,
  S extends StateType,
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
  S extends StateType,
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
  S extends StateType,
  R extends Array<StaticType> = [],
> = T extends []
  ? [R, S]
  : InferExpression<T[0], S> extends infer H
  ? H extends Array<any>
    ? InferExpressionsArray<Tail<T>, MergeWithOverride<S, H[1]>, Push<R, H[0]>>
    : H
  : never;

type InferArrayElements<
  Elements extends Array<BaseNode<any>>,
  State extends StateType,
  Result extends StaticType = AnyType,
  Errors extends Array<TypeError<any, any>> = [],
> = Elements extends []
  ? TypeResult<ArrayType<Result>, State, Errors>
  : Elements[0] extends BaseNode<any>
  ? InferExpression<Elements[0], State> extends TypeResult<
      infer ExpressionValue,
      infer ExpressionState,
      infer ExpressionErrors
    >
    ? MapLiteralToType<ExpressionValue> extends infer E
      ? E extends StaticType
        ? InferArrayElementsHelper<Result, E> extends infer U
          ? U extends StaticType
            ? InferArrayElements<
                Tail<Elements>,
                ExpressionState,
                U,
                Concat<Errors, ExpressionErrors>
              >
            : never
          : never
        : never
      : never
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
  Object extends BaseNode<any>,
  Property extends BaseNode<any>,
  Computed extends boolean,
  State extends StateType,
> = InferExpression<Object, State> extends TypeResult<
  infer ObjectExpressionValue,
  infer ObjectExpressionState,
  infer ObjectExpressionErrors
>
  ? Computed extends false
    ? Property extends Identifier<
        infer Name,
        any,
        NodeData<infer StartLine, any>
      >
      ? InferMemberExpressionHelper<
          ObjectExpressionValue,
          Name,
          ObjectExpressionState,
          StartLine,
          ObjectExpressionErrors
        >
      : never
    : InferExpression<Property, ObjectExpressionState> extends TypeResult<
        infer PropertyExpressionValue,
        infer PropertyExpressionState,
        infer PropertyExpressionErrors
      >
    ? Property extends BaseNode<NodeData<infer StartLine, any>>
      ? PropertyExpressionValue extends StringLiteralType<infer Value>
        ? InferMemberExpressionHelper<
            ObjectExpressionValue,
            Value,
            PropertyExpressionState,
            StartLine,
            Concat<ObjectExpressionErrors, PropertyExpressionErrors>
          >
        : PropertyExpressionValue extends NumberLiteralType<infer Value>
        ? InferMemberExpressionHelper<
            ObjectExpressionValue,
            Value,
            PropertyExpressionState,
            StartLine,
            Concat<ObjectExpressionErrors, PropertyExpressionErrors>
          >
        : TypeResult<
            AnyType,
            PropertyExpressionState,
            Push<
              Concat<ObjectExpressionErrors, PropertyExpressionErrors>,
              TypeError<
                `Type '${Serialize<PropertyExpressionValue>}' cannot be used as an index type.`,
                StartLine
              >
            >
          >
      : never
    : never
  : never;

type GetObjectValueByKey<
  ObjectProperties extends Array<[string, StaticType]>,
  Key extends string,
> = ObjectProperties extends []
  ? null
  : ObjectProperties[0] extends [infer PropertyName, infer PropertyValue]
  ? PropertyName extends Key
    ? PropertyValue
    : GetObjectValueByKey<Tail<ObjectProperties>, Key>
  : never;

type InferMemberExpressionHelper<
  Object extends StaticType,
  Key extends string,
  State extends StateType,
  StartLine extends number,
  Errors extends Array<TypeError<any, any>>,
> = Object extends ObjectType<infer ObjectProperties>
  ? GetObjectValueByKey<
      ObjectProperties,
      Key
    > extends infer MemberExpressionValue
    ? MemberExpressionValue extends StaticType
      ? TypeResult<MemberExpressionValue, State, Errors>
      : TypeResult<
          NullType,
          State,
          Push<
            Errors,
            TypeError<
              `Property '${Key}' does not exist on type '${Serialize<Object>}'.`,
              StartLine
            >
          >
        >
    : never
  : Object extends ArrayType<infer ElementsType>
  ? TypeResult<ElementsType, State, Errors>
  : Object extends UnionType<infer UnionTypes>
  ? InferMemberExpressionUnionHelper<UnionTypes, Key, State, StartLine, Errors>
  : Object extends AnyType
  ? TypeResult<AnyType, State, Errors>
  : TypeError<
      `Property '${Key}' does not exist on type '${Serialize<Object>}'.`,
      StartLine
    >;

type InferMemberExpressionUnionHelper<
  UnionTypes extends Array<StaticType>,
  Key extends string,
  State extends StateType,
  StartLine extends number,
  Errors extends Array<TypeError<any, any>>,
  Result extends Array<any> = [],
> = UnionTypes extends []
  ? TypeResult<UnionType<Result>, State, Errors>
  : InferMemberExpressionHelper<
      UnionTypes[0],
      Key,
      State,
      StartLine,
      Errors
    > extends TypeResult<
      infer ExpressionValue,
      infer ExpressionState,
      infer ExpressionErrors
    >
  ? InferMemberExpressionUnionHelper<
      Tail<UnionTypes>,
      Key,
      ExpressionState,
      StartLine,
      Concat<Errors, ExpressionErrors>,
      Push<Result, ExpressionValue>
    >
  : never;

type InferObjectProperties<
  Properties extends Array<ObjectProperty<any, any, any>>,
  State extends StateType,
  Result extends Array<any> = [],
  Errors extends Array<TypeError<any, any>> = [],
> = Properties extends []
  ? TypeResult<ObjectType<Result>, State, Errors>
  : Properties[0] extends ObjectProperty<
      Identifier<infer Name, any, any>,
      infer Value,
      any
    >
  ? InferExpression<Value, State> extends TypeResult<
      infer ExpressionValue,
      infer ExpressionState,
      infer ExpressionErrors
    >
    ? InferObjectProperties<
        Tail<Properties>,
        ExpressionState,
        Push<Result, [Name, ExpressionValue]>,
        Concat<Errors, ExpressionErrors>
      >
    : never
  : never;
