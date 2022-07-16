import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';
import type { Format } from './formatter';
import type { Error } from './errors';
import type { Token } from './tokens';
import type { BaseNode } from './ast';

export type TypeCheck<Input extends string> =
  Tokenize<Input> extends infer TokenList
    ? TokenList extends Error<any, any>
      ? Format<[TokenList]>
      : TokenList extends Array<Token<any>>
      ? Parse<TokenList> extends infer NodeList
        ? NodeList extends Error<any, any>
          ? Format<[NodeList]>
          : NodeList extends Array<BaseNode<any>>
          ? Check<NodeList> extends infer Errors
            ? Errors extends Array<Error<any, any>>
              ? Format<Errors>
              : never
            : never
          : never
        : never
      : never
    : never;
