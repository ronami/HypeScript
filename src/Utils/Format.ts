import type { Push, Tail, Error } from '.';

export type Format<
  Errors extends Array<Error<string, number>>,
  Result extends Array<string> = [],
> = Errors extends []
  ? Result
  : Errors[0] extends Error<infer Message, infer LineNumber>
  ? Format<Tail<Errors>, Push<Result, `${LineNumber}: ${Message}`>>
  : never;
