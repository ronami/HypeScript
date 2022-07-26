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
  ObjectType,
  FunctionType,
  GetObjectValueByKey,
} from '.';
import type { Tail } from '../Utils';

export type OverlapType<
  TypeA extends StaticType,
  TypeB extends StaticType,
> = TypeA extends ArrayType<infer ArrayTypeA>
  ? TypeB extends ArrayType<infer ArrayTypeB>
    ? OverlapType<ArrayTypeA, ArrayTypeB>
    : false
  : TypeA extends ObjectType<infer PropertiesA>
  ? TypeB extends ObjectType<infer PropertiesB>
    ? OverlapObjectProperties<PropertiesA, PropertiesB>
    : false
  : TypeA extends UnionType<infer UnionTypesA>
  ? TypeB extends UnionType<infer UnionTypesB>
    ? UnionsOverlap<UnionTypesA, UnionTypesB>
    : TypeMatchUnion<UnionTypesA, TypeB>
  : TypeB extends UnionType<infer UnionTypesB>
  ? TypeMatchUnion<UnionTypesB, TypeA>
  : MatchPrimitive<TypeA, TypeB> extends true
  ? true
  : MatchPrimitive<TypeB, TypeA> extends true
  ? true
  : false;

export type MatchType<
  TypeA extends StaticType,
  TypeB extends StaticType,
> = TypeA extends ArrayType<infer ArrayTypeA>
  ? TypeB extends ArrayType<infer ArrayTypeB>
    ? MatchType<ArrayTypeA, ArrayTypeB>
    : false
  : TypeA extends ObjectType<infer PropertiesA>
  ? TypeB extends ObjectType<infer PropertiesB>
    ? MatchObjectProperties<PropertiesA, PropertiesB>
    : false
  : TypeA extends FunctionType<infer ParamsA, infer ReturnA>
  ? TypeB extends FunctionType<infer ParamsB, infer ReturnB>
    ? MatchFunction<ParamsA, ParamsB, ReturnA, ReturnB>
    : false
  : TypeA extends UnionType<infer UnionTypesA>
  ? TypeB extends UnionType<infer UnionTypesB>
    ? UnionMatchUnion<UnionTypesA, UnionTypesB>
    : TypeMatchUnion<UnionTypesA, TypeB>
  : TypeB extends UnionType<infer UnionTypesB>
  ? UnionMatchType<TypeA, UnionTypesB>
  : MatchPrimitive<TypeA, TypeB> extends true
  ? true
  : false;

type MatchFunction<
  ParamsA extends Array<[string, StaticType]>,
  ParamsB extends Array<[string, StaticType]>,
  ReturnA extends StaticType,
  ReturnB extends StaticType,
> = ParamsA extends []
  ? ParamsB extends []
    ? MatchType<ReturnA, ReturnB>
    : false
  : ParamsB extends []
  ? false
  : MatchType<ParamsB[0][1], ParamsA[0][1]> extends true
  ? MatchFunction<Tail<ParamsA>, Tail<ParamsB>, ReturnA, ReturnB>
  : false;

type MatchObjectProperties<
  PropertiesA extends Array<[string, StaticType]>,
  PropertiesB extends Array<[string, StaticType]>,
  Length extends number = PropertiesA['length'],
> = PropertiesA extends []
  ? PropertiesB['length'] extends Length
    ? true
    : false
  : PropertiesB extends []
  ? false
  : MatchType<
      GetObjectValueByKey<PropertiesA, PropertiesA[0][0]>,
      GetObjectValueByKey<PropertiesB, PropertiesA[0][0]>
    > extends true
  ? MatchObjectProperties<Tail<PropertiesA>, PropertiesB, Length>
  : false;

type OverlapObjectProperties<
  PropertiesA extends Array<[string, StaticType]>,
  PropertiesB extends Array<[string, StaticType]>,
  Length extends number = PropertiesA['length'],
> = PropertiesA extends []
  ? PropertiesB['length'] extends Length
    ? true
    : false
  : PropertiesB extends []
  ? false
  : OverlapType<
      GetObjectValueByKey<PropertiesA, PropertiesA[0][0]>,
      GetObjectValueByKey<PropertiesB, PropertiesA[0][0]>
    > extends true
  ? OverlapObjectProperties<Tail<PropertiesA>, PropertiesB, Length>
  : false;

type MatchPrimitive<
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
  : false;

type UnionsOverlap<
  UnionTypesA extends Array<StaticType>,
  UnionTypesB extends Array<StaticType>,
> = UnionTypesB extends []
  ? false
  : TypeMatchUnion<UnionTypesA, UnionTypesB[0]> extends false
  ? UnionMatchUnion<UnionTypesA, Tail<UnionTypesB>>
  : true;

type UnionMatchUnion<
  UnionTypesA extends Array<StaticType>,
  UnionTypesB extends Array<StaticType>,
> = UnionTypesB extends []
  ? true
  : TypeMatchUnion<UnionTypesA, UnionTypesB[0]> extends true
  ? UnionMatchUnion<UnionTypesA, Tail<UnionTypesB>>
  : false;

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
