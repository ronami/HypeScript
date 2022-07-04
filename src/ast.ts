export type NodeData = {
  startLineNumber: number;
  endLineNumber: number;
};

export type NumericLiteral<T, D extends NodeData> = {
  type: 'NumericLiteral';
  value: T;
  data: D;
};

export type BooleanLiteral<T, D extends NodeData> = {
  type: 'BooleanLiteral';
  value: T;
  data: D;
};

export type StringLiteral<T, D extends NodeData> = {
  type: 'StringLiteral';
  value: T;
  data: D;
};

export type ArrayExpression<T, D extends NodeData> = {
  type: 'ArrayExpression';
  elements: T;
  data: D;
};

export type ObjectExpression<T, D extends NodeData> = {
  type: 'ObjectExpression';
  properties: T;
  data: D;
};

export type ObjectProperty<K, T, D extends NodeData> = {
  type: 'ObjectProperty';
  key: K;
  value: T;
  data: D;
};

export type VariableDeclaration<
  H,
  K extends 'const' | 'let',
  D extends NodeData,
> = {
  type: 'VariableDeclaration';
  declarations: H;
  kind: K;
  data: D;
};

export type VariableDeclarator<N, I, D extends NodeData> = {
  type: 'VariableDeclarator';
  id: N;
  init: I;
  data: D;
};

export type FunctionDeclaration<I, P, B, D extends NodeData> = {
  type: 'FunctionDeclaration';
  id: I;
  params: P;
  body: B;
  data: D;
};

export type Identifier<N, T, D extends NodeData> = {
  type: 'Identifier';
  name: N;
  typeAnnotation: T;
  data: D;
};

export type NullLiteral<D extends NodeData> = {
  type: 'NullLiteral';
  data: D;
};

export type ExpressionStatement<E, D extends NodeData> = {
  type: 'ExpressionStatement';
  expression: E;
  data: D;
};

export type CallExpression<C, A, D extends NodeData> = {
  type: 'CallExpression';
  callee: C;
  arguments: A;
  data: D;
};

export type MemberExpression<O, P, D extends NodeData> = {
  type: 'MemberExpression';
  object: O;
  property: P;
  data: D;
};

export type IfStatement<T, C, D extends NodeData> = {
  type: 'IfStatement';
  test: T;
  consequent: C;
  data: D;
  // alternate: A;
};

export type ReturnStatement<T, D extends NodeData> = {
  type: 'ReturnStatement';
  argument: T;
  data: D;
};

export type BlockStatement<B, D extends NodeData> = {
  type: 'BlockStatement';
  body: B;
  data: D;
};

export type TypeAnnotation<T, D extends NodeData> = {
  type: 'TypeAnnotation';
  typeAnnotation: T;
  data: D;
};

export type StringTypeAnnotation<D extends NodeData> = {
  type: 'StringTypeAnnotation';
  data: D;
};

export type NumberTypeAnnotation<D extends NodeData> = {
  type: 'NumberTypeAnnotation';
  data: D;
};

export type NullLiteralTypeAnnotation<D extends NodeData> = {
  type: 'NullLiteralTypeAnnotation';
  data: D;
};

export type BooleanTypeAnnotation<D extends NodeData> = {
  type: 'BooleanTypeAnnotation';
  data: D;
};

export type GenericTypeAnnotation<I, D extends NodeData> = {
  type: 'GenericTypeAnnotation';
  id: I;
  data: D;
};

export type AnyTypeAnnotation<D extends NodeData> = {
  type: 'AnyTypeAnnotation';
  data: D;
};
