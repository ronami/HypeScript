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
import type { Tail } from './utils/arrayUtils';

export type Serialize<Type extends StaticType> =
  MapLiteralToType<Type> extends infer H
    ? H extends StringType
      ? 'string'
      : H extends BooleanType
      ? 'boolean'
      : H extends NumberType
      ? 'number'
      : H extends NullType
      ? 'null'
      : H extends VoidType
      ? 'void'
      : H extends AnyType
      ? 'any'
      : H extends UnknownType
      ? 'unknown'
      : H extends ArrayType<infer ElementsType>
      ? SerializeArray<ElementsType>
      : H extends UnionType<infer UnionTypes>
      ? SerializeUnion<UnionTypes>
      : H extends ObjectType<infer Properties>
      ? SerializeObject<Properties>
      : H extends FunctionType<infer Params, infer Return>
      ? SerializeFunction<Params, Return>
      : never
    : never;

type SerializeFunction<
  Params extends Array<[string, StaticType]>,
  Return extends StaticType,
> = SerializeFunctionParams<Params> extends infer H
  ? H extends string
    ? `(${H}) => ${Serialize<Return>}`
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
          `${Result}${Key}: ${Serialize<Value>}` extends infer U
            ? U extends string
              ? Params['length'] extends 1
                ? `${U}`
                : `${U}, `
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
  Serialize<ElementsType> extends infer H
    ? H extends string
      ? ShouldUseParens<ElementsType> extends true
        ? `(${H})[]`
        : `${H}[]`
      : never
    : never;

type SerializeUnion<
  UnionTypes extends Array<StaticType>,
  Result extends string = '',
> = UnionTypes extends []
  ? Result
  : UnionTypes[0] extends StaticType
  ? Serialize<UnionTypes[0]> extends infer H
    ? H extends string
      ? SerializeUnion<
          Tail<UnionTypes>,
          UnionTypes['length'] extends 1 ? `${Result}${H}` : `${Result}${H} | `
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
  ? `${Properties[0][0]}: ${Serialize<Properties[0][1]>}` extends infer H
    ? H extends string
      ? SerializeObject<
          Tail<Properties>,
          Properties['length'] extends 1 ? `${Result}${H};` : `${Result}${H}; `
        >
      : never
    : never
  : never;
