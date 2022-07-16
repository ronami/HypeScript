import type {
  ArrayExpression,
  BooleanLiteral,
  NumericLiteral,
  ObjectExpression,
  StringLiteral,
  ObjectProperty,
  VariableDeclaration,
  VariableDeclarator,
  FunctionDeclaration,
  Identifier,
  NullLiteral,
  ExpressionStatement,
  CallExpression,
  MemberExpression,
  IfStatement,
  ReturnStatement,
  BlockStatement,
  TypeAnnotation,
  GenericTypeAnnotation,
  StringTypeAnnotation,
  BooleanTypeAnnotation,
  NullLiteralTypeAnnotation,
  NumberTypeAnnotation,
  AnyTypeAnnotation,
  NodeData,
  BaseNode,
} from './ast';
import type { Error, SyntaxError } from './errors';
import type {
  GenericToken,
  NumberToken,
  StringToken,
  SymbolToken,
  Token,
  TokenData,
} from './tokens';
import type { Push, Tail, TailBy } from './utils/arrayUtils';

type ExtractTokenData<
  T extends Token<any>,
  R extends Token<any> = T,
> = T extends Token<TokenData<any, infer D>>
  ? R extends Token<TokenData<any, infer H>>
    ? NodeData<D, H>
    : never
  : never;

type ParseIdentifier<
  TokenList extends Array<Token<any>>,
  CanBeAnnotated extends boolean,
> = TokenList[0] extends SymbolToken<
  infer Name,
  TokenData<any, infer IdentifierLineNumber>
>
  ? CanBeAnnotated extends true
    ? TokenList[1] extends GenericToken<
        ':',
        TokenData<any, infer ColonLineNumber>
      >
      ? ParseTypeAnnotation<TailBy<TokenList, 2>> extends infer J
        ? J extends Array<any>
          ? [
              Identifier<
                Name,
                J[0],
                NodeData<IdentifierLineNumber, IdentifierLineNumber>
              >,
              J[1],
            ]
          : J extends Error<any, any, any>
          ? J
          : SyntaxError<'Type expected.', ColonLineNumber>
        : never
      : [
          Identifier<
            Name,
            null,
            NodeData<IdentifierLineNumber, IdentifierLineNumber>
          >,
          Tail<TokenList>,
        ]
    : [
        Identifier<
          Name,
          null,
          NodeData<IdentifierLineNumber, IdentifierLineNumber>
        >,
        Tail<TokenList>,
      ]
  : null;

type ParseVariableDeclarationHelper<
  TokenList extends Array<Token<any>>,
  Id extends Identifier<any, any, any>,
  KindLineNumber extends number,
  IdentifierLineNumber extends number,
  EqualsLineNumber extends number,
> = ParseExpression<Tail<TokenList>> extends infer G
  ? G extends Array<any>
    ? G[0] extends BaseNode<NodeData<infer InitLineNumber, any>>
      ? [
          VariableDeclaration<
            [
              VariableDeclarator<
                Id,
                G[0],
                NodeData<IdentifierLineNumber, InitLineNumber>
              >,
            ],
            'const',
            NodeData<KindLineNumber, InitLineNumber>
          >,
          G[1],
        ]
      : never
    : G extends null
    ? SyntaxError<'Expression expected.', EqualsLineNumber>
    : G
  : never;

