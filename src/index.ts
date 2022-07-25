import type { Tokenize, Token } from './Tokenizer';
import type { Parse, BaseNode } from './Parser';
import type { Check } from './Checker';
import type { Format, Error } from './Utils';

export type TypeCheck<Input extends string> =
  // Tokenize input
  Tokenize<Input> extends infer TokenList
    ? TokenList extends Error<any, any>
      ? // If any errors, format them
        Format<[TokenList]>
      : TokenList extends Array<Token<any>>
      ? // If successful, parse into an ast
        Parse<TokenList> extends infer NodeList
        ? NodeList extends Error<any, any>
          ? // If any errors, format them
            Format<[NodeList]>
          : NodeList extends Array<BaseNode<any>>
          ? // If successful, type-check and format errors
            Format<Check<NodeList>>
          : never
        : never
      : never
    : never;
