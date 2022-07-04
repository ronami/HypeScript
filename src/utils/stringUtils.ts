export type EatFirstChar<T> = T extends `${infer A}${infer B}` ? B : '';

export type FirstChar<T> = T extends `${infer A}${infer B}` ? A : '';

export type ConcatStrings<A extends string, B extends string> = `${A}${B}`;

export type StringContains<I extends string, T extends string> = I extends T
  ? true
  : I extends `${T}${infer _}`
  ? true
  : I extends `${infer _0}${T}${infer _1}`
  ? true
  : I extends `${infer _}${T}`
  ? true
  : false;
