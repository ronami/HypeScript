export type Paren<V> = { type: 'paren'; value: V };

export type Number<V> = { type: 'number'; value: V };

export type String<V> = { type: 'string'; value: V };

export type Symbol<V> = { type: 'symbol'; value: V };

// export type Token<V> =
//   | ParenToken<V>
//   | NumberToken<V>
//   | StringToken<V>
//   | SymbolToken<V>;
