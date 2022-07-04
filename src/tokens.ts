export type ParenToken<V> = { type: 'paren'; value: V };

export type BracketToken<V> = { type: 'bracket'; value: V };

export type CurlyToken<V> = { type: 'curly'; value: V };

export type DotToken = { type: 'dot' };

export type SemicolonToken = { type: 'semicolon' };

export type ColonToken = { type: 'colon' };

export type NumberToken<V, P> = {
  type: 'number';
  value: V;
  precedingLinebreak: P;
};

export type StringToken<V, P> = {
  type: 'string';
  value: V;
  precedingLinebreak: P;
};

export type SymbolToken<V, P> = {
  type: 'symbol';
  value: V;
  precedingLinebreak: P;
};

export type CommaToken = { type: 'comma' };

export type Token<V> =
  | NumberToken<V, any>
  | BracketToken<V>
  | StringToken<V, any>
  | SymbolToken<V, any>
  | ParenToken<V>
  | CurlyToken<V>
  | DotToken
  | SemicolonToken
  | ColonToken
  | CommaToken;
