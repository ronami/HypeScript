export type ParenToken<V> = { type: 'paren'; value: V };

export type BracketToken<V> = { type: 'bracket'; value: V };

export type CurlyToken<V> = { type: 'curly'; value: V };

export type DotToken = { type: 'dot' };

export type SemicolonToken = { type: 'semicolon' };

export type ColonToken = { type: 'colon' };

export type NumberToken<V> = { type: 'number'; value: V };

export type StringToken<V> = { type: 'string'; value: V };

export type SymbolToken<V> = { type: 'symbol'; value: V };

export type CommaToken = { type: 'comma' };

export type Token<V> =
  | NumberToken<V>
  | BracketToken<V>
  | StringToken<V>
  | SymbolToken<V>
  | ParenToken<V>
  | CurlyToken<V>
  | DotToken
  | SemicolonToken
  | ColonToken
  | CommaToken;