type ParseTypeAnnotation<TokenList extends Array<Token<any>>> =
  TokenList[0] extends SymbolToken<'string', TokenData<any, infer LineNumber>>
    ? [
        TypeAnnotation<
          StringTypeAnnotation<NodeData<LineNumber, LineNumber>>,
          NodeData<LineNumber, LineNumber>
        >,
        Tail<TokenList>,
      ]
    : TokenList[0] extends SymbolToken<
        'boolean',
        TokenData<any, infer LineNumber>
      >
    ? [
        TypeAnnotation<
          BooleanTypeAnnotation<NodeData<LineNumber, LineNumber>>,
          NodeData<LineNumber, LineNumber>
        >,
        Tail<TokenList>,
      ]
    : TokenList[0] extends SymbolToken<'null', TokenData<any, infer LineNumber>>
    ? [
        TypeAnnotation<
          NullLiteralTypeAnnotation<NodeData<LineNumber, LineNumber>>,
          NodeData<LineNumber, LineNumber>
        >,
        Tail<TokenList>,
      ]
    : TokenList[0] extends SymbolToken<
        'number',
        TokenData<any, infer LineNumber>
      >
    ? [
        TypeAnnotation<
          NumberTypeAnnotation<NodeData<LineNumber, LineNumber>>,
          NodeData<LineNumber, LineNumber>
        >,
        Tail<TokenList>,
      ]
    : TokenList[0] extends SymbolToken<'any', TokenData<any, infer LineNumber>>
    ? [
        TypeAnnotation<
          AnyTypeAnnotation<NodeData<LineNumber, LineNumber>>,
          NodeData<LineNumber, LineNumber>
        >,
        Tail<TokenList>,
      ]
    : TokenList[0] extends SymbolToken<
        infer E,
        TokenData<any, infer LineNumber>
      >
    ? [
        TypeAnnotation<
          GenericTypeAnnotation<E, NodeData<LineNumber, LineNumber>>,
          NodeData<LineNumber, LineNumber>
        >,
        Tail<TokenList>,
      ]
    : null;

type ParseVariableDeclaration<TokenList extends Array<Token<any>>> =
  TokenList[0] extends SymbolToken<
    'const',
    TokenData<any, infer KindLineNumber>
  >
    ? ParseIdentifier<Tail<TokenList>, true> extends infer N
      ? N extends [
          Identifier<any, any, NodeData<infer IdentifierLineNumber, any>>,
          infer R,
        ]
        ? R extends Array<any>
          ? R[0] extends SymbolToken<
              '=',
              TokenData<any, infer EqualsLineNumber>
            >
            ? ParseVariableDeclarationHelper<
                R,
                N[0],
                KindLineNumber,
                IdentifierLineNumber,
                EqualsLineNumber
              >
            : SyntaxError<
                "'const' declarations must be initialized.",
                IdentifierLineNumber
              >
          : never
        : N extends null
        ? SyntaxError<
            'Variable declaration list cannot be empty.',
            KindLineNumber
          >
        : N
      : never
    : null;

type ParseMemberExpression<
  Node extends BaseNode<any>,
  TokenList extends Array<Token<any>>,
> = Node extends BaseNode<NodeData<infer NodeLineNumber, any>>
  ? TokenList[0] extends GenericToken<'.', TokenData<any, infer DotLineNumber>>
    ? TokenList[1] extends SymbolToken<
        infer Name,
        TokenData<any, infer IdentifierLineNumber>
      >
      ? [
          MemberExpression<
            Node,
            Identifier<
              Name,
              null,
              NodeData<IdentifierLineNumber, IdentifierLineNumber>
            >,
            false,
            NodeData<NodeLineNumber, IdentifierLineNumber>
          >,
          TailBy<TokenList, 2>,
        ]
      : SyntaxError<'Identifier expected.', DotLineNumber>
    : TokenList[0] extends GenericToken<
        '[',
        TokenData<any, infer BracketLineNumber>
      >
    ? ParseExpression<Tail<TokenList>> extends infer G
      ? G extends [infer Q, infer W]
        ? Q extends BaseNode<NodeData<infer S, any>>
          ? W extends Array<Token<any>>
            ? W[0] extends GenericToken<']', any>
              ? [MemberExpression<Node, Q, true, NodeData<1, 1>>, Tail<W>]
              : SyntaxError<"']' expected.", S>
            : never
          : never
        : G extends null
        ? SyntaxError<'Expression expected.', BracketLineNumber>
        : G
      : never
    : null
  : never;

type ParseCallExpression<
  Node extends BaseNode<any>,
  TokenList extends Array<Token<any>>,
> = TokenList[0] extends GenericToken<
  '(',
  TokenData<any, infer ParenLineNumber>
>
  ? ParseCallExpressionArguments<
      Tail<TokenList>,
      ParenLineNumber,
      ')'
    > extends infer G
    ? G extends Array<any>
      ? Node extends BaseNode<NodeData<infer NodeStartLine, any>>
        ? G[2] extends Token<TokenData<any, infer L>>
          ? [CallExpression<Node, G[0], NodeData<NodeStartLine, L>>, G[1]]
          : never
        : never
      : G
    : never
  : null;

