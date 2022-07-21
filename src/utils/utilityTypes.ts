import type { StaticType } from '../types';
import type { ParsingError, TypeError } from '../errors';
import type { BaseNode, NodeData } from '../ast';
import type { Token, TokenData } from '../tokens';

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
  Node extends BaseNode<NodeData<number, number>>,
  TokenList extends Array<Token<any>>,
  Error extends ParsingError<any, any> | null = null,
  Data extends any = null,
> = {
  type: 'ParseResult';
  node: Node;
  tokenList: TokenList;
  error: Error;
  data: Data;
};

export type ParseArrayResult<
  NodeList extends Array<BaseNode<NodeData<number, number>>>,
  TokenList extends Array<Token<TokenData<boolean, number>>>,
  Error extends ParsingError<any, any> | null = null,
  Data extends any = null,
> = {
  type: 'ParseResult';
  node: NodeList;
  tokenList: TokenList;
  error: Error;
  data: Data;
};

export type ParseError<Error extends ParsingError<any, any>> = ParseResult<
  any,
  any,
  Error
>;

export type ParseErrorResult<
  Message extends string,
  LineNumber extends number,
> = ParseError<ParsingError<Message, LineNumber>>;

export type StateType = Record<string, StaticType>;
