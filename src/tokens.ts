export type TokenData = {
  precedingLinebreak: boolean;
  lineNumber: number;
};

export type ParenToken<V, D extends TokenData> = {
  type: 'paren';
  value: V;
  data: D;
};

export type BracketToken<V, D extends TokenData> = {
  type: 'bracket';
  value: V;
  data: D;
};

export type CurlyToken<V, D extends TokenData> = {
  type: 'curly';
  value: V;
  data: D;
};

export type DotToken<D extends TokenData> = {
  type: 'dot';
  data: D;
};

export type SemicolonToken<D extends TokenData> = {
  type: 'semicolon';
  data: D;
};

export type ColonToken<D extends TokenData> = {
  type: 'colon';
  data: D;
};

export type NumberToken<V, D extends TokenData> = {
  type: 'number';
  value: V;
  data: D;
};

export type StringToken<V, D extends TokenData> = {
  type: 'string';
  value: V;
  data: D;
};

export type SymbolToken<V, D extends TokenData> = {
  type: 'symbol';
  value: V;
  data: D;
};

export type CommaToken<D extends TokenData> = {
  type: 'comma';
  data: D;
};

export type Token<V, D extends TokenData> =
  | NumberToken<V, D>
  | BracketToken<V, D>
  | StringToken<V, D>
  | SymbolToken<V, D>
  | ParenToken<V, D>
  | CurlyToken<V, D>
  | DotToken<D>
  | SemicolonToken<D>
  | ColonToken<D>
  | CommaToken<D>;