type ParseCallExpressionArguments<
  TokenList extends Array<Token<any>>,
  ParenLineNumber extends number,
  ClosingString extends string,
  NeedComma extends boolean = false,
  Result extends Array<BaseNode<any>> = [],
> = TokenList[0] extends GenericToken<ClosingString, any>
  ? [Result, Tail<TokenList>, TokenList[0]]
  : TokenList extends []
  ? SyntaxError<`'${ClosingString}' expected.`, ParenLineNumber>
  : NeedComma extends true
  ? TokenList[0] extends GenericToken<',', any>
    ? ParseCallExpressionArgumentsHelper<
        Tail<TokenList>,
        ParenLineNumber,
        ClosingString,
        Result
      >
    : TokenList[0] extends Token<TokenData<any, infer LineNumber>>
    ? SyntaxError<"',' expected.", LineNumber>
    : never
  : ParseCallExpressionArgumentsHelper<
      TokenList,
      ParenLineNumber,
      ClosingString,
      Result
    >;

type ParseCallExpressionArgumentsHelper<
  TokenList extends Array<Token<any>>,
  ParenLineNumber extends number,
  ClosingString extends string,
  Result extends Array<BaseNode<any>> = [],
> = ParseExpression<TokenList> extends infer G
  ? G extends Array<any>
    ? ParseCallExpressionArguments<
        G[1],
        ParenLineNumber,
        ClosingString,
        true,
        Push<Result, G[0]>
      >
    : G
  : never;

type CheckExpression<
  Node extends BaseNode<any>,
  TokenList extends Array<Token<any>>,
> = ParseMemberExpression<Node, TokenList> extends infer G
  ? G extends [infer O, infer T]
    ? O extends BaseNode<any>
      ? T extends Array<Token<any>>
        ? CheckExpression<O, T>
        : never
      : never
    : G extends Error<any, any, any>
    ? G
    : ParseCallExpression<Node, TokenList> extends infer G
    ? G extends [infer O, infer T]
      ? O extends BaseNode<any>
        ? T extends Array<Token<any>>
          ? CheckExpression<O, T>
          : never
        : never
      : G extends Error<any, any, any>
      ? G
      : [Node, TokenList]
    : never
  : never;

type ParseExpression<
  TokenList extends Array<Token<any>>,
  Data extends NodeData<any, any> = ExtractTokenData<TokenList[0]>,
> = ParseExpressionHelper<TokenList, Data, Tail<TokenList>> extends infer P
  ? P extends Array<any>
    ? CheckExpression<P[0], P[1]>
    : P extends Error<any, any, any>
    ? P
    : null
  : never;

type ParseExpressionHelper<
  TokenList extends Array<Token<any>>,
  Data extends NodeData<any, any> = ExtractTokenData<TokenList[0]>,
  TokenTail extends Array<Token<any>> = Tail<TokenList>,
> = TokenList[0] extends SymbolToken<'true', any>
  ? [BooleanLiteral<true, Data>, TokenTail]
  : TokenList[0] extends SymbolToken<'false', any>
  ? [BooleanLiteral<false, Data>, TokenTail]
  : TokenList[0] extends SymbolToken<'null', any>
  ? [NullLiteral<Data>, TokenTail]
  : TokenList[0] extends NumberToken<infer Value, any>
  ? [NumericLiteral<Value, Data>, TokenTail]
  : TokenList[0] extends StringToken<infer Value, any>
  ? [StringLiteral<Value, Data>, TokenTail]
  : TokenList[0] extends SymbolToken<infer Value, any>
  ? [Identifier<Value, null, Data>, TokenTail]
  : TokenList[0] extends GenericToken<'[', TokenData<any, infer LineNumber>>
  ? ParseArrayExpression<Tail<TokenList>, LineNumber>
  : TokenList[0] extends GenericToken<'{', TokenData<any, infer LineNumber>>
  ? ParseObject<Tail<TokenList>, LineNumber>
  : null;

type ParseObject<
  TokenList extends Array<Token<any>>,
  InitialLineNumber extends number,
  Result extends Array<ObjectProperty<any, any, any>> = [],
  NeedComma extends boolean = false,
