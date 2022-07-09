export type StringType = {
  type: 'StringType';
};

export type StringLiteralType<V extends string> = {
  type: 'StringLiteralType';
  value: V;
};

export type NumberType = {
  type: 'NumberType';
};

export type NumberLiteralType<V extends string> = {
  type: 'NumberLiteralType';
  value: V;
};

export type BooleanType = {
  type: 'BooleanType';
};

export type BooleanLiteralType<V extends boolean> = {
  type: 'BooleanLiteralType';
  value: V;
};

export type NullType = {
  type: 'NullType';
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

export type FunctionType<P, R> = {
  type: 'FunctionType';
  params: P;
  return: R;
};

export type ObjectType<O> = {
  type: 'ObjectType';
  keys: O;
};

export type ArrayType<V> = {
  type: 'ArrayType';
  value: V;
};

export type UnionType<V> = {
  type: 'UnionType';
  values: V;
};

export type GenericType<T> = {
  type: 'GenericType';
  id: T;
};
