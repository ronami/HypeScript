import type { Push } from './utils/arrayUtils';
import type {
  EatFirstChar,
  GetFirstChar,
  ConcatStrings,
  StringContains,
} from './utils/stringUtils';
import type { GenericTokens, Numbers, Symbols } from './utils/generalUtils';
import type {
  Token,
  NumberToken,
  SymbolToken,
  StringToken,
  TokenData,
  GenericToken,
} from './tokens';
import type { SyntaxError } from './errors';
import type { Succ } from './utils/math';

type TokenizeInput<
  Input extends string,
  FirstChar extends string,
  InputTail extends string,
  PrecedingLinebreak extends boolean,
  LineNumber extends number,
  Data extends TokenData<any, any> = TokenData<PrecedingLinebreak, LineNumber>,
> = FirstChar extends GenericTokens
  ? [GenericToken<FirstChar, Data>, InputTail]
  : FirstChar extends Numbers
  ? TokenizeNumber<Input, '', Data, FirstChar>
  : FirstChar extends '"'
  ? TokenizeString<InputTail, '"', Data>
  : FirstChar extends "'"
  ? TokenizeString<InputTail, "'", Data>
  : FirstChar extends Symbols
  ? TokenizeSymbol<Input, '', Data, FirstChar>
  : SyntaxError<`Invalid character.`, LineNumber>;

type TokenizeNumber<
  Input extends string,
  Result extends string,
  PrecedingLinebreak extends TokenData<any, any>,
  FirstChar extends string = GetFirstChar<Input>,
> = FirstChar extends Numbers
  ? TokenizeNumber<
      EatFirstChar<Input>,
      ConcatStrings<Result, FirstChar>,
      PrecedingLinebreak
    >
  : [NumberToken<Result, PrecedingLinebreak>, Input];

type TokenizeString<
  Input extends string,
  QuoteType extends '"' | "'",
  Data extends TokenData<any, any>,
> = Input extends `${infer Before}${QuoteType}${infer After}`
  ? StringContains<Before, '\n'> extends true
    ? SyntaxError<'Unterminated string literal.', Data['lineNumber']>
    : [StringToken<Before, Data>, After]
  : SyntaxError<'Unterminated string literal.', Data['lineNumber']>;

type TokenizeSymbol<
  Input extends string,
  Result extends string,
  PrecedingLinebreak extends TokenData<any, any>,
  FirstChar extends string = GetFirstChar<Input>,
> = FirstChar extends Symbols
  ? TokenizeSymbol<
      EatFirstChar<Input>,
      ConcatStrings<Result, FirstChar>,
      PrecedingLinebreak
    >
  : [SymbolToken<Result, PrecedingLinebreak>, Input];

export type Tokenize<
  Input extends string,
  Result extends Array<Token<any>> = [],
  LineNumber extends number = 1,
  PrecedingLinebreak extends boolean = false,
  FirstChar extends string = GetFirstChar<Input>,
  InputTail extends string = EatFirstChar<Input>,
> = Input extends ''
  ? Result
  : FirstChar extends ' '
  ? Tokenize<InputTail, Result, LineNumber, PrecedingLinebreak>
  : FirstChar extends '\n'
  ? Tokenize<InputTail, Result, Succ<LineNumber>, true>
  : TokenizeInput<
      Input,
      FirstChar,
      InputTail,
      PrecedingLinebreak,
      LineNumber
    > extends infer TokenizeResult
  ? TokenizeHelper<TokenizeResult, Result, LineNumber>
  : never;

type TokenizeHelper<
  TokenizeResult,
  Result extends Array<any>,
  LineNumber extends number,
> = TokenizeResult extends Array<any>
  ? Tokenize<
      TokenizeResult[1],
      Push<Result, TokenizeResult[0]>,
      LineNumber,
      false
    >
  : TokenizeResult;