> = TokenList[0] extends GenericToken<'}', TokenData<any, infer L>>
  ? [ObjectExpression<Result, NodeData<InitialLineNumber, L>>, Tail<TokenList>]
  : TokenList extends []
  ? SyntaxError<"'}' expected.", InitialLineNumber>
  : NeedComma extends true
  ? TokenList[0] extends GenericToken<',', any>
    ? ParseObjectItem<Tail<TokenList>, InitialLineNumber, Result>
    : TokenList[0] extends Token<TokenData<any, infer L>>
    ? SyntaxError<"',' expected.", L>
    : never
  : ParseObjectItem<TokenList, InitialLineNumber, Result>;

type ParseObjectItem<
  TokenList extends Array<Token<any>>,
  InitialLineNumber extends number,
  Result extends Array<ObjectProperty<any, any, any>> = [],
> = TokenList[0] extends SymbolToken<infer K, TokenData<any, infer L>>
  ? TokenList[1] extends GenericToken<':', any>
    ? ParseExpression<TailBy<TokenList, 2>> extends infer G
      ? G extends Array<any>
        ? G[0] extends BaseNode<NodeData<any, infer W>>
          ? ParseObject<
              G[1],
              InitialLineNumber,
              Push<
                Result,
                ObjectProperty<
                  Identifier<K, null, NodeData<L, L>>,
                  G[0],
                  NodeData<L, W>
                >
              >,
              true
            >
          : never
        : G extends Error<any, any, any>
        ? G
        : SyntaxError<'Expression expected.', InitialLineNumber>
      : never
    : SyntaxError<"'}' expected.", InitialLineNumber>
  : SyntaxError<"'}' expected.", InitialLineNumber>;

type ParseArrayExpression<
  TokenList extends Array<Token<any>>,
  StartLineNumber extends number,
> = ParseCallExpressionArguments<
  TokenList,
  StartLineNumber,
  ']'
> extends infer A
  ? A extends Array<any>
    ? A[2] extends Token<TokenData<any, infer EndLineNumber>>
      ? [ArrayExpression<A[0], NodeData<StartLineNumber, EndLineNumber>>, A[1]]
      : never
    : A
  : never;

type ParseExpressionStatement<TokenList extends Array<Token<any>>> =
  ParseExpression<TokenList> extends infer G
    ? G extends Array<any>
      ? G[0] extends BaseNode<infer Data>
        ? [ExpressionStatement<G[0], Data>, G[1]]
        : never
      : G
    : never;

type ParseFunctionDeclaration<TokenList extends Array<Token<any>>> =
  TokenList[0] extends SymbolToken<
    'function',
    TokenData<any, infer FunctionLineNumber>
  >
    ? TokenList[1] extends SymbolToken<
        infer Name,
        TokenData<any, infer FunctionNameLineNumber>
      >
      ? TokenList[2] extends GenericToken<
          '(',
          TokenData<any, infer ParenLineNumber>
        >
        ? ParseFunctionParams<
            TailBy<TokenList, 3>,
            ParenLineNumber
          > extends infer G
          ? G extends Array<any>
            ? ParseBlockStatement<G[1], G[2], true> extends infer H
              ? H extends Array<any>
                ? H[0] extends BaseNode<NodeData<any, infer BodyLineNumber>>
                  ? [
                      FunctionDeclaration<
                        Identifier<
                          Name,
                          null,
                          NodeData<
                            FunctionNameLineNumber,
                            FunctionNameLineNumber
                          >
                        >,
                        G[0],
                        H[0],
                        NodeData<FunctionLineNumber, BodyLineNumber>
                      >,
                      H[1],
                    ]
                  : never
                : H
              : never
            : G
          : never
        : SyntaxError<"'(' expected.", FunctionNameLineNumber>
      : SyntaxError<'Identifier expected.', FunctionLineNumber>
    : null;

type ParseFunctionParams<
  TokenList extends Array<Token<any>>,
  InitialLineNumber extends number,
  Result extends Array<BaseNode<any>> = [],
  NeedSemicolon extends boolean = false,
> = TokenList[0] extends GenericToken<
  ')',
  TokenData<any, infer ParenLineNumber>
