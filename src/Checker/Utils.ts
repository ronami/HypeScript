import type { StaticType } from '.';
import type { TypeError } from '../Utils';

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
