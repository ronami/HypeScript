import type { StaticType } from '../Checker';
import type { TypeError } from '../errors';

export type StateType = Record<string, StaticType>;

export type TypeResult<
  Value extends StaticType,
  State extends StateType,
  Errors extends Array<TypeError<any, any>> = [],
> = {
  type: 'TypeResult';
  value: Value;
  state: State;
  errors: Errors;
};
