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
  IfStatement,
} from './ast';
import type { TypeError } from './errors';
import type { Serialize } from './serializer';
import type {
  AnyType,
  ArrayType,
  BooleanLiteralType,
  BooleanType,
  CallArgumentsType,
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
import type {
  Concat,
  Includes,
  Push,
  Tail,
  Uniq,
  Unshift,
} from './utils/arrayUtils';
import type { MergeWithOverride } from './utils/generalUtils';
import type { StateType, TypeResult } from './utils/utilityTypes';

export type Check<NodeList extends Array<BaseNode<any>>> = InferBlockStatement<
  NodeList,
  {}
> extends TypeResult<any, any, infer Errors>
  ? Errors
  : never;

type InferBlockStatementHelper<
  TypeList extends Array<StaticType>,
  Result extends StaticType,
> = TypeList extends []
  ? Result
  : InferBlockStatementHelper<Tail<TypeList>, MergeTypes<TypeList[0], Result>>;

type MergeTypes<TypeA extends StaticType, TypeB extends StaticType> = MatchType<
  TypeA,
  TypeB
> extends true
  ? TypeA
  : MatchType<TypeB, TypeA> extends true
  ? TypeB
  : TypeA extends UnionType<infer UnionTypesA>
  ? TypeB extends UnionType<infer UnionTypesB>
    ? UnionType<[...UnionTypesA, ...UnionTypesB]>
    : UnionType<[...UnionTypesA, TypeB]>
  : TypeB extends UnionType<infer UnionTypesB>
  ? UnionType<[...UnionTypesB, TypeA]>
  : UnionType<[TypeA, TypeB]>;

type InferBlockStatement<
  NodeList extends Array<BaseNode<any>>,
  State extends StateType,
  Result extends Array<StaticType> = [],
  Errors extends Array<TypeError<any, any>> = [],
> = NodeList extends []
  ? InferBlockStatementHelper<Result, VoidType> extends infer ReturnType
    ? ReturnType extends StaticType
      ? TypeResult<ReturnType, State, Errors>
      : never
    : never
  : NodeList[0] extends ExpressionStatement<infer Expression, any>
  ? InferExpression<Expression, State> extends TypeResult<
      any,
      infer ExpressionState,
      infer ExpressionErrors
    >
    ? InferBlockStatement<
        Tail<NodeList>,
        ExpressionState,
        Result,
        Concat<Errors, ExpressionErrors>
      >
    : never
  : NodeList[0] extends VariableDeclaration<
      [
        VariableDeclarator<
          Identifier<
            infer Name,
            infer Annotation,
            NodeData<infer StartLine, any>
          >,
          infer Init,
          any
        >,
      ],
      any,
      any
    >
  ? InferVariableDeclaration<
      Name,
      Annotation,
      Init,
      State,
      StartLine
    > extends TypeResult<any, infer DeclarationState, infer DeclarationErrors>
    ? InferBlockStatement<
        Tail<NodeList>,
        DeclarationState,
        Result,
        Concat<Errors, DeclarationErrors>
      >
    : never
  : NodeList[0] extends FunctionDeclaration<
      Identifier<infer Name, any, any>,
      infer Params,
      BlockStatement<infer Body, any>,
      any
    >
  ? InferFunctionDeclaration<Name, Params, Body, State> extends TypeResult<
      any,
      infer DeclarationState,
      infer DeclarationErrors
    >
    ? InferBlockStatement<
        Tail<NodeList>,
        DeclarationState,
        Result,
        Concat<Errors, DeclarationErrors>
      >
    : never
  : NodeList[0] extends ReturnStatement<infer ReturnExpression, any>
  ? InferReturnStatement<ReturnExpression, State> extends TypeResult<
      infer ReturnValue,
      infer ReturnState,
      infer ReturnErrors
    >
    ? InferBlockStatementHelper<Result, ReturnValue> extends infer ReturnType
      ? ReturnType extends StaticType
        ? TypeResult<ReturnType, ReturnState, Concat<Errors, ReturnErrors>>
        : never
      : never
    : never
  : NodeList[0] extends IfStatement<
      any,
      BlockStatement<infer BlockBody, any>,
      any
    >
  ? InferBlockStatement<BlockBody, State> extends TypeResult<
      infer IfStatementValue,
      any,
      infer IfStatementErrors
    >
    ? InferBlockStatement<
        Tail<NodeList>,
        State,
        IfStatementValue extends VoidType
          ? Result
          : Push<Result, IfStatementValue>,
        Concat<Errors, IfStatementErrors>
      >
    : never
  : InferBlockStatement<Tail<NodeList>, State, Result, Errors>;

type InferReturnStatement<
  ReturnExpression extends BaseNode<any> | null,
  State extends StateType,
> = ReturnExpression extends BaseNode<any>
  ? InferExpression<ReturnExpression, State> extends TypeResult<
      infer ExpressionValue,
      infer ExpressionState,
      infer ExpressionErrors
    >
    ? TypeResult<
        MapLiteralToType<ExpressionValue>,
        ExpressionState,
        ExpressionErrors
      >
    : never
  : TypeResult<NullType, State>;

type MapAnnotationToType<AnnotationValue extends BaseNode<any>> =
  AnnotationValue extends StringTypeAnnotation<any>
    ? StringType
    : AnnotationValue extends NumberTypeAnnotation<any>
    ? NumberType
    : AnnotationValue extends BooleanTypeAnnotation<any>
    ? BooleanType
    : AnnotationValue extends NullLiteralTypeAnnotation<any>
    ? NullType
    : AnnotationValue extends AnyTypeAnnotation<any>
    ? AnyType
    : UnknownType;

type InferFunctionParams<
  Params extends Array<BaseNode<any>>,
  FunctionParams extends Array<[string, StaticType]> = [],
  ParamsByName extends StateType = {},
> = Params extends []
  ? [FunctionParams, ParamsByName]
  : Params[0] extends Identifier<infer Name, infer Annotation, any>
  ? Annotation extends TypeAnnotation<infer AnnotationValue, any>
    ? InferFunctionParamsHelper<
        Params,
        FunctionParams,
        ParamsByName,
        MapAnnotationToType<AnnotationValue>,
        Name
      >
    : InferFunctionParamsHelper<
        Params,
        FunctionParams,
        ParamsByName,
        AnyType,
        Name
      >
  : never;

type InferFunctionParamsHelper<
  Params extends Array<BaseNode<any>>,
  FunctionParams extends Array<[string, StaticType]>,
  ParamsByName extends StateType,
  Type extends StaticType,
  Name extends string,
> = InferFunctionParams<
  Tail<Params>,
  Push<FunctionParams, [Name, Type]>,
  MergeWithOverride<ParamsByName, { [a in Name]: Type }>
>;

type InferFunctionDeclaration<
  Name extends string,
  Params extends Array<BaseNode<any>>,
  Body extends Array<BaseNode<any>>,
  State extends StateType,
> = InferFunctionParams<Params> extends [
  infer FunctionParams,
  infer ParamsByName,
]
  ? FunctionParams extends Array<[string, StaticType]>
    ? ParamsByName extends StateType
      ? InferBlockStatement<
          Body,
          MergeWithOverride<State, ParamsByName>
        > extends TypeResult<
          infer BlockStatementReturnType,
          any,
          infer BlockStatementErrors
        >
        ? TypeResult<
            NullType,
            MergeWithOverride<
              State,
              {
                [a in Name]: FunctionType<
                  FunctionParams,
                  BlockStatementReturnType
                >;
              }
            >,
            BlockStatementErrors
          >
        : never
      : never
    : never
  : never;

type MatchType<
  TypeA extends StaticType,
  TypeB extends StaticType,
> = TypeA extends AnyType
  ? true
  : TypeB extends AnyType
  ? true
  : TypeA extends TypeB
  ? TypeB extends TypeA
    ? true
    : false
  : TypeA extends UnionType<infer UnionTypesA>
  ? TypeB extends UnionType<infer UnionTypesB>
    ? UnionMatchUnion<UnionTypesA, UnionTypesB>
    : TypeMatchUnion<UnionTypesA, TypeB>
  : TypeB extends UnionType<infer UnionTypesB>
  ? UnionMatchType<TypeA, UnionTypesB>
  : TypeA extends StringType
  ? TypeB extends StringLiteralType<any>
    ? true
    : false
  : TypeA extends BooleanType
  ? TypeB extends BooleanLiteralType<any>
    ? true
    : false
  : TypeA extends NumberType
  ? TypeB extends NumberLiteralType<any>
    ? true
    : false
  : false;

type UnionMatchUnion<
  UnionTypesA extends Array<StaticType>,
  UnionTypesB extends Array<StaticType>,
> = UnionTypesB extends []
  ? true
  : TypeMatchUnion<UnionTypesA, UnionTypesB[0]> extends true
  ? UnionMatchUnion<UnionTypesA, Tail<UnionTypesB>>
  : false;

type TypeMatchUnion<
  UnionTypes extends Array<StaticType>,
  Type extends StaticType,
> = UnionTypes extends []
  ? false
  : MatchType<UnionTypes[0], Type> extends true
  ? true
  : TypeMatchUnion<Tail<UnionTypes>, Type>;

type UnionMatchType<
  Type extends StaticType,
  UnionTypes extends Array<StaticType>,
> = UnionTypes extends []
  ? true
  : MatchType<Type, UnionTypes[0]> extends true
  ? UnionMatchType<Type, Tail<UnionTypes>>
  : false;

type MatchTypeArrays<
  ParamsType extends Array<[string, StaticType]>,
  ArgumentsType extends Array<StaticType>,
  StartLine extends number,
> = ParamsType extends []
  ? true
  : MatchType<ParamsType[0][1], ArgumentsType[0]> extends true
  ? MatchTypeArrays<Tail<ParamsType>, Tail<ArgumentsType>, StartLine>
  : TypeError<
      `Argument of type '${Serialize<
        ArgumentsType[0]
      >}' is not assignable to parameter of type '${Serialize<
        ParamsType[0][1]
      >}'.`,
      StartLine
    >;

type InferVariableDeclaration<
  Name extends string,
  Annotation extends TypeAnnotation<any, any> | null,
  Init extends BaseNode<any>,
  State extends StateType,
  StartLine extends number,
> = InferExpression<Init, State> extends TypeResult<
  infer InitExpressionValue,
  infer InitExpressionState,
  infer InitExpressionErrors
>
  ? Annotation extends TypeAnnotation<infer AnnotationValue, any>
    ? MapAnnotationToType<AnnotationValue> extends infer ExpectedType
      ? ExpectedType extends StaticType
        ? MatchType<ExpectedType, InitExpressionValue> extends true
          ? TypeResult<
              NullType,
              MergeWithOverride<
                InitExpressionState,
                { [a in Name]: ExpectedType }
              >,
              InitExpressionErrors
            >
          : TypeResult<
              NullType,
              MergeWithOverride<
                InitExpressionState,
                { [a in Name]: ExpectedType }
              >,
              Push<
                InitExpressionErrors,
                TypeError<
                  `Type '${Serialize<InitExpressionValue>}' is not assignable to type '${Serialize<ExpectedType>}'.`,
                  StartLine
                >
              >
            >
        : never
      : never
    : TypeResult<
        NullType,
        MergeWithOverride<State, { [a in Name]: InitExpressionValue }>,
        InitExpressionErrors
      >
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
  : Node extends CallExpression<
      infer Callee,
      infer Arguments,
      NodeData<infer StartLine, any>
    >
  ? InferCallExpression<Callee, Arguments, State, StartLine>
  : UnknownType;

type InferCallExpression<
  Callee extends BaseNode<any>,
  Arguments extends Array<BaseNode<any>>,
  State extends StateType,
  StartLine extends number,
> = InferExpression<Callee, State> extends TypeResult<
  infer CalleeValue,
  infer CalleeState,
  infer CalleeErrors
>
  ? InferExpressionsArray<Arguments, CalleeState> extends TypeResult<
      CallArgumentsType<infer ArgumentsType>,
      infer ArgumentsState,
      infer ArgumentsErrors
    >
    ? CalleeValue extends FunctionType<infer ParamsType, infer ReturnType>
      ? InferCallExpressionHelper<
          ParamsType,
          ArgumentsType,
          ReturnType,
          ArgumentsState,
          Concat<CalleeErrors, ArgumentsErrors>,
          StartLine
        >
      : CalleeValue extends AnyType
      ? TypeResult<
          AnyType,
          ArgumentsState,
          Concat<CalleeErrors, ArgumentsErrors>
        >
      : TypeResult<
          AnyType,
          ArgumentsState,
          Unshift<
            Concat<CalleeErrors, ArgumentsErrors>,
            TypeError<
              `This expression is not callable. Type '${Serialize<CalleeValue>}' has no call signatures.`,
              StartLine
            >
          >
        >
    : never
  : never;

type InferCallExpressionHelper<
  ParamsType extends Array<[string, StaticType]>,
  ArgumentsType extends Array<StaticType>,
  ReturnType extends StaticType,
  State extends StateType,
  Errors extends Array<TypeError<any, any>>,
  StartLine extends number,
> = ParamsType['length'] extends ArgumentsType['length']
  ? MatchTypeArrays<ParamsType, ArgumentsType, StartLine> extends TypeError<
      infer Message,
      infer StartLine
    >
    ? TypeResult<ReturnType, State, Push<Errors, TypeError<Message, StartLine>>>
    : TypeResult<ReturnType, State, Errors>
  : TypeResult<
      ReturnType,
      State,
      Push<
        Errors,
        TypeError<
          `Expected ${ParamsType['length']} arguments, but got ${ArgumentsType['length']}.`,
          StartLine
        >
      >
    >;

type InferExpressionsArray<
  NodeList extends Array<BaseNode<any>>,
  State extends StateType,
  Result extends Array<StaticType> = [],
  Errors extends Array<TypeError<any, any>> = [],
> = NodeList extends []
  ? TypeResult<CallArgumentsType<Result>, State, Errors>
  : InferExpression<NodeList[0], State> extends TypeResult<
      infer ExpressionValue,
      infer ExpressionState,
      infer ExpressionErrors
    >
  ? InferExpressionsArray<
      Tail<NodeList>,
      MergeWithOverride<State, ExpressionState>,
      Push<Result, ExpressionValue>,
      Concat<Errors, ExpressionErrors>
    >
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

type MapLiteralToType<Type extends StaticType> =
  Type extends NumberLiteralType<any>
    ? NumberType
    : Type extends StringLiteralType<any>
    ? StringType
    : Type extends BooleanLiteralType<any>
    ? BooleanType
    : Type extends ObjectType<infer Properties>
    ? ObjectType<{
        [P in keyof Properties]: Properties[P] extends [infer Key, infer Value]
          ? Value extends StaticType
            ? [Key, MapLiteralToType<Value>]
            : never
          : never;
      }>
    : Type;

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
        : PropertyExpressionValue extends AnyType
        ? TypeResult<
            AnyType,
            PropertyExpressionState,
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
      []
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
        Push<Result, [Name, MapLiteralToType<ExpressionValue>]>,
        Concat<Errors, ExpressionErrors>
      >
    : never
  : never;
