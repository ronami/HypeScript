import type {
  ArrayType,
  BooleanType,
  NullType,
  NumberType,
  ObjectType,
  StaticType,
  StringType,
  UnionType,
} from './types';
import type { Tail } from './utils/arrayUtils';

export type Serialize<
  T extends StaticType,
  N extends boolean = false,
> = T extends StringType
  ? 'string'
  : T extends BooleanType
  ? 'boolean'
  : T extends NumberType
  ? 'number'
  : T extends NullType
  ? 'null'
  : T extends ArrayType<infer I>
  ? SerializeArray<I>
  : T extends UnionType<infer U>
  ? SerializeUnion<U, N>
  : T extends ObjectType<infer O>
  ? { [P in keyof O]: O[P] extends StaticType ? Serialize<O[P]> : never }
  : never;

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
      [StringType, NumberType, ArrayType<UnionType<[StringType, NumberType]>>]
    >
  >
>;
