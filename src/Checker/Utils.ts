import type {
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
} from '.';
import type {
  AnyTypeAnnotation,
  BaseNode,
  BooleanTypeAnnotation,
  NullLiteralTypeAnnotation,
  NumberTypeAnnotation,
  StringTypeAnnotation,
} from '../Parser';
import type { Tail, TypeError } from '../Utils';

export type StateType = Record<string, StaticType>;

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
