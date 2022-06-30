import type {
  BlockStatement,
  BooleanLiteral,
  ExpressionStatement,
  Identifier,
  IfStatement,
  NullLiteral,
  NumericLiteral,
  ReturnStatement,
  StringLiteral,
  VariableDeclaration,
  VariableDeclarator,
} from './ast';
import type { Concat, Tail, Unshift } from './utils/arrayUtils';
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

type InferBlock<
  T extends Array<any>,
  S = {},
  R extends Array<any> = [],
> = T extends []
  ? Unshift<R, 'void'>
  : T[0] extends ReturnStatement<infer E>
  ? Unshift<R, InferExpression<E, S>>
  : T[0] extends VariableDeclaration<
      [VariableDeclarator<Identifier<infer N>, infer I>],
      any
    >
  ? InferBlock<
      Tail<T>,
      MergeWithOverride<S, { [a in Cast<N, string>]: InferExpression<I, S> }>,
      R
    >
  : T[0] extends IfStatement<any, BlockStatement<infer C>>
  ? InferBlock<Cast<C, Array<any>>, S> extends infer J
    ? Concat<R, Cast<J, Array<any>>> extends infer G
      ? InferBlock<Tail<T>, S, Cast<G, Array<any>>>
      : never
    : never
  : InferBlock<Tail<T>, S, R>;

type CheckBlock<
  T extends Array<any>,
  S = {},
> = T[0] extends ExpressionStatement<infer E>
  ? InferExpression<E, S>
  : T[0] extends BlockStatement<infer B>
  ? InferBlock<Cast<B, Array<any>>, S>
  : [];
