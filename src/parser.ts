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
import type { ParsingError } from './errors';
import type {
  GenericToken,
  NumberToken,
  StringToken,
  SymbolToken,
  Token,
  TokenData,
} from './tokens';
import type { Push, Tail, TailBy } from './utils/arrayUtils';
import type { ParseError, ParseResult } from './utils/utilityTypes';

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
          : J extends ParsingError<any, any>
          ? J
          : ParsingError<'Type expected.', ColonLineNumber>
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
    ? ParsingError<'Expression expected.', EqualsLineNumber>
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
          ? R[0] extends GenericToken<
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
            : ParsingError<
                "'const' declarations must be initialized.",
                IdentifierLineNumber
              >
          : never
        : N extends null
        ? ParsingError<
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
      : ParsingError<'Identifier expected.', DotLineNumber>
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
              : ParsingError<"']' expected.", S>
            : never
          : never
        : G extends null
        ? ParsingError<'Expression expected.', BracketLineNumber>
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
  ? ParsingError<`'${ClosingString}' expected.`, ParenLineNumber>
  : NeedComma extends true
  ? TokenList[0] extends GenericToken<',', any>
    ? ParseCallExpressionArgumentsHelper<
        Tail<TokenList>,
        ParenLineNumber,
        ClosingString,
        Result
      >
    : TokenList[0] extends Token<TokenData<any, infer LineNumber>>
    ? ParsingError<"',' expected.", LineNumber>
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
> = ParseMemberExpression<Node, TokenList> extends ParseResult<
  infer Node,
  infer TokenList,
  infer Error
>
  ? Error extends ParsingError<any, any>
    ? ParseError<Error>
    : CheckExpression<Node, TokenList>
  : ParseCallExpression<Node, TokenList> extends ParseResult<
      infer Node,
      infer TokenList,
      infer Error
    >
  ? Error extends ParsingError<any, any>
    ? ParseError<Error>
    : CheckExpression<Node, TokenList>
  : ParseResult<Node, TokenList>;

type ParseExpression<TokenList extends Array<Token<any>>> =
  ParseExpressionHelper<TokenList, Tail<TokenList>> extends ParseResult<
    infer Node,
    infer TokenList,
    infer Error
  >
    ? Error extends ParsingError<any, any>
      ? ParseError<Error>
      : CheckExpression<Node, TokenList>
    : null;

type TokenToNodeData<InputToken extends Token<any>> = InputToken extends Token<
  TokenData<any, infer LineNumber>
>
  ? NodeData<LineNumber, LineNumber>
  : never;

type ParseExpressionHelper<
  TokenList extends Array<Token<any>>,
  TokenTail extends Array<Token<any>> = Tail<TokenList>,
  Data extends NodeData<any, any> = TokenToNodeData<TokenList[0]>,
> = TokenList[0] extends SymbolToken<'true', any>
  ? ParseResult<BooleanLiteral<true, Data>, TokenTail>
  : TokenList[0] extends SymbolToken<'false', any>
  ? ParseResult<BooleanLiteral<false, Data>, TokenTail>
  : TokenList[0] extends SymbolToken<'null', any>
  ? ParseResult<NullLiteral<Data>, TokenTail>
  : TokenList[0] extends NumberToken<infer Value, any>
  ? ParseResult<NumericLiteral<Value, Data>, TokenTail>
  : TokenList[0] extends StringToken<infer Value, any>
  ? ParseResult<StringLiteral<Value, Data>, TokenTail>
  : TokenList[0] extends SymbolToken<infer Value, any>
  ? ParseResult<Identifier<Value, null, Data>, TokenTail>
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
  ? ParsingError<"'}' expected.", InitialLineNumber>
  : NeedComma extends true
  ? TokenList[0] extends GenericToken<',', any>
    ? ParseObjectItem<Tail<TokenList>, InitialLineNumber, Result>
    : TokenList[0] extends Token<TokenData<any, infer L>>
    ? ParsingError<"',' expected.", L>
    : never
  : ParseObjectItem<TokenList, InitialLineNumber, Result>;

type ParseObjectItem<
  TokenList extends Array<Token<any>>,
  InitialLineNumber extends number,
  Result extends Array<ObjectProperty<any, any, any>> = [],
> = TokenList[0] extends SymbolToken<
  infer Name,
  TokenData<any, infer NameLineNumber>
