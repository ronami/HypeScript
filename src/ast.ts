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
  id: N;
  init: I;
};

export type FunctionDeclaration<I, P, B> = {
  type: 'FunctionDeclaration';
  id: I;
  params: P;
  body: B;
};

export type Identifier<N> = {
  type: 'Identifier';
  name: N;
};

export type NullLiteral = {
  type: 'NullLiteral';
};

export type ExpressionStatement<E> = {
  type: 'ExpressionStatement';
  expression: E;
};

export type CallExpression<C, A> = {
  type: 'CallExpression';
  callee: C;
  arguments: A;
};

export type MemberExpression<O, P> = {
  type: 'MemberExpression';
  object: O;
  property: P;
};

export type IfStatement<T, C> = {
  type: 'IfStatement';
  test: T;
  consequent: C;
  // alternate: A;
};

// ReturnStatement
// IfStatement
// BlockStatement

// Add unit-tests
// Fn-calls, member-access on expressions
// Parse statements, parse expressions, no parse literal
// Show parse errors
// Type check and inference
