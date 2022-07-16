import type { Error } from './errors';
import type { Push, Tail } from './utils/arrayUtils';

export type Format<
  Errors extends Array<Error<any, any>>,
  Result extends Array<string> = [],
> = Errors extends []
  ? Result
  : Errors[0] extends Error<infer Message, infer LineNumber>
  ? Format<Tail<Errors>, Push<Result, `${LineNumber}: ${Message}`>>
  : never;
