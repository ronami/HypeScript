export type NodeData<StartLine extends number, EndLine extends number> = {
  startLineNumber: StartLine;
  endLineNumber: EndLine;
};

export type NullLiteral<Data extends NodeData<number, number>> = {
  type: 'NullLiteral';
  data: Data;
};

export type NumericLiteral<
  Value extends string,
  Data extends NodeData<number, number>,
> = {
  type: 'NumericLiteral';
  value: Value;
  data: Data;
};

export type BooleanLiteral<
  Value extends boolean,
  Data extends NodeData<number, number>,
> = {
  type: 'BooleanLiteral';
  value: Value;
  data: Data;
};

export type StringLiteral<
  Value extends string,
  Data extends NodeData<number, number>,
> = {
  type: 'StringLiteral';
  value: Value;
  data: Data;
};

export type ArrayExpression<
  Elements extends Array<BaseNode<any>>,
  Data extends NodeData<number, number>,
> = {
  type: 'ArrayExpression';
  elements: Elements;
  data: Data;
};

export type ObjectExpression<
  Properties extends Array<ObjectProperty<any, any, any>>,
  Data extends NodeData<number, number>,
> = {
  type: 'ObjectExpression';
  properties: Properties;
  data: Data;
};

export type ObjectProperty<
  Key extends Identifier<any, any, any>,
  Value extends BaseNode<any>,
  Data extends NodeData<number, number>,
> = {
  type: 'ObjectProperty';
  key: Key;
  value: Value;
  data: Data;
};

export type VariableDeclaration<
  Declarations extends Array<VariableDeclarator<any, any, any>>,
  Kind extends string,
  Data extends NodeData<number, number>,
> = {
  type: 'VariableDeclaration';
  declarations: Declarations;
  kind: Kind;
  data: Data;
};

export type VariableDeclarator<
  Id extends BaseNode<any>,
  Init extends BaseNode<any>,
  Data extends NodeData<number, number>,
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
  Data extends NodeData<number, number>,
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
  Data extends NodeData<number, number>,
> = {
  type: 'Identifier';
  name: Name;
  typeAnnotation: Annotation;
  data: Data;
};

export type ExpressionStatement<
  Expression extends BaseNode<any>,
  Data extends NodeData<number, number>,
> = {
  type: 'ExpressionStatement';
  expression: Expression;
  data: Data;
};

export type CallExpression<
  Callee extends BaseNode<any>,
  Arguments extends Array<BaseNode<any>>,
  Data extends NodeData<number, number>,
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
  Data extends NodeData<number, number>,
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
  Data extends NodeData<number, number>,
> = {
  type: 'IfStatement';
  test: Test;
  consequent: Consequent;
  data: Data;
  // alternate: A;
};

export type ReturnStatement<
  Argument extends BaseNode<any> | null,
  Data extends NodeData<number, number>,
> = {
  type: 'ReturnStatement';
  argument: Argument;
  data: Data;
};

export type AssignmentExpression<
  Left extends BaseNode<any>,
  Right extends BaseNode<any>,
  Operator extends string,
  Data extends NodeData<number, number>,
> = {
  type: 'AssignmentExpression';
  left: Left;
  right: Right;
  operator: Operator;
  data: Data;
};

export type BlockStatement<
  Body extends Array<BaseNode<any>>,
  Data extends NodeData<number, number>,
> = {
  type: 'BlockStatement';
  body: Body;
  data: Data;
};

export type TypeAnnotation<
  Annotation extends BaseNode<any>,
  Data extends NodeData<number, number>,
> = {
  type: 'TypeAnnotation';
  typeAnnotation: Annotation;
  data: Data;
};

export type StringTypeAnnotation<Data extends NodeData<number, number>> = {
  type: 'StringTypeAnnotation';
  data: Data;
};

export type NumberTypeAnnotation<Data extends NodeData<number, number>> = {
  type: 'NumberTypeAnnotation';
  data: Data;
};

export type NullLiteralTypeAnnotation<Data extends NodeData<number, number>> = {
  type: 'NullLiteralTypeAnnotation';
  data: Data;
};

export type BooleanTypeAnnotation<Data extends NodeData<number, number>> = {
  type: 'BooleanTypeAnnotation';
  data: Data;
};

export type GenericTypeAnnotation<I, Data extends NodeData<number, number>> = {
  type: 'GenericTypeAnnotation';
  id: I;
  data: Data;
};

export type AnyTypeAnnotation<Data extends NodeData<number, number>> = {
  type: 'AnyTypeAnnotation';
  data: Data;
};

export type BaseNode<Data extends NodeData<number, number>> =
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
  | AssignmentExpression<any, any, any, any>
  | BlockStatement<any, Data>
  | TypeAnnotation<any, Data>
  | StringTypeAnnotation<Data>
  | NumberTypeAnnotation<Data>
  | NullLiteralTypeAnnotation<Data>
  | BooleanTypeAnnotation<Data>
  | GenericTypeAnnotation<any, Data>
  | AnyTypeAnnotation<Data>;
