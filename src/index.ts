import type { Tokenize, Token } from './Tokenizer';
import type { Parse, BaseNode } from './Parser';
import type { Check } from './Checker';
import type { Format } from './formatter';
import type { Error } from './errors';

export type TypeCheck<Input extends string> =
  Tokenize<Input> extends infer TokenList
    ? TokenList extends Error<any, any>
      ? Format<[TokenList]>
      : TokenList extends Array<Token<any>>
      ? Parse<TokenList> extends infer NodeList
        ? NodeList extends Error<any, any>
          ? Format<[NodeList]>
          : NodeList extends Array<BaseNode<any>>
          ? Format<Check<NodeList>>
          : never
        : never
      : never
    : never;
