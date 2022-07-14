export type Error<T extends string, M extends string, L extends number> = {
  type: T;
  message: M;
  lineNumber: L;
};

export type SyntaxError<M extends string, L extends number> = Error<
  'SyntaxError',
  M,
  L
>;

export type TypeError<M extends string, L extends number> = Error<
  'TypeError',
  M,
  L
>;
