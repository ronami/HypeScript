import type {
  BlockStatement,
  BooleanLiteral,
  ExpressionStatement,
  Identifier,
  NullLiteral,
  NumericLiteral,
  ReturnStatement,
  StringLiteral,
  VariableDeclaration,
  VariableDeclarator,
} from './ast';
import type { Tail } from './utils/arrayUtils';
import type { Cast, MergeWithOverride } from './utils/generalUtils';

export type Check<T extends Array<any>> = CheckBlock<T>;

type InferExpression<T, S = {}> = T extends StringLiteral<any>
  ? 'string'
  : T extends NumericLiteral<any>
  ? 'number'
  : T extends NullLiteral
  ? 'null'
  : T extends BooleanLiteral<any>
  ? 'boolean'
  : T extends Identifier<infer N>
  ? S[Cast<N, keyof S>]
  : 'unknown';

type InferBlock<T extends Array<any>, S = {}> = T extends []
  ? 'void'
  : T[0] extends ReturnStatement<infer E>
  ? InferExpression<E, S>
  : T[0] extends VariableDeclaration<
      [VariableDeclarator<Identifier<infer N>, infer I>],
      any
    >
  ? InferBlock<
      Tail<T>,
      MergeWithOverride<S, { [a in Cast<N, string>]: InferExpression<I, S> }>
    >
  : InferBlock<Tail<T>, S>;

type CheckBlock<
  T extends Array<any>,
  S = {},
> = T[0] extends ExpressionStatement<infer E>
  ? InferExpression<E>
  : T[0] extends BlockStatement<infer B>
  ? InferBlock<Cast<B, Array<any>>>
  : [];
