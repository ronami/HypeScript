export type Error<
  Type extends string,
  Message extends string,
  LineNumber extends number,
> = {
  type: Type;
  message: Message;
  lineNumber: LineNumber;
};

export type SyntaxError<
  Message extends string,
  LineNumber extends number,
> = Error<'SyntaxError', Message, LineNumber>;

export type ParsingError<
  Message extends string,
  LineNumber extends number,
> = Error<'ParsingError', Message, LineNumber>;

export type TypeError<
  Message extends string,
  LineNumber extends number,
> = Error<'TypeError', Message, LineNumber>;
