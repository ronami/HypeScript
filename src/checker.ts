import type {
  BlockStatement,
  BooleanLiteral,
  ExpressionStatement,
  NullLiteral,
  NumericLiteral,
  ReturnStatement,
  StringLiteral,
} from './ast';
import type { Cast } from './utils/generalUtils';

export type Check<T extends Array<any>> = CheckBlock<T>;

type InferExpression<T> = T extends StringLiteral<any>
  ? 'string'
  : T extends NumericLiteral<any>
  ? 'number'
  : T extends NullLiteral
  ? 'null'
  : T extends BooleanLiteral<any>
  ? 'boolean'
  : 'unknown';

type InferBlock<T extends Array<any>, S = {}> = T[0] extends ReturnStatement<
  infer E
>
  ? InferExpression<E>
  : [];

type CheckBlock<
  T extends Array<any>,
  S = {},
> = T[0] extends ExpressionStatement<infer E>
  ? InferExpression<E>
  : T[0] extends BlockStatement<infer B>
  ? InferBlock<Cast<B, Array<any>>>
  : [];
