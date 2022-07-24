import type {
  AnyType,
  BooleanLiteralType,
  BooleanType,
  NeverType,
  NumberLiteralType,
  NumberType,
  StaticType,
  StringLiteralType,
  StringType,
  UnionType,
  ArrayType,
} from '.';
import type { Tail } from '../Utils';

export type MatchType<
  TypeA extends StaticType,
  TypeB extends StaticType,
> = TypeA extends NeverType
  ? false
  : TypeB extends NeverType
  ? false
  : TypeA extends AnyType
  ? true
  : TypeB extends AnyType
  ? true
  : TypeA extends ArrayType<infer ArrayTypeA>
  ? TypeB extends ArrayType<infer ArrayTypeB>
    ? MatchType<ArrayTypeA, ArrayTypeB>
    : false
  : TypeA extends TypeB
  ? TypeB extends TypeA
    ? true
    : false
  : TypeA extends StringType
  ? TypeB extends StringLiteralType<any>
    ? true
    : false
  : TypeA extends BooleanType
  ? TypeB extends BooleanLiteralType<any>
    ? true
    : false
  : TypeA extends NumberType
  ? TypeB extends NumberLiteralType<any>
    ? true
    : false
  : TypeA extends UnionType<infer UnionTypesA>
  ? TypeB extends UnionType<infer UnionTypesB>
    ? UnionMatchUnion<UnionTypesA, UnionTypesB>
    : TypeMatchUnion<UnionTypesA, TypeB>
  : TypeB extends UnionType<infer UnionTypesB>
  ? UnionMatchType<TypeA, UnionTypesB>
  : false;

type UnionMatchUnion<
  UnionTypesA extends Array<StaticType>,
  UnionTypesB extends Array<StaticType>,
> = UnionTypesB extends []
  ? false
  : TypeMatchUnion<UnionTypesA, UnionTypesB[0]> extends false
  ? UnionMatchUnion<UnionTypesA, Tail<UnionTypesB>>
  : true;

type TypeMatchUnion<
  UnionTypes extends Array<StaticType>,
  Type extends StaticType,
> = UnionTypes extends []
  ? false
  : MatchType<UnionTypes[0], Type> extends true
  ? true
  : TypeMatchUnion<Tail<UnionTypes>, Type>;

type UnionMatchType<
  Type extends StaticType,
  UnionTypes extends Array<StaticType>,
> = UnionTypes extends []
  ? true
  : MatchType<Type, UnionTypes[0]> extends true
  ? UnionMatchType<Type, Tail<UnionTypes>>
  : false;
