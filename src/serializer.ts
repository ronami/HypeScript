import type {
  ArrayType,
  BooleanLiteralType,
  BooleanType,
  NullType,
  NumberLiteralType,
  NumberType,
  ObjectType,
  StaticType,
  StringLiteralType,
  StringType,
  UnionType,
} from './types';
import type { Tail } from './utils/arrayUtils';

export type Serialize<
  T extends StaticType,
  N extends boolean = false,
> = MapLiteralToType<T> extends infer H
  ? H extends StringType
    ? 'string'
    : H extends BooleanType
    ? 'boolean'
    : H extends NumberType
    ? 'number'
    : H extends NullType
    ? 'null'
    : H extends ArrayType<infer I>
    ? SerializeArray<I>
    : H extends UnionType<infer U>
    ? SerializeUnion<U, N>
    : H extends ObjectType<infer O>
    ? { [P in keyof O]: O[P] extends StaticType ? Serialize<O[P]> : never }
    : never
  : never;

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

type SerializeArray<I extends StaticType> = Serialize<I, true> extends infer H
  ? H extends string
    ? `${H}[]`
    : never
  : never;

type SerializeUnion<
  U extends Array<StaticType>,
  N extends boolean,
  R extends string = '',
> = U extends []
  ? N extends true
    ? `(${R})`
    : R
  : U[0] extends StaticType
  ? Serialize<U[0], true> extends infer H
    ? H extends string
      ? SerializeUnion<
          Tail<U>,
          N,
          U['length'] extends 1 ? `${R}${H}` : `${R}${H} | `
        >
      : never
    : never
  : never;

type R = Serialize<
  ArrayType<
    UnionType<
      [
        StringLiteralType<'hello'>,
        NumberLiteralType<'2'>,
        ArrayType<UnionType<[StringType, NumberType]>>,
      ]
    >
  >
>;
