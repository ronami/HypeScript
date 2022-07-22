export type Error<Message extends string, LineNumber extends number> =
  | SyntaxError<Message, LineNumber>
  | ParsingError<Message, LineNumber>
  | TypeError<Message, LineNumber>;

export type SyntaxError<Message extends string, LineNumber extends number> = {
  type: 'SyntaxError';
  message: Message;
  lineNumber: LineNumber;
};

export type ParsingError<Message extends string, LineNumber extends number> = {
  type: 'ParsingError';
  message: Message;
  lineNumber: LineNumber;
};

export type TypeError<Message extends string, LineNumber extends number> = {
  type: 'TypeError';
  message: Message;
  lineNumber: LineNumber;
};