>
  ? TokenList[1] extends GenericToken<
      '{',
      TokenData<any, infer CurlyLineNumber>
    >
    ? [Result, TailBy<TokenList, 2>, CurlyLineNumber]
    : SyntaxError<"'{' expected.", ParenLineNumber>
  : TokenList extends []
  ? SyntaxError<"')' expected.", InitialLineNumber>
  : NeedSemicolon extends true
  ? TokenList[0] extends GenericToken<',', any>
    ? ParseFunctionParamsHelper<Tail<TokenList>, InitialLineNumber, Result>
    : Result[0] extends BaseNode<NodeData<any, infer LineNumber>>
    ? SyntaxError<"',' expected.", LineNumber>
    : never
  : ParseFunctionParamsHelper<TokenList, InitialLineNumber, Result>;

type ParseFunctionParamsHelper<
  TokenList extends Array<Token<any>>,
  LineNumber extends number,
  Result extends Array<BaseNode<any>>,
> = ParseIdentifier<TokenList, true> extends infer G
  ? G extends Array<any>
    ? ParseFunctionParams<G[1], LineNumber, Push<Result, G[0]>, true>
    : G extends Error<any, any, any>
    ? G
    : SyntaxError<'Identifier expected.', LineNumber>
  : never;

type ParseBlockStatement<
  TokenList extends Array<Token<any>>,
  InitialLineNumber extends number,
  InFunctionScope extends boolean,
  Result extends Array<BaseNode<any>> = [],
  NeedSemicolon extends boolean = false,
> = TokenList extends []
  ? Result[0] extends BaseNode<NodeData<any, infer LineNumber>>
    ? SyntaxError<"'}' expected.", LineNumber>
    : SyntaxError<"'}' expected.", InitialLineNumber>
  : TokenList[0] extends GenericToken<'}', TokenData<any, infer LineNumber>>
  ? [
      BlockStatement<Result, NodeData<InitialLineNumber, LineNumber>>,
      Tail<TokenList>,
    ]
  : TokenList[0] extends GenericToken<';', any>
  ? ParseBlockStatement<
      Tail<TokenList>,
      InitialLineNumber,
      InFunctionScope,
      Result,
      false
    >
  : NeedSemicolon extends false
  ? ParseBlockStatementHelper<
      TokenList,
      InitialLineNumber,
      InFunctionScope,
      Result
    >
  : TokenList[0] extends Token<
      TokenData<infer PrecedingLinebreak, infer LineNumber>
    >
  ? PrecedingLinebreak extends true
    ? ParseBlockStatementHelper<TokenList, LineNumber, InFunctionScope, Result>
    : SyntaxError<"';' expected.", LineNumber>
  : never;

type ParseTopLevel<
  TokenList extends Array<Token<any>>,
  Result extends Array<BaseNode<any>> = [],
  NeedSemicolon extends boolean = false,
> = TokenList extends []
  ? Result
  : TokenList[0] extends GenericToken<';', any>
  ? ParseTopLevel<Tail<TokenList>, Result, false>
  : NeedSemicolon extends false
  ? ParseTopLevelHelper<TokenList, Result>
  : TokenList[0] extends Token<
      TokenData<infer PrecedingLinebreak, infer LineNumber>
    >
  ? PrecedingLinebreak extends true
    ? ParseTopLevelHelper<TokenList, Result>
    : SyntaxError<"';' expected.", LineNumber>
  : never;

type ParseBlockStatementHelper<
  TokenList extends Array<Token<any>>,
  LineNumber extends number,
  InFunctionScope extends boolean,
  Result extends Array<BaseNode<any>>,
> = ParseStatementHelper<TokenList, InFunctionScope> extends infer G
  ? G extends Array<any>
    ? ParseBlockStatement<
        G[1],
        LineNumber,
        InFunctionScope,
        Push<Result, G[0]>,
        true
      >
    : G
  : never;

type ParseTopLevelHelper<
  TokenList extends Array<Token<any>>,
  Result extends Array<BaseNode<any>>,
> = ParseStatementHelper<TokenList, false> extends infer G
  ? G extends Array<any>
    ? ParseTopLevel<G[1], Push<Result, G[0]>, G[2]>
    : G
  : never;

type ParseIfStatement<
  TokenList extends Array<Token<any>>,
  InFunctionScope extends boolean,
