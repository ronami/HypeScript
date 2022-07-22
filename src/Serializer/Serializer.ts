import type {
  AnyType,
  ArrayType,
  BooleanLiteralType,
  BooleanType,
  FunctionType,
  NeverType,
  NullType,
  NumberLiteralType,
  NumberType,
  ObjectType,
  StaticType,
  StringLiteralType,
  StringType,
  UndefinedType,
  UnionType,
  UnknownType,
  VoidType,
} from '../Checker';
import type { Tail } from '../Utils';

export type Serialize<Type extends StaticType> =
  MapLiteralToType<Type> extends infer MappedType
    ? MappedType extends StringType
      ? 'string'
      : MappedType extends BooleanType
      ? 'boolean'
      : MappedType extends NumberType
      ? 'number'
      : MappedType extends NullType
      ? 'null'
      : MappedType extends UndefinedType
      ? 'undefined'
      : MappedType extends VoidType
      ? 'void'
      : MappedType extends AnyType
      ? 'any'
      : MappedType extends UnknownType
      ? 'unknown'
      : MappedType extends NeverType
      ? 'never'
      : MappedType extends ArrayType<infer ElementsType>
      ? SerializeArray<ElementsType>
      : MappedType extends UnionType<infer UnionTypes>
      ? SerializeUnion<UnionTypes>
      : MappedType extends ObjectType<infer Properties>
      ? SerializeObject<Properties>
      : MappedType extends FunctionType<infer Params, infer Return>
      ? SerializeFunction<Params, Return>
      : never
    : never;

type SerializeFunction<
  Params extends Array<[string, StaticType]>,
  Return extends StaticType,
> = SerializeFunctionParams<Params> extends infer SerializedParams
  ? SerializedParams extends string
    ? `(${SerializedParams}) => ${Serialize<Return>}`
    : never
  : never;

type SerializeFunctionParams<
  Params extends Array<[string, StaticType]>,
  Result extends string = '',
> = Params extends []
  ? Result
  : Params[0] extends [infer Key, infer Value]
  ? Value extends StaticType
    ? Key extends string
      ? SerializeFunctionParams<
          Tail<Params>,
          `${Result}${Key}: ${Serialize<Value>}` extends infer SerializedSignature
            ? SerializedSignature extends string
              ? Params['length'] extends 1
                ? `${SerializedSignature}`
                : `${SerializedSignature}, `
              : never
            : never
        >
      : never
    : never
  : never;

type MapLiteralToType<Type extends StaticType> =
  Type extends NumberLiteralType<any>
    ? NumberType
    : Type extends StringLiteralType<any>
    ? StringType
    : Type extends BooleanLiteralType<any>
    ? BooleanType
    : Type;

type ShouldUseParens<Type extends StaticType> = Type extends UnionType<any>
  ? true
  : Type extends FunctionType<any, any>
  ? true
  : false;

type SerializeArray<ElementsType extends StaticType> =
  Serialize<ElementsType> extends infer SerializedElements
    ? SerializedElements extends string
      ? ShouldUseParens<ElementsType> extends true
        ? `(${SerializedElements})[]`
        : `${SerializedElements}[]`
      : never
    : never;

type SerializeUnion<
  UnionTypes extends Array<StaticType>,
  Result extends string = '',
> = UnionTypes extends []
  ? Result
  : UnionTypes[0] extends StaticType
  ? Serialize<UnionTypes[0]> extends infer SerializedType
    ? SerializedType extends string
      ? SerializeUnion<
          Tail<UnionTypes>,
          UnionTypes['length'] extends 1
            ? `${Result}${SerializedType}`
            : `${Result}${SerializedType} | `
        >
      : never
    : never
  : never;

type SerializeObject<
  Properties extends Array<[string, StaticType]>,
  Result extends string = '',
> = Properties extends []
  ? Result extends ''
    ? '{}'
    : `{ ${Result} }`
  : Properties[0] extends [infer Key, infer Value]
  ? Value extends StaticType
    ? Key extends string
      ? `${Key}: ${Serialize<Value>}` extends infer SerializedProperty
        ? SerializedProperty extends string
          ? SerializeObject<
              Tail<Properties>,
              Properties['length'] extends 1
                ? `${Result}${SerializedProperty};`
                : `${Result}${SerializedProperty}; `
            >
          : never
        : never
      : never
    : never
  : never;
