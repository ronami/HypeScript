import type {
  StaticType,
  NumberLiteralType,
  NumberType,
  StringLiteralType,
  StringType,
  BooleanLiteralType,
  BooleanType,
} from '.';
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

export type MapLiteralToType<Type extends StaticType> =
  Type extends NumberLiteralType<any>
    ? NumberType
    : Type extends StringLiteralType<any>
    ? StringType
    : Type extends BooleanLiteralType<any>
    ? BooleanType
    : Type;
