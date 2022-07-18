export type StringType = {
  type: 'StringType';
};

export type StringLiteralType<Value extends string> = {
  type: 'StringLiteralType';
  value: Value;
};

export type NumberType = {
  type: 'NumberType';
};

export type NumberLiteralType<Value extends string> = {
  type: 'NumberLiteralType';
  value: Value;
};

export type BooleanType = {
  type: 'BooleanType';
};

export type BooleanLiteralType<Value extends boolean> = {
  type: 'BooleanLiteralType';
  value: Value;
};

export type NullType = {
  type: 'NullType';
};

export type UndefinedType = {
  type: 'UndefinedType';
};

export type UnknownType = {
  type: 'UnknownType';
};

export type VoidType = {
  type: 'VoidType';
};

export type AnyType = {
  type: 'AnyType';
};

export type FunctionType<
  Params extends Array<[string, StaticType]>,
  Return extends StaticType,
> = {
  type: 'FunctionType';
  params: Params;
  return: Return;
};

export type ObjectType<Properties extends Array<[string, StaticType]>> = {
  type: 'ObjectType';
  properties: Properties;
};

export type ArrayType<ElementsType extends StaticType> = {
  type: 'ArrayType';
  elements: ElementsType;
};

export type UnionType<Types extends Array<StaticType>> = {
  type: 'UnionType';
  types: Types;
};

export type CallArgumentsType<Arguments extends Array<StaticType>> = {
  type: 'CallArgumentsType';
  arguments: Arguments;
};

// export type GenericType<T> = {
//   type: 'GenericType';
//   id: T;
// };

export type StaticType =
  | StringType
  | StringLiteralType<any>
  | NumberType
  | NumberLiteralType<any>
  | BooleanType
  | BooleanLiteralType<any>
  | UnknownType
  | VoidType
  | AnyType
  | NullType
  | UndefinedType
  | FunctionType<any, any>
  | ObjectType<any>
  | ArrayType<any>
  | UnionType<any>
  | CallArgumentsType<any>;
// | GenericType<any>;