>
  ? TokenList[1] extends GenericToken<':', any>
    ? ParseExpression<TailBy<TokenList, 2>> extends infer G
      ? G extends Array<any>
        ? G[0] extends BaseNode<NodeData<any, infer ValueLineNumber>>
          ? ParseObject<
              G[1],
              InitialLineNumber,
              Push<
                Result,
                ObjectProperty<
                  Identifier<
                    Name,
                    null,
                    NodeData<NameLineNumber, NameLineNumber>
                  >,
                  G[0],
                  NodeData<NameLineNumber, ValueLineNumber>
                >
              >,
              true
            >
          : never
        : G extends ParsingError<any, any>
        ? G
        : ParsingError<'Expression expected.', InitialLineNumber>
      : never
    : ParsingError<"'}' expected.", InitialLineNumber>
  : ParsingError<"'}' expected.", InitialLineNumber>;

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
        : ParsingError<"'(' expected.", FunctionNameLineNumber>
      : ParsingError<'Identifier expected.', FunctionLineNumber>
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
    : ParsingError<"'{' expected.", ParenLineNumber>
  : TokenList extends []
  ? ParsingError<"')' expected.", InitialLineNumber>
  : NeedSemicolon extends true
  ? TokenList[0] extends GenericToken<',', any>
    ? ParseFunctionParamsHelper<Tail<TokenList>, InitialLineNumber, Result>
    : Result[0] extends BaseNode<NodeData<any, infer LineNumber>>
    ? ParsingError<"',' expected.", LineNumber>
    : never
  : ParseFunctionParamsHelper<TokenList, InitialLineNumber, Result>;

type ParseFunctionParamsHelper<
  TokenList extends Array<Token<any>>,
  LineNumber extends number,
  Result extends Array<BaseNode<any>>,
> = ParseIdentifier<TokenList, true> extends infer G
  ? G extends Array<any>
    ? ParseFunctionParams<G[1], LineNumber, Push<Result, G[0]>, true>
    : G extends ParsingError<any, any>
    ? G
    : ParsingError<'Identifier expected.', LineNumber>
  : never;

type ParseBlockStatement<
  TokenList extends Array<Token<any>>,
  InitialLineNumber extends number,
  InFunctionScope extends boolean,
  Result extends Array<BaseNode<any>> = [],
  NeedSemicolon extends boolean = false,
> = TokenList extends []
  ? Result[0] extends BaseNode<NodeData<any, infer LineNumber>>
    ? ParsingError<"'}' expected.", LineNumber>
    : ParsingError<"'}' expected.", InitialLineNumber>
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
    : ParsingError<"';' expected.", LineNumber>
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
    : ParsingError<"';' expected.", LineNumber>
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
        ? G[0] extends BaseNode<NodeData<any, infer IfExpressionLineNumber>>
          ? ParseIfStatementHelper<
              G,
              IfLineNumber,
              InFunctionScope,
              IfExpressionLineNumber
            >
          : G extends ParsingError<any, any>
          ? G
          : never
        : ParsingError<'Expression expected.', ParenLineNumber>
      : never
    : ParsingError<"'(' expected.", IfLineNumber>
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
    : ParsingError<
        "A 'return' statement can only be used within a function body.",
        LineNumber
      >
  : null;

type ParseIfStatementHelper<
  G extends Array<any>,
  StartLineNumber extends number,
  InFunctionScope extends boolean,
  IfExpressionLineNumber extends number,
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
      : ParsingError<"'{' expected.", ClosingParenLineNumber>
    : ParsingError<"')' expected.", IfExpressionLineNumber>
  : never;

type ParseStatementHelper<
  TokenList extends Array<Token<any>>,
  InFunctionScope extends boolean,
> = ParseFunctionDeclaration<TokenList> extends infer P
  ? P extends Array<any>
    ? [...P, false]
    : P extends ParsingError<any, any>
    ? P
    : ParseVariableDeclaration<TokenList> extends infer P
    ? P extends Array<any>
      ? [...P, true]
      : P extends ParsingError<any, any>
      ? P
      : ParseIfStatement<TokenList, InFunctionScope> extends infer P
      ? P extends Array<any>
        ? [...P, false]
        : P extends ParsingError<any, any>
        ? P
        : ParseReturnStatement<TokenList, InFunctionScope> extends infer P
        ? P extends Array<any>
          ? [...P, true]
          : P extends ParsingError<any, any>
          ? P
          : ParseExpressionStatement<TokenList> extends infer P
          ? P extends Array<any>
            ? [...P, true]
            : P extends ParsingError<any, any>
            ? P
            : ParsingError<'Declaration or statement expected.', 1>
          : never
        : never
      : never
    : never
  : never;

export type Parse<TokenList extends Array<Token<any>>> =
  ParseTopLevel<TokenList>;
