import type {
  NumberType,
  StringType,
  BooleanType,
  FunctionType,
  ArrayType,
  StaticType,
  AnyType,
  UndefinedType,
  MergeTypes,
} from '.';

export type StringTypeMembers = {
  length: NumberType;
  includes: FunctionType<[['searchString', StringType]], BooleanType>;
  charAt: FunctionType<[['pos', NumberType]], StringType>;
  indexOf: FunctionType<[['searchString', StringType]], NumberType>;
  startsWith: FunctionType<[['searchString', StringType]], BooleanType>;
  endsWith: FunctionType<[['searchString', StringType]], BooleanType>;
  split: FunctionType<[['separator', StringType]], ArrayType<StringType>>;
  replace: FunctionType<
    [['searchValue', StringType], ['replaceValue', StringType]],
    StringType
  >;
};

export type ArrayTypeMembers<ElementsType extends StaticType> = {
  length: NumberType;
  fill: FunctionType<[['value', ElementsType]], ArrayType<ElementsType>>;
  reverse: FunctionType<[], ArrayType<ElementsType>>;
  includes: FunctionType<[['searchElement', ElementsType]], BooleanType>;
  join: FunctionType<[['separator', StringType]], StringType>;
  indexOf: FunctionType<[['searchElement', ElementsType]], NumberType>;
  push: FunctionType<[['item', ElementsType]], NumberType>;
  pop: MergeTypes<ElementsType, UndefinedType> extends infer ReturnType
    ? ReturnType extends StaticType
      ? FunctionType<[], ReturnType>
      : never
    : never;
  unshift: FunctionType<[['item', ElementsType]], NumberType>;
};

export type FunctionTypeMembers = {
  length: NumberType;
  name: StringType;
  prototype: AnyType;
  toString: FunctionType<[], StringType>;
};
