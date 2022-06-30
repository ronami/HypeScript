import type { Cast } from './generalUtils';

export type Tail<T extends Array<any>> = ((...t: T) => void) extends (
  h: any,
  ...rest: infer R
) => void
  ? R
  : never;

export type Unshift<T extends Array<any>, E> = ((
  h: E,
  ...t: T
) => void) extends (...t: infer R) => void
  ? R
  : never;

export type Reverse<
  T extends Array<any>,
  R extends Array<any> = [],
> = T extends [] ? R : Reverse<Tail<T>, Unshift<R, T[0]>>;

export type Head<T extends Array<any>> = T extends [any, ...Array<any>]
  ? T['0']
  : never;

export type Concat<T1 extends Array<any>, T2 extends Array<any>> = T2 extends []
  ? T1
  : Concat<Unshift<T1, Head<T2>>, Tail<T2>>;
