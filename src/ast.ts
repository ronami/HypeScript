export type VariableDeclaration<T> = {
  type: 'VariableDeclaration';
  declarations: T;
};

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
