export type Tail<T extends Array<any>> = ((...t: T) => void) extends (
  h: any,
  ...rest: infer R
) => void
  ? R
  : never;

export type Push<T extends Array<any>, E> = [...T, E];

export type Unshift<T extends Array<any>, E> = [E, ...T];

export type Reverse<
  T extends Array<any>,
  R extends Array<any> = [],
> = T extends [] ? R : Reverse<Tail<T>, Unshift<R, T[0]>>;

export type Head<T extends Array<any>> = T extends [any, ...Array<any>]
  ? T['0']
  : never;

export type Concat<T1 extends Array<any>, T2 extends Array<any>> = [
  ...T1,
  ...T2,
];

export type TailBy<
  T extends Array<any>,
  B extends number,
  A extends Array<any> = [],
> = B extends A['length'] ? T : TailBy<Tail<T>, B, Push<A, 0>>;

export type Includes<T extends Array<any>, E> = T extends []
  ? false
  : T[0] extends E
  ? true
  : Includes<Tail<T>, E>;

export type Uniq<T extends Array<any>, R extends Array<any> = []> = T extends []
  ? R
  : Includes<R, T[0]> extends true
  ? Uniq<Tail<T>, R>
  : Uniq<Tail<T>, Push<R, T[0]>>;
