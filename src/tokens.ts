export type TokenData<P extends boolean, L extends number> = {
  precedingLinebreak: P;
  lineNumber: L;
};

export type GenericToken<V extends string, D extends TokenData<any, any>> = {
  type: 'generic';
  value: V;
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

export type Token<D extends TokenData<any, any>, V extends string = string> =
  | GenericToken<V, D>
  | NumberToken<V, D>
  | StringToken<V, D>
  | SymbolToken<V, D>;
