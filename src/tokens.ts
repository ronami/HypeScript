export type TokenData = {
  precedingLinebreak: boolean;
  lineNumber: number;
};

export type ParenToken<V, D> = {
  type: 'paren';
  value: V;
  data: D;
};

export type BracketToken<V, D> = {
  type: 'bracket';
  value: V;
  data: D;
};

export type CurlyToken<V, D> = {
  type: 'curly';
  value: V;
  data: D;
};

export type DotToken<D> = {
  type: 'dot';
  data: D;
};

export type SemicolonToken<D> = {
  type: 'semicolon';
  data: D;
};

export type ColonToken<D> = {
  type: 'colon';
  data: D;
};

export type NumberToken<V, T> = {
  type: 'number';
  value: V;
  data: T;
};

export type StringToken<V, T> = {
  type: 'string';
  value: V;
  data: T;
};

export type SymbolToken<V, T> = {
  type: 'symbol';
  value: V;
  data: T;
};

export type CommaToken<D> = {
  type: 'comma';
  data: D;
};

export type Token<V> =
  | NumberToken<V, any>
  | BracketToken<V, any>
  | StringToken<V, any>
  | SymbolToken<V, any>
  | ParenToken<V, any>
  | CurlyToken<V, any>
  | DotToken<any>
  | SemicolonToken<any>
  | ColonToken<any>
  | CommaToken<any>;
