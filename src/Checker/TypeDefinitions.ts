import type {
  NumberType,
  StringType,
  BooleanType,
  FunctionType,
  ArrayType,
  StaticType,
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
  fill: FunctionType<
    [['value', ElementsType], ['start', NumberType], ['end', NumberType]],
    ArrayType<ElementsType>
  >;
  reverse: FunctionType<[], ArrayType<ElementsType>>;
  includes: FunctionType<[['searchElement', ElementsType]], BooleanType>;
  join: FunctionType<[['separator', StringType]], StringType>;
  indexOf: FunctionType<[['searchElement', ElementsType]], NumberType>;
  push: FunctionType<[['item', ElementsType]], NumberType>;
  unshift: FunctionType<[['item', ElementsType]], NumberType>;
};
