import type {
  AnyType,
  ArrayType,
  BooleanLiteralType,
  CallArgumentsType,
  FunctionType,
  NeverType,
  NullType,
  NumberLiteralType,
  ObjectType,
  StaticType,
  StringLiteralType,
  UndefinedType,
  UnionType,
  UnknownType,
  VoidType,
  StateType,
  TypeResult,
  MapLiteralToType,
  MatchType,
  GetObjectValueByKey,
  MapAnnotationToType,
  MergeTypes,
  StateVariable,
} from '.';
import type {
  ArrayExpression,
  BlockStatement,
  BooleanLiteral,
  CallExpression,
  ExpressionStatement,
  FunctionDeclaration,
  Identifier,
  MemberExpression,
  BaseNode,
  NodeData,
  NullLiteral,
  NumericLiteral,
  ObjectExpression,
  ObjectProperty,
  ReturnStatement,
  StringLiteral,
  TypeAnnotation,
  VariableDeclaration,
  VariableDeclarator,
  IfStatement,
  AssignmentExpression,
} from '../Parser';
import type { Serialize } from '../Serializer';
import type {
  Concat,
  Push,
  Tail,
  Unshift,
  ObjectMerge,
  TypeError,
} from '../Utils';

export type Check<NodeList extends Array<BaseNode<any>>> = InferBlockStatement<
  NodeList,
  {}
> extends TypeResult<any, any, infer Errors>
  ? Errors
  : never;

type MergeFunctionTypes<
  FunctionTypes extends Array<FunctionType<any, any>>,
  ReturnType extends FunctionType<any, any>,
> = FunctionTypes extends []
  ? ReturnType
  : FunctionTypes[0] extends FunctionType<infer Params, infer Return>
  ? MergeFunctionTypes<
      Tail<FunctionTypes>,
      MergeFunctions<Params, Return, ReturnType>
    >
  : never;

type MergeFunctions<
  Params extends Array<[string, StaticType]>,
  Return extends StaticType,
  Function extends FunctionType<any, any>,
> = Function extends FunctionType<infer OtherParams, infer OtherReturn>
  ? MergeFunctionParams<Params, OtherParams> extends infer P
    ? P extends Array<[string, StaticType]>
      ? MergeTypes<Return, OtherReturn> extends infer ReturnType
        ? ReturnType extends StaticType
          ? FunctionType<P, ReturnType>
          : never
        : never
      : never
    : never
  : never;

type MergeFunctionParams<
  ParamsA extends Array<[string, StaticType]>,
  ParamsB extends Array<[string, StaticType]>,
  Return extends Array<[string, StaticType]> = [],
> = ParamsA extends []
  ? ParamsB extends []
    ? Return
    : Concat<Return, ParamsB>
  : ParamsB extends []
  ? Concat<Return, ParamsA>
  : MatchType<ParamsA[0][1], ParamsB[0][1]> extends true
  ? MergeFunctionParams<Tail<ParamsA>, Tail<ParamsB>, Push<Return, ParamsB[0]>>
  : MatchType<ParamsB[0][1], ParamsA[0][1]> extends true
  ? MergeFunctionParams<Tail<ParamsA>, Tail<ParamsB>, Push<Return, ParamsA[0]>>
  : MergeFunctionParams<
      Tail<ParamsA>,
      Tail<ParamsB>,
      Push<Return, [ParamsA[0][0], NeverType]>
    >;

type InferBlockStatement<
  NodeList extends Array<BaseNode<any>>,
  State extends StateType,
  Result extends StaticType = NeverType,
  Errors extends Array<TypeError<any, any>> = [],
