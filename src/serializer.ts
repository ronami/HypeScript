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

export type Serialize<T extends StaticType> =
  MapLiteralToType<T> extends infer H
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
      : H extends ArrayType<infer I>
      ? SerializeArray<I>
      : H extends UnionType<infer U>
      ? SerializeUnion<U>
      : H extends ObjectType<infer O>
      ? SerializeObject<O>
      : H extends FunctionType<infer P, infer R>
      ? SerializeFunction<P, R>
      : never
    : never;

type SerializeFunction<
  P extends Array<[string, StaticType]>,
  R extends StaticType,
> = SerializeFunctionParams<P> extends infer H
  ? H extends string
    ? `(${H}) => ${Serialize<R>}`
    : never
  : never;

type SerializeFunctionParams<
  P extends Array<[string, StaticType]>,
  R extends string = '',
> = P extends []
  ? R
  : P[0] extends [infer K, infer V]
  ? V extends StaticType
    ? K extends string
      ? SerializeFunctionParams<
          Tail<P>,
          `${R}${K}: ${Serialize<V>}` extends infer U
            ? U extends string
              ? P['length'] extends 1
                ? `${U}`
                : `${U}, `
              : never
            : never
        >
      : never
    : never
  : never;

type MapLiteralToType<T extends StaticType> = T extends NumberLiteralType<any>
  ? NumberType
  : T extends StringLiteralType<any>
  ? StringType
  : T extends BooleanLiteralType<any>
  ? BooleanType
  : T;

type ShouldUseParens<I extends StaticType> = I extends UnionType<any>
  ? true
  : I extends FunctionType<any, any>
  ? true
  : false;

type SerializeArray<I extends StaticType> = Serialize<I> extends infer H
  ? H extends string
    ? ShouldUseParens<I> extends true
      ? `(${H})[]`
      : `${H}[]`
    : never
  : never;

type SerializeUnion<
  U extends Array<StaticType>,
  R extends string = '',
> = U extends []
  ? R
  : U[0] extends StaticType
  ? Serialize<U[0]> extends infer H
    ? H extends string
      ? SerializeUnion<
          Tail<U>,
          U['length'] extends 1 ? `${R}${H}` : `${R}${H} | `
        >
      : never
    : never
  : never;

type SerializeObject<
  U extends Array<[string, StaticType]>,
  R extends string = '',
> = U extends []
  ? R extends ''
    ? '{}'
    : `{ ${R} }`
  : U[0] extends [string, StaticType]
  ? `${U[0][0]}: ${Serialize<U[0][1]>}` extends infer H
    ? H extends string
      ? SerializeObject<
          Tail<U>,
          U['length'] extends 1 ? `${R}${H};` : `${R}${H}; `
        >
      : never
    : never
  : never;
