export type TokenData<P extends boolean, L extends number> = {
  precedingLinebreak: P;
  lineNumber: L;
};

export type ParenToken<V extends string, D extends TokenData<any, any>> = {
  type: 'paren';
  value: V;
  data: D;
};

export type BracketToken<V extends string, D extends TokenData<any, any>> = {
  type: 'bracket';
  value: V;
  data: D;
};

export type CurlyToken<V extends string, D extends TokenData<any, any>> = {
  type: 'curly';
  value: V;
  data: D;
};

export type DotToken<D extends TokenData<any, any>> = {
  type: 'dot';
  data: D;
};

export type SemicolonToken<D extends TokenData<any, any>> = {
  type: 'semicolon';
  data: D;
};

export type ColonToken<D extends TokenData<any, any>> = {
  type: 'colon';
  data: D;
};

export type NumberToken<V extends string, D extends TokenData<any, any>> = {
  type: 'number';
  value: V;
  data: D;
};

export type StringToken<V extends string, D extends TokenData<any, any>> = {
  type: 'string';
  value: V;
  data: D;
};

export type SymbolToken<V extends string, D extends TokenData<any, any>> = {
  type: 'symbol';
  value: V;
  data: D;
};

export type CommaToken<D extends TokenData<any, any>> = {
  type: 'comma';
  data: D;
};

export type Token<D extends TokenData<any, any>> =
  | NumberToken<any, D>
  | BracketToken<any, D>
  | StringToken<any, D>
  | SymbolToken<any, D>
  | ParenToken<any, D>
  | CurlyToken<any, D>
  | DotToken<D>
  | SemicolonToken<D>
  | ColonToken<D>
  | CommaToken<D>;
