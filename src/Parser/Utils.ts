import type { BaseNode, NodeData, IfStatement, FunctionDeclaration } from '.';
import type { ParsingError } from '../Utils';
import type { Token, TokenData } from '../Tokenizer';

export type ParseResult<
  Node extends BaseNode<NodeData<number, number>>,
  TokenList extends Array<Token<any>>,
  Error extends ParsingError<any, any> | null = null,
  Scope extends ScopeType = {},
> = {
  type: 'ParseResult';
  node: Node;
  tokenList: TokenList;
  error: Error;
  scope: Scope;
};

export type ParseArrayResult<
  NodeList extends Array<BaseNode<NodeData<number, number>>>,
  TokenList extends Array<Token<TokenData<boolean, number>>>,
  Error extends ParsingError<any, any> | null = null,
  Scope extends ScopeType = {},
> = {
  type: 'ParseResult';
  node: NodeList;
  tokenList: TokenList;
  error: Error;
  scope: Scope;
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

export type ScopeType = Record<string, boolean>;

export type NodeRequiresSemicolon<Node extends BaseNode<any>> =
  Node extends IfStatement<any, any, any>
    ? false
    : Node extends FunctionDeclaration<any, any, any, any>
    ? false
    : true;
