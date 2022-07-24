import type {
  MatchType,
  StaticType,
  NumberLiteralType,
  NumberType,
  StringLiteralType,
  StringType,
  BooleanLiteralType,
  BooleanType,
  NullType,
  AnyType,
  UnknownType,
  NeverType,
  UnionType,
  FunctionType,
} from '.';
import type {
  AnyTypeAnnotation,
  BaseNode,
  BooleanTypeAnnotation,
  NullLiteralTypeAnnotation,
  NumberTypeAnnotation,
  StringTypeAnnotation,
} from '../Parser';
import type { Serialize } from '../Serializer';
import type { Concat, Push, Tail, TypeError } from '../Utils';

export type StateVariableType<
  Value extends StaticType,
  Mutable extends boolean,
> = {
  type: 'ConstVariableType';
  value: Value;
  mutable: Mutable;
};

export type StateType = Record<string, StateVariableType<StaticType, boolean>>;

export type TypeResult<
  Value extends StaticType,
  State extends StateType,
  Errors extends Array<TypeError<any, any>> = [],
> = {
  type: 'TypeResult';
  value: Value;
  state: State;
  errors: Errors;
};

export type TypeArrayResult<
  TypeList extends Array<StaticType>,
  State extends StateType,
  Errors extends Array<TypeError<any, any>> = [],
> = {
  type: 'TypeResult';
  value: TypeList;
  state: State;
  errors: Errors;
};

export type MapLiteralToType<Type extends StaticType> =
  Type extends NumberLiteralType<any>
    ? NumberType
    : Type extends StringLiteralType<any>
    ? StringType
    : Type extends BooleanLiteralType<any>
    ? BooleanType
    : Type;

export type GetObjectValueByKey<
  ObjectProperties extends Array<[string, StaticType]>,
  Key extends string,
> = ObjectProperties extends []
  ? null
  : ObjectProperties[0] extends [infer PropertyName, infer PropertyValue]
  ? PropertyName extends Key
    ? PropertyValue
    : GetObjectValueByKey<Tail<ObjectProperties>, Key>
  : never;

export type MapAnnotationToType<AnnotationValue extends BaseNode<any>> =
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

export type MergeTypes<
  TypeA extends StaticType,
  TypeB extends StaticType,
> = TypeA extends NeverType
  ? TypeB
  : TypeB extends NeverType
  ? TypeA
  : TypeA extends AnyType
  ? AnyType
  : TypeB extends AnyType
  ? AnyType
  : MatchType<TypeA, TypeB> extends true
  ? TypeA
  : MatchType<TypeB, TypeA> extends true
  ? TypeB
  : TypeA extends UnionType<infer UnionTypesA>
  ? TypeB extends UnionType<infer UnionTypesB>
    ? UnionType<Concat<UnionTypesA, UnionTypesB>>
    : UnionType<Push<UnionTypesA, TypeB>>
  : TypeB extends UnionType<infer UnionTypesB>
  ? UnionType<Push<UnionTypesB, TypeA>>
  : UnionType<[TypeA, TypeB]>;

export type IsKindMutable<Kind extends string> = Kind extends 'const'
  ? false
  : true;

export type MergeFunctionTypesArray<
  FunctionTypes extends Array<FunctionType<any, any>>,
  ReturnType extends FunctionType<any, any>,
> = FunctionTypes extends []
  ? ReturnType
  : FunctionTypes[0] extends FunctionType<infer Params, infer Return>
  ? MergeFunctionTypesArray<
      Tail<FunctionTypes>,
      MergeFunctionTypes<Params, Return, ReturnType>
    >
  : never;

type MergeFunctionTypes<
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

export type MismatchBinaryErrorHelper<
  Left extends StaticType,
  Right extends StaticType,
  LineNumber extends number,
  Errors extends Array<TypeError<any, any>>,
  ShouldMapLiterals extends boolean = IsSameLiteralType<Left, Right>,
> = Push<
  Errors,
  TypeError<
    `This condition will always return 'false' since the types '${Serialize<
      Left,
      ShouldMapLiterals
    >}' and '${Serialize<Right, ShouldMapLiterals>}' have no overlap.`,
    LineNumber
  >
>;

type IsSameLiteralType<LeftValue, RightValue> =
  RightValue extends StringLiteralType<any>
    ? LeftValue extends StringLiteralType<any>
      ? true
      : false
    : RightValue extends NumberLiteralType<any>
    ? LeftValue extends NumberLiteralType<any>
      ? true
      : false
    : RightValue extends BooleanLiteralType<any>
    ? LeftValue extends BooleanLiteralType<any>
      ? true
      : false
    : false;
