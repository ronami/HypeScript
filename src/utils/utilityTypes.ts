import type { StaticType } from '../types';
import type { ParsingError, TypeError } from '../errors';
import type { BaseNode } from '../ast';
import type { Token } from '../tokens';

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

export type ParseResult<
  Node extends BaseNode<any>,
  TokenList extends Array<Token<any>>,
  Error extends ParsingError<any, any> | null = null,
> = {
  type: 'ParseResult';
  node: Node;
  tokenList: TokenList;
  error: Error;
};

export type ParseError<Error extends ParsingError<any, any>> = ParseResult<
  any,
  any,
  Error
>;

export type StateType = Record<string, StaticType>;