> = NodeList extends []
  ? MergeTypes<Result, VoidType> extends infer ReturnType
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
      infer Kind,
      any
    >
  ? InferVariableDeclaration<
      Name,
      Annotation,
      Init,
      Kind,
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
    ? MergeTypes<Result, ReturnValue> extends infer ReturnType
      ? ReturnType extends StaticType
        ? TypeResult<ReturnType, ReturnState, Concat<Errors, ReturnErrors>>
        : never
      : never
    : never
  : NodeList[0] extends IfStatement<
      infer Test,
      BlockStatement<infer BlockBody, any>,
      any
    >
  ? InferExpression<Test, State> extends TypeResult<
      infer TestValue,
      infer TestState,
      infer TestErrors
    >
    ? InferBlockStatement<BlockBody, TestState> extends TypeResult<
        infer IfStatementValue,
        any,
        infer IfStatementErrors
      >
      ? InferBlockStatement<
          Tail<NodeList>,
          TestState,
          MergeTypes<Result, IfStatementValue> extends infer ReturnType
            ? ReturnType extends StaticType
              ? IfStatementValue extends VoidType
                ? Result
                : ReturnType
              : never
            : never,
          [...Errors, ...TestErrors, ...IfStatementErrors]
        >
      : never
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
  : TypeResult<UndefinedType, State>;

type InferFunctionParams<
  Params extends Array<BaseNode<any>>,
  FunctionParams extends Array<[string, StaticType]> = [],
  ParamsByName extends StateType = {},
  Errors extends Array<TypeError<any, any>> = [],
> = Params extends []
  ? [FunctionParams, ParamsByName, Errors]
  : Params[0] extends Identifier<
      infer Name,
      infer Annotation,
      NodeData<infer LineNumber, any>
    >
  ? Annotation extends TypeAnnotation<infer AnnotationValue, any>
    ? InferFunctionParamsHelper<
        Params,
        FunctionParams,
        ParamsByName,
        MapAnnotationToType<AnnotationValue>,
        Name,
        Errors
      >
    : InferFunctionParamsHelper<
        Params,
        FunctionParams,
        ParamsByName,
        AnyType,
        Name,
        Push<
          Errors,
          TypeError<
            `Parameter '${Name}' implicitly has an 'any' type.`,
            LineNumber
          >
        >
      >
  : never;

type InferFunctionParamsHelper<
  Params extends Array<BaseNode<any>>,
  FunctionParams extends Array<[string, StaticType]>,
  ParamsByName extends StateType,
  Type extends StaticType,
  Name extends string,
  Errors extends Array<TypeError<any, any>>,
> = InferFunctionParams<
  Tail<Params>,
  Push<FunctionParams, [Name, Type]>,
  ObjectMerge<ParamsByName, { [a in Name]: StateVariable<Type, Type> }>,
  Errors
>;

type InferFunctionDeclaration<
  Name extends string,
  Params extends Array<BaseNode<any>>,
  Body extends Array<BaseNode<any>>,
  State extends StateType,
> = InferFunctionParams<Params> extends [
  infer FunctionParams,
  infer ParamsByName,
  infer Errors,
]
  ? FunctionParams extends Array<[string, StaticType]>
    ? ParamsByName extends StateType
      ? Errors extends Array<TypeError<any, any>>
        ? InferBlockStatement<
            Body,
            ObjectMerge<State, ParamsByName>
          > extends TypeResult<
            infer BlockStatementReturnType,
            any,
            infer BlockStatementErrors
          >
          ? TypeResult<
              UndefinedType,
              ObjectMerge<
                State,
                {
                  [a in Name]: StateVariable<
                    FunctionType<FunctionParams, BlockStatementReturnType>,
                    FunctionType<FunctionParams, BlockStatementReturnType>
                  >;
                }
              >,
              Concat<Errors, BlockStatementErrors>
            >
          : never
        : never
      : never
    : never
  : never;

type MatchCallExpressionArguments<
  ParamsType extends Array<[string, StaticType]>,
  ArgumentsType extends Array<StaticType>,
  StartLine extends number,
> = ParamsType extends []
  ? true
  : MatchType<ParamsType[0][1], ArgumentsType[0]> extends true
  ? MatchCallExpressionArguments<
      Tail<ParamsType>,
      Tail<ArgumentsType>,
      StartLine
    >
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
  Annotation extends BaseNode<any> | null,
  Init extends BaseNode<any>,
  Kind extends string,
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
              UndefinedType,
              ObjectMerge<
                InitExpressionState,
                { [a in Name]: StateVariable<ExpectedType, ExpectedType> }
              >,
              InitExpressionErrors
            >
          : TypeResult<
              UndefinedType,
              ObjectMerge<
                InitExpressionState,
                { [a in Name]: StateVariable<ExpectedType, ExpectedType> }
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
        UndefinedType,
        ObjectMerge<
          State,
          {
            [a in Name]: StateVariable<
              InitExpressionValue,
              InitExpressionValue
            >;
          }
        >,
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
    ? TypeResult<State[Name]['value'], State>
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
  : Node extends AssignmentExpression<infer Left, infer Right, '=', any>
  ? InferAssignmentExpression<Left, Right, State>
  : UnknownType;

