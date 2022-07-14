import type { StaticType } from '../types';
import type { TypeError } from '../errors';

export type TypeResult<
  Value extends StaticType,
  State extends Record<string, StaticType>,
  Errors extends Array<TypeError<any, any>> = [],
> = {
  type: 'TypeResult';
  value: Value;
  state: State;
  errors: Errors;
};
