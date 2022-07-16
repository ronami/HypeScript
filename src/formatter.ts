import type { TypeError } from './errors';
import type { Push, Tail } from './utils/arrayUtils';

export type Format<
  Errors extends Array<TypeError<any, any>>,
  Result extends Array<string> = [],
> = Errors extends []
  ? Result
  : Errors[0] extends TypeError<infer Message, infer LineNumber>
  ? Format<Tail<Errors>, Push<Result, `Line ${LineNumber}: ${Message}`>>
  : never;
