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
} from '.';
import type {
  AnyTypeAnnotation,
  BaseNode,
  BooleanTypeAnnotation,
  NullLiteralTypeAnnotation,
  NumberTypeAnnotation,
  StringTypeAnnotation,
} from '../Parser';
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
