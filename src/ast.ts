export type NodeData<StartLine extends number, EndLine extends number> = {
  startLineNumber: StartLine;
  endLineNumber: EndLine;
};

export type NullLiteral<Data extends NodeData<any, any>> = {
  type: 'NullLiteral';
  data: Data;
};

export type NumericLiteral<
  Value extends string,
  Data extends NodeData<any, any>,
> = {
  type: 'NumericLiteral';
  value: Value;
  data: Data;
};

export type BooleanLiteral<
  Value extends boolean,
  Data extends NodeData<any, any>,
> = {
  type: 'BooleanLiteral';
  value: Value;
  data: Data;
};

export type StringLiteral<
  Value extends string,
  Data extends NodeData<any, any>,
> = {
  type: 'StringLiteral';
  value: Value;
  data: Data;
};

export type ArrayExpression<
  Elements extends Array<BaseNode<any>>,
  Data extends NodeData<any, any>,
> = {
  type: 'ArrayExpression';
  elements: Elements;
  data: Data;
};

export type ObjectExpression<
  Properties extends Array<ObjectProperty<any, any, any>>,
  Data extends NodeData<any, any>,
> = {
  type: 'ObjectExpression';
  properties: Properties;
  data: Data;
};

export type ObjectProperty<
  Key extends Identifier<any, any, any>,
  Value extends BaseNode<any>,
  Data extends NodeData<any, any>,
> = {
  type: 'ObjectProperty';
  key: Key;
  value: Value;
  data: Data;
};

export type VariableDeclaration<
  Declarations extends Array<VariableDeclarator<any, any, any>>,
  Kind extends 'const' | 'let',
  Data extends NodeData<any, any>,
> = {
  type: 'VariableDeclaration';
  declarations: Declarations;
  kind: Kind;
  data: Data;
};

export type VariableDeclarator<
  Id extends BaseNode<any>,
  Init extends BaseNode<any>,
  Data extends NodeData<any, any>,
> = {
  type: 'VariableDeclarator';
  id: Id;
  init: Init;
  data: Data;
};

export type FunctionDeclaration<
  Id extends Identifier<any, any, any>,
  Params extends Array<BaseNode<any>>,
  Body extends BaseNode<any>,
  Data extends NodeData<any, any>,
> = {
  type: 'FunctionDeclaration';
  id: Id;
  params: Params;
  body: Body;
  data: Data;
};

export type Identifier<
  Name extends string,
  Annotation extends BaseNode<any> | null,
  Data extends NodeData<any, any>,
> = {
  type: 'Identifier';
  name: Name;
  typeAnnotation: Annotation;
  data: Data;
};

export type ExpressionStatement<
  Expression extends BaseNode<any>,
  Data extends NodeData<any, any>,
> = {
  type: 'ExpressionStatement';
  expression: Expression;
  data: Data;
};

export type CallExpression<
  Callee extends BaseNode<any>,
  Arguments extends Array<BaseNode<any>>,
  Data extends NodeData<any, any>,
> = {
  type: 'CallExpression';
  callee: Callee;
  arguments: Arguments;
  data: Data;
};

export type MemberExpression<
  Object extends BaseNode<any>,
  Property extends BaseNode<any>,
  Computed extends boolean,
  Data extends NodeData<any, any>,
> = {
  type: 'MemberExpression';
  object: Object;
  property: Property;
  computed: Computed;
  data: Data;
};

export type IfStatement<
  Test extends BaseNode<any>,
  Consequent extends BaseNode<any>,
  Data extends NodeData<any, any>,
> = {
  type: 'IfStatement';
  test: Test;
  consequent: Consequent;
  data: Data;
  // alternate: A;
};

export type ReturnStatement<
  Argument extends BaseNode<any> | null,
  Data extends NodeData<any, any>,
> = {
  type: 'ReturnStatement';
  argument: Argument;
  data: Data;
};

export type BlockStatement<
  Body extends Array<BaseNode<any>>,
  Data extends NodeData<any, any>,
> = {
  type: 'BlockStatement';
  body: Body;
  data: Data;
};

export type TypeAnnotation<
  Annotation extends BaseNode<any>,
  Data extends NodeData<any, any>,
> = {
  type: 'TypeAnnotation';
  typeAnnotation: Annotation;
  data: Data;
};

export type StringTypeAnnotation<Data extends NodeData<any, any>> = {
  type: 'StringTypeAnnotation';
  data: Data;
};

export type NumberTypeAnnotation<Data extends NodeData<any, any>> = {
  type: 'NumberTypeAnnotation';
  data: Data;
};

export type NullLiteralTypeAnnotation<Data extends NodeData<any, any>> = {
  type: 'NullLiteralTypeAnnotation';
  data: Data;
};

export type BooleanTypeAnnotation<Data extends NodeData<any, any>> = {
  type: 'BooleanTypeAnnotation';
  data: Data;
};

export type GenericTypeAnnotation<I, Data extends NodeData<any, any>> = {
  type: 'GenericTypeAnnotation';
  id: I;
  data: Data;
};

export type AnyTypeAnnotation<Data extends NodeData<any, any>> = {
  type: 'AnyTypeAnnotation';
  data: Data;
};

export type BaseNode<Data extends NodeData<any, any>> =
  | NumericLiteral<any, Data>
  | BooleanLiteral<any, Data>
  | StringLiteral<any, Data>
  | ArrayExpression<any, Data>
  | ObjectExpression<any, Data>
  | ObjectProperty<any, any, Data>
  | VariableDeclaration<any, any, Data>
  | VariableDeclarator<any, any, Data>
  | FunctionDeclaration<any, any, any, Data>
  | Identifier<any, any, Data>
  | NullLiteral<Data>
  | ExpressionStatement<any, Data>
  | CallExpression<any, any, Data>
  | MemberExpression<any, any, any, Data>
  | IfStatement<any, any, Data>
  | ReturnStatement<any, Data>
  | BlockStatement<any, Data>
  | TypeAnnotation<any, Data>
  | StringTypeAnnotation<Data>
  | NumberTypeAnnotation<Data>
  | NullLiteralTypeAnnotation<Data>
  | BooleanTypeAnnotation<Data>
  | GenericTypeAnnotation<any, Data>
  | AnyTypeAnnotation<Data>;
