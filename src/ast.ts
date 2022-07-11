export type NodeData<S extends number, E extends number> = {
  startLineNumber: S;
  endLineNumber: E;
};

export type NullLiteral<D extends NodeData<any, any>> = {
  type: 'NullLiteral';
  data: D;
};

export type NumericLiteral<T extends string, D extends NodeData<any, any>> = {
  type: 'NumericLiteral';
  value: T;
  data: D;
};

export type BooleanLiteral<T extends boolean, D extends NodeData<any, any>> = {
  type: 'BooleanLiteral';
  value: T;
  data: D;
};

export type StringLiteral<T extends string, D extends NodeData<any, any>> = {
  type: 'StringLiteral';
  value: T;
  data: D;
};

export type ArrayExpression<
  T extends Array<Node<any>>,
  D extends NodeData<any, any>,
> = {
  type: 'ArrayExpression';
  elements: T;
  data: D;
};

export type ObjectExpression<
  T extends Array<ObjectProperty<any, any, any>>,
  D extends NodeData<any, any>,
> = {
  type: 'ObjectExpression';
  properties: T;
  data: D;
};

export type ObjectProperty<
  K extends Identifier<any, any, any>,
  T extends Node<any>,
  D extends NodeData<any, any>,
> = {
  type: 'ObjectProperty';
  key: K;
  value: T;
  data: D;
};

export type VariableDeclaration<
  H extends Array<VariableDeclarator<any, any, any>>,
  K extends 'const' | 'let',
  D extends NodeData<any, any>,
> = {
  type: 'VariableDeclaration';
  declarations: H;
  kind: K;
  data: D;
};

export type VariableDeclarator<
  N extends Identifier<any, any, any>,
  I extends Node<any>,
  D extends NodeData<any, any>,
> = {
  type: 'VariableDeclarator';
  id: N;
  init: I;
  data: D;
};

export type FunctionDeclaration<
  I extends Identifier<any, any, any>,
  P extends Array<Node<any>>,
  B extends BlockStatement<any, any>,
  D extends NodeData<any, any>,
> = {
  type: 'FunctionDeclaration';
  id: I;
  params: P;
  body: B;
  data: D;
};

export type Identifier<
  N extends string,
  T extends TypeAnnotation<any, any> | null,
  D extends NodeData<any, any>,
> = {
  type: 'Identifier';
  name: N;
  typeAnnotation: T;
  data: D;
};

export type ExpressionStatement<
  E extends Node<any>,
  D extends NodeData<any, any>,
> = {
  type: 'ExpressionStatement';
  expression: E;
  data: D;
};

export type CallExpression<C, A, D extends NodeData<any, any>> = {
  type: 'CallExpression';
  callee: C;
  arguments: A;
  data: D;
};

export type MemberExpression<
  O extends Node<any>,
  P extends Node<any>,
  C extends boolean,
  D extends NodeData<any, any>,
> = {
  type: 'MemberExpression';
  object: O;
  property: P;
  computed: C;
  data: D;
};

export type IfStatement<
  T extends Node<any>,
  C extends Node<any>,
  D extends NodeData<any, any>,
> = {
  type: 'IfStatement';
  test: T;
  consequent: C;
  data: D;
  // alternate: A;
};

export type ReturnStatement<T, D extends NodeData<any, any>> = {
  type: 'ReturnStatement';
  argument: T;
  data: D;
};

export type BlockStatement<B, D extends NodeData<any, any>> = {
  type: 'BlockStatement';
  body: B;
  data: D;
};

export type TypeAnnotation<
  T extends Node<any>,
  D extends NodeData<any, any>,
> = {
  type: 'TypeAnnotation';
  typeAnnotation: T;
  data: D;
};

export type StringTypeAnnotation<D extends NodeData<any, any>> = {
  type: 'StringTypeAnnotation';
  data: D;
};

export type NumberTypeAnnotation<D extends NodeData<any, any>> = {
  type: 'NumberTypeAnnotation';
  data: D;
};

export type NullLiteralTypeAnnotation<D extends NodeData<any, any>> = {
  type: 'NullLiteralTypeAnnotation';
  data: D;
};

export type BooleanTypeAnnotation<D extends NodeData<any, any>> = {
  type: 'BooleanTypeAnnotation';
  data: D;
};

export type GenericTypeAnnotation<I, D extends NodeData<any, any>> = {
  type: 'GenericTypeAnnotation';
  id: I;
  data: D;
};

export type AnyTypeAnnotation<D extends NodeData<any, any>> = {
  type: 'AnyTypeAnnotation';
  data: D;
};

export type Node<D extends NodeData<any, any>> =
  | NumericLiteral<any, D>
  | BooleanLiteral<any, D>
  | StringLiteral<any, D>
  | ArrayExpression<any, D>
  | ObjectExpression<any, D>
  | ObjectProperty<any, any, D>
  | VariableDeclaration<any, any, D>
  | VariableDeclarator<any, any, D>
  | FunctionDeclaration<any, any, any, D>
  | Identifier<any, any, D>
  | NullLiteral<D>
  | ExpressionStatement<any, D>
  | CallExpression<any, any, D>
  | MemberExpression<any, any, any, D>
  | IfStatement<any, any, D>
  | ReturnStatement<any, D>
  | BlockStatement<any, D>
  | TypeAnnotation<any, D>
  | StringTypeAnnotation<D>
  | NumberTypeAnnotation<D>
  | NullLiteralTypeAnnotation<D>
  | BooleanTypeAnnotation<D>
  | GenericTypeAnnotation<any, D>
  | AnyTypeAnnotation<D>;