type InferAssignmentExpression<
  Left extends BaseNode<any>,
  Right extends BaseNode<any>,
  State extends StateType,
> = InferExpression<Left, State> extends TypeResult<
  infer LeftValue,
  infer LeftState,
  infer LeftErrors
>
  ? InferExpression<Right, LeftState> extends TypeResult<
      infer RightValue,
      infer RightState,
      infer RightErrors
    >
    ? MatchType<LeftValue, RightValue> extends true
      ? TypeResult<RightValue, RightState, Concat<LeftErrors, RightErrors>>
      : TypeResult<
          RightValue,
          RightState,
          Push<Concat<LeftErrors, RightErrors>, TypeError<'foo', 1>>
        >
    : never
  : never;

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
    ? InferCallExpressionHelper<
        CalleeValue,
        ArgumentsType,
        ArgumentsState,
        Concat<CalleeErrors, ArgumentsErrors>,
        StartLine
      >
    : never
  : never;

type InferCallExpressionHelper<
  CalleeValue extends StaticType,
  ArgumentsType extends Array<StaticType>,
  State extends StateType,
  Errors extends Array<TypeError<any, any>>,
  StartLine extends number,
> = CalleeValue extends FunctionType<infer ParamsType, infer ReturnType>
  ? ParamsType['length'] extends ArgumentsType['length']
    ? MatchCallExpressionArguments<
        ParamsType,
        ArgumentsType,
        StartLine
      > extends TypeError<infer Message, infer StartLine>
      ? TypeResult<
          ReturnType,
          State,
          Push<Errors, TypeError<Message, StartLine>>
        >
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
      >
  : CalleeValue extends AnyType
  ? TypeResult<AnyType, State, Errors>
  : CalleeValue extends UnionType<infer UnionTypes>
  ? InferCallExpressionUnionHelper<
      CalleeValue,
      UnionTypes,
      ArgumentsType,
      State,
      StartLine,
      Errors
    >
  : TypeResult<
      AnyType,
      State,
      Unshift<
        Errors,
        TypeError<
          `This expression is not callable. Type '${Serialize<CalleeValue>}' has no call signatures.`,
          StartLine
        >
      >
    >;

type InferCallExpressionUnionHelper<
  CalleeValue extends UnionType<any>,
  UnionTypes extends Array<StaticType>,
  ArgumentsType extends Array<StaticType>,
  State extends StateType,
  StartLine extends number,
  Errors extends Array<TypeError<any, any>>,
> = UnionTypes extends Array<FunctionType<any, any>>
  ? InferCallExpressionHelper<
      MergeFunctionTypes<Tail<UnionTypes>, UnionTypes[0]>,
      ArgumentsType,
      State,
      Errors,
      StartLine
    >
  : TypeResult<
      AnyType,
      State,
      Push<
        Errors,
        TypeError<
          `This expression is not callable. Not all constituents of type '${Serialize<CalleeValue>}' are callable.`,
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
      ObjectMerge<State, ExpressionState>,
      Push<Result, ExpressionValue>,
      Concat<Errors, ExpressionErrors>
    >
  : never;

type InferArrayElements<
  Elements extends Array<BaseNode<any>>,
  State extends StateType,
  First extends boolean = true,
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
    ? MapLiteralToType<ExpressionValue> extends infer LiteralType
      ? LiteralType extends StaticType
        ? MergeTypes<Result, LiteralType> extends infer ReturnType
          ? ReturnType extends StaticType
            ? InferArrayElements<
                Tail<Elements>,
                ExpressionState,
                false,
                First extends true ? LiteralType : ReturnType,
                Concat<Errors, ExpressionErrors>
              >
            : never
          : never
        : never
      : never
    : never
  : never;

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
          UndefinedType,
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
      Errors,
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
