import type {
  AnyTypeAnnotation,
  ArrayExpression,
  BlockStatement,
  BooleanLiteral,
  BooleanTypeAnnotation,
  ExpressionStatement,
  FunctionDeclaration,
  Identifier,
  IfStatement,
  NullLiteral,
  NullLiteralTypeAnnotation,
  NumberTypeAnnotation,
  NumericLiteral,
  ReturnStatement,
  StringLiteral,
  StringTypeAnnotation,
  TypeAnnotation,
  VariableDeclaration,
  VariableDeclarator,
} from './ast';
import type {
  AnyType,
  ArrayType,
  BooleanType,
  FunctionType,
  NullType,
  NumberType,
  StringType,
  UnknownType,
  VoidType,
} from './types';
import type { Concat, Reverse, Tail, Unshift } from './utils/arrayUtils';
import type { Cast, MergeWithOverride } from './utils/generalUtils';

export type Check<T extends Array<any>> = CheckBlock<T>;

type InferArrayElements<
  T extends Array<any>,
  R extends Array<any> = [],
> = T extends []
  ? R
  : InferArrayElements<Tail<T>, Unshift<R, InferExpression<T[0]>>>;

type InferExpression<T, S = {}> = T extends StringLiteral<any>
  ? StringType
  : T extends NumericLiteral<any>
  ? NumberType
  : T extends NullLiteral
  ? NullType
  : T extends BooleanLiteral<any>
  ? BooleanType
  : T extends Identifier<infer N>
  ? S[Cast<N, keyof S>]
  : T extends ArrayExpression<infer T>
  ? ArrayType<InferArrayElements<Cast<T, Array<any>>>>
  : UnknownType;

type MapTypeAnnotationToType<A> = A extends StringTypeAnnotation
  ? StringType
  : A extends NumberTypeAnnotation
  ? NumberType
  : A extends BooleanTypeAnnotation
  ? BooleanType
  : A extends NullLiteralTypeAnnotation
  ? NullType
  : A extends AnyTypeAnnotation
  ? AnyType
  : never;

type InferFunctionParams<
  T extends Array<any>,
  R extends Array<any> = [],
  G = {},
> = T extends []
  ? [Reverse<R>, G]
  : T[0] extends Identifier<infer N, TypeAnnotation<infer V>>
  ? InferFunctionParams<
      Tail<T>,
      Unshift<R, MapTypeAnnotationToType<V>>,
      MergeWithOverride<
        G,
        { [a in Cast<N, string>]: MapTypeAnnotationToType<V> }
      >
    >
  : never;

type InferBlock<
  T extends Array<any>,
  S = {},
  R extends Array<any> = [],
> = T extends []
  ? Unshift<R, VoidType>
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
  : T[0] extends FunctionDeclaration<
      Identifier<infer I>,
      infer P,
      BlockStatement<infer B>
    >
  ? InferFunctionParams<Cast<P, Array<any>>> extends infer O
    ? InferBlock<
        Tail<T>,
        MergeWithOverride<
          S,
          {
            [a in Cast<I, string>]: FunctionType<
              Cast<O, Array<any>>[0],
              InferBlock<
                Cast<B, Array<any>>,
                MergeWithOverride<S, Cast<O, Array<any>>[1]>
              >
            >;
          }
        >,
        R
      >
    : never
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
