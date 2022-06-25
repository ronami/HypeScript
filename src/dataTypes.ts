// Tokenizer types
export type ParenToken<V> = { type: 'paren'; value: V };

export type NumberToken<V> = { type: 'number'; value: V };

export type StringToken<V> = { type: 'string'; value: V };

export type SymbolToken<V> = { type: 'symbol'; value: V };

export type Token<V> =
  | ParenToken<V>
  | NumberToken<V>
  | StringToken<V>
  | SymbolToken<V>;
