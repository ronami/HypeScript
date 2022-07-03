export type Error<T, M> = {
  type: T;
  message: M;
};

export type SyntaxError<T> = Error<'SyntaxError', T>;
