export type NumericLiteral<T> = {
  type: 'NumericLiteral';
  value: T;
};

export type BooleanLiteral<T> = {
  type: 'BooleanLiteral';
  value: T;
};

export type StringLiteral<T> = {
  type: 'StringLiteral';
  value: T;
};

export type ArrayExpression<T> = {
  type: 'ArrayExpression';
  elements: T;
};

export type ObjectExpression<T> = {
  type: 'ObjectExpression';
  properties: T;
};

export type ObjectProperty<K, T> = {
  type: 'ObjectProperty';
  key: K;
  value: T;
};

export type VariableDeclaration<D, K extends 'const' | 'let'> = {
  type: 'VariableDeclaration';
  declarations: D;
  kind: K;
};

export type VariableDeclarator<N, I> = {
  type: 'VariableDeclarator';
  name: N;
  init: I;
};
