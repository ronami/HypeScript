export type TokenData<
  PrecedingLinebreak extends boolean,
  LineNumber extends number,
> = {
  precedingLinebreak: PrecedingLinebreak;
  lineNumber: LineNumber;
};

export type GenericToken<
  Value extends string,
  Data extends TokenData<any, any>,
> = {
  type: 'generic';
  value: Value;
  data: Data;
};

export type NumberToken<
  Value extends string,
  Data extends TokenData<any, any>,
> = {
  type: 'number';
  value: Value;
  data: Data;
};

export type StringToken<
  Value extends string,
  Data extends TokenData<any, any>,
> = {
  type: 'string';
  value: Value;
  data: Data;
};

export type SymbolToken<
  Value extends string,
  Data extends TokenData<any, any>,
> = {
  type: 'symbol';
  value: Value;
  data: Data;
};

export type Token<
  Data extends TokenData<any, any>,
  Value extends string = string,
> =
  | GenericToken<Value, Data>
  | NumberToken<Value, Data>
  | StringToken<Value, Data>
  | SymbolToken<Value, Data>;
