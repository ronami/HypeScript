export type Error<T, M, L> = {
  type: T;
  message: M;
  lineNumber: L;
};

export type SyntaxError<T, L> = Error<'SyntaxError', T, L>;
