import type {
  AnyType,
  ArrayType,
  BooleanLiteralType,
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
  TypeArrayResult,
  MapLiteralToType,
  MatchType,
  GetObjectValueByKey,
  MapAnnotationToType,
  MergeTypes,
  StateVariableType,
  IsKindMutable,
  MergeFunctionTypesArray,
  BooleanType,
  MismatchBinaryErrorHelper,
  OverlapType,
  NumberType,
  IsNumeric,
  StringType,
  PropertyDoesNotExistResult,
  ArrayTypeMembers,
  StringTypeMembers,
  FunctionTypeMembers,
  GlobalTypeMembers,
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
  BinaryExpression,
  FunctionExpression,
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
  GlobalTypeMembers
> extends TypeResult<any, any, infer Errors>
  ? Errors
  : never;

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
  ObjectMerge<ParamsByName, { [a in Name]: StateVariableType<Type, true> }>,
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
                  [a in Name]: StateVariableType<
                    FunctionType<FunctionParams, BlockStatementReturnType>,
                    false
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
                {
                  [a in Name]: StateVariableType<
                    ExpectedType,
                    IsKindMutable<Kind>
                  >;
                }
              >,
              InitExpressionErrors
            >
          : TypeResult<
              UndefinedType,
              ObjectMerge<
                InitExpressionState,
                {
                  [a in Name]: StateVariableType<
                    ExpectedType,
                    IsKindMutable<Kind>
                  >;
                }
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
          Kind extends 'const'
            ? {
                [a in Name]: StateVariableType<InitExpressionValue, false>;
              }
            : {
                [a in Name]: StateVariableType<
                  MapLiteralToType<InitExpressionValue>,
                  true
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
  : Node extends FunctionExpression<
      any,
      infer Params,
      BlockStatement<infer Body, any>,
      any
    >
  ? InferFunctionExpression<Params, Body, State>
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
  : Node extends BinaryExpression<
      infer Left,
      infer Right,
      infer Operator,
      NodeData<infer LineNumber, any>
    >
  ? InferBinaryExpression<Left, Right, State, Operator, LineNumber>
  : Node extends AssignmentExpression<
      infer Left,
      infer Right,
      '=',
      NodeData<infer LineNumber, any>
    >
  ? InferAssignmentExpression<Left, Right, State, LineNumber>
  : UnknownType;

type InferFunctionExpression<
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
              FunctionType<FunctionParams, BlockStatementReturnType>,
              State,
              Concat<Errors, BlockStatementErrors>
            >
          : never
        : never
      : never
    : never
  : never;

type InferBinaryExpression<
  Left extends BaseNode<any>,
  Right extends BaseNode<any>,
  State extends StateType,
  Operator extends string,
  LineNumber extends number,
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
    ? Operator extends '==' | '==='
      ? InferComparisonExpression<
          RightValue,
          LeftValue,
          RightState,
          Concat<LeftErrors, RightErrors>,
          LineNumber
        >
      : Operator extends '+' | '-' | '*' | '/'
      ? InferArithmeticExpression<
          RightValue,
          LeftValue,
          RightState,
          Concat<LeftErrors, RightErrors>,
          LineNumber
        >
      : never
    : never
  : never;

type InferComparisonExpression<
  RightValue extends StaticType,
  LeftValue extends StaticType,
  State extends StateType,
  Errors extends Array<TypeError<any, any>>,
  LineNumber extends number,
> = OverlapType<RightValue, LeftValue> extends false
  ? TypeResult<
      BooleanType,
      State,
      MismatchBinaryErrorHelper<LeftValue, RightValue, LineNumber, Errors>
    >
  : TypeResult<BooleanType, State, Errors>;

type InferArithmeticExpression<
  RightValue extends StaticType,
  LeftValue extends StaticType,
  State extends StateType,
  Errors extends Array<TypeError<any, any>>,
  LineNumber extends number,
> = MatchType<NumberType, RightValue> extends true
  ? MatchType<NumberType, LeftValue> extends true
    ? TypeResult<NumberType, State, Errors>
    : TypeResult<
        NumberType,
        State,
        Push<
          Errors,
          TypeError<
            "The left-hand side of an arithmetic operation must be of type 'any' or 'number'.",
            LineNumber
          >
        >
      >
  : TypeResult<
      NumberType,
      State,
      Push<
        Errors,
        TypeError<
          "The right-hand side of an arithmetic operation must be of type 'any' or 'number'.",
          LineNumber
        >
      >
    >;

type InferAssignmentExpression<
  Left extends BaseNode<any>,
  Right extends BaseNode<any>,
  State extends StateType,
  EqualsLineNumber extends number,
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
    ? Left extends Identifier<infer Name, any, any>
      ? State[Name]['mutable'] extends false
        ? TypeResult<
            RightValue,
            RightState,
            Push<
              Concat<LeftErrors, RightErrors>,
              TypeError<
                `Cannot assign to '${Name}' because it is a constant.`,
                EqualsLineNumber
              >
            >
          >
        : InferAssignmentExpressionHelper<
            LeftValue,
            RightValue,
            RightState,
            Concat<LeftErrors, RightErrors>,
            EqualsLineNumber
          >
      : InferAssignmentExpressionHelper<
          LeftValue,
          RightValue,
          RightState,
          Concat<LeftErrors, RightErrors>,
          EqualsLineNumber
        >
    : never
  : never;

type InferAssignmentExpressionHelper<
  LeftValue extends StaticType,
  RightValue extends StaticType,
  RightState extends StateType,
  Errors extends Array<TypeError<any, any>>,
  LineNumber extends number,
> = MatchType<LeftValue, RightValue> extends true
  ? TypeResult<RightValue, RightState, Errors>
  : TypeResult<
      RightValue,
      RightState,
      Push<
        Errors,
        TypeError<
          `Type '${Serialize<RightValue>}' is not assignable to type '${Serialize<LeftValue>}'.`,
          LineNumber
        >
      >
    >;

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
  ? InferExpressionsArray<Arguments, CalleeState> extends TypeArrayResult<
      infer ArgumentsType,
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
      MergeFunctionTypesArray<Tail<UnionTypes>, UnionTypes[0]>,
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
  ? TypeArrayResult<Result, State, Errors>
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
      ? PropertyExpressionValue extends
          | StringLiteralType<infer Value>
          | NumberLiteralType<infer Value>
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
      : PropertyDoesNotExistResult<
          State,
          Errors,
          Key,
          Object,
          StartLine,
          UndefinedType
        >
    : never
  : Object extends ArrayType<infer ElementsType>
  ? IsNumeric<Key> extends true
    ? TypeResult<ElementsType, State, Errors>
    : Key extends keyof ArrayTypeMembers<ElementsType>
    ? TypeResult<ArrayTypeMembers<ElementsType>[Key], State, Errors>
    : PropertyDoesNotExistResult<State, Errors, Key, Object, StartLine>
  : Object extends StringType | StringLiteralType<any>
  ? Key extends keyof StringTypeMembers
    ? TypeResult<StringTypeMembers[Key], State, Errors>
    : PropertyDoesNotExistResult<State, Errors, Key, Object, StartLine>
  : Object extends FunctionType<any, any>
  ? Key extends keyof FunctionTypeMembers
    ? TypeResult<FunctionTypeMembers[Key], State, Errors>
    : PropertyDoesNotExistResult<State, Errors, Key, Object, StartLine>
  : Object extends UnionType<infer UnionTypes>
  ? InferMemberExpressionUnionHelper<UnionTypes, Key, State, StartLine, Errors>
  : Object extends AnyType
  ? TypeResult<AnyType, State, Errors>
  : PropertyDoesNotExistResult<State, Errors, Key, Object, StartLine>;

type InferMemberExpressionUnionHelper<
  UnionTypes extends Array<StaticType>,
  Key extends string,
  State extends StateType,
  StartLine extends number,
  Errors extends Array<TypeError<any, any>>,
  Result extends StaticType = NeverType,
> = UnionTypes extends []
  ? TypeResult<Result, State, Errors>
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
  ? MergeTypes<Result, ExpressionValue> extends infer ReturnType
    ? ReturnType extends StaticType
      ? InferMemberExpressionUnionHelper<
          Tail<UnionTypes>,
          Key,
          ExpressionState,
          StartLine,
          Errors,
          ReturnType
        >
      : never
    : never
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