> = TokenList[0] extends SymbolToken<'if', TokenData<any, infer IfLineNumber>>
  ? TokenList[1] extends GenericToken<
      '(',
      TokenData<any, infer ParenLineNumber>
    >
    ? ParseExpression<TailBy<TokenList, 2>> extends infer G
      ? G extends Array<any>
        ? G[0] extends BaseNode<NodeData<any, infer E>>
          ? ParseIfStatementHelper<G, IfLineNumber, InFunctionScope, E>
          : G extends Error<any, any, any>
          ? G
          : never
        : SyntaxError<'Expression expected.', ParenLineNumber>
      : never
    : SyntaxError<"'(' expected.", IfLineNumber>
  : null;

type ParseReturnStatementHelper<
  TokenList extends Array<Token<any>>,
  StartLineNumber extends number,
> = TokenList[0] extends GenericToken<
  ';',
  TokenData<any, infer SemicolonLineNumber>
>
  ? [
      ReturnStatement<null, NodeData<StartLineNumber, SemicolonLineNumber>>,
      Tail<TokenList>,
    ]
  : ParseExpression<TokenList> extends infer G
  ? G extends Array<any>
    ? G[0] extends BaseNode<NodeData<any, infer EndLineNumber>>
      ? [ReturnStatement<G[0], NodeData<StartLineNumber, EndLineNumber>>, G[1]]
      : G
    : never
  : never;

type ParseReturnStatement<
  TokenList extends Array<Token<any>>,
  InFunctionScope extends boolean,
> = TokenList[0] extends SymbolToken<'return', TokenData<any, infer LineNumber>>
  ? InFunctionScope extends true
    ? TokenList[1] extends Token<TokenData<infer PrecedingLinebreak, any>, any>
      ? PrecedingLinebreak extends false
        ? ParseReturnStatementHelper<Tail<TokenList>, LineNumber>
        : [
            ReturnStatement<null, NodeData<LineNumber, LineNumber>>,
            Tail<TokenList>,
          ]
      : [ReturnStatement<null, NodeData<LineNumber, LineNumber>>, []]
    : SyntaxError<
        "A 'return' statement can only be used within a function body.",
        LineNumber
      >
  : null;

type ParseIfStatementHelper<
  G extends Array<any>,
  StartLineNumber extends number,
  InFunctionScope extends boolean,
  E extends number,
> = G[1] extends Array<any>
  ? G[1][0] extends GenericToken<
      ')',
      TokenData<any, infer ClosingParenLineNumber>
    >
    ? G[1][1] extends GenericToken<'{', TokenData<any, infer CurlyLineNumber>>
      ? ParseBlockStatement<
          TailBy<G[1], 2>,
          CurlyLineNumber,
          InFunctionScope
        > extends infer B
        ? B extends Array<any>
          ? B[0] extends BaseNode<NodeData<any, infer EndLineNumber>>
            ? [
                IfStatement<
                  G[0],
                  B[0],
                  NodeData<StartLineNumber, EndLineNumber>
                >,
                B[1],
              ]
            : never
          : B
        : never
      : SyntaxError<"'{' expected.", ClosingParenLineNumber>
    : SyntaxError<"')' expected.", E>
  : never;

type ParseStatementHelper<
  TokenList extends Array<Token<any>>,
  InFunctionScope extends boolean,
> = ParseFunctionDeclaration<TokenList> extends infer P
  ? P extends Array<any>
    ? [...P, false]
    : P extends Error<any, any, any>
    ? P
    : ParseVariableDeclaration<TokenList> extends infer P
    ? P extends Array<any>
      ? [...P, true]
      : P extends Error<any, any, any>
      ? P
      : ParseIfStatement<TokenList, InFunctionScope> extends infer P
      ? P extends Array<any>
        ? [...P, false]
        : P extends Error<any, any, any>
        ? P
        : ParseReturnStatement<TokenList, InFunctionScope> extends infer P
        ? P extends Array<any>
          ? [...P, true]
          : P extends Error<any, any, any>
          ? P
          : ParseExpressionStatement<TokenList> extends infer P
          ? P extends Array<any>
            ? [...P, true]
            : P extends Error<any, any, any>
            ? P
            : SyntaxError<'Declaration or statement expected.', 1>
          : never
        : never
      : never
    : never
  : never;

export type Parse<TokenList extends Array<Token<any>>> =
  ParseTopLevel<TokenList>;
