export type StringType = {
  type: 'StringType';
};

export type NumberType = {
  type: 'NumberType';
};

export type NullType = {
  type: 'NullType';
};

export type BooleanType = {
  type: 'BooleanType';
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

export type ObjectType<K, V> = {
  type: 'ObjectType';
  key: K;
  value: V;
};

export type ArrayType<V> = {
  type: 'ArrayType';
  value: V;
};

export type UnionType<V> = {
  type: 'UnionType';
  values: V;
};
