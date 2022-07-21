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
      ? ParseTypeAnnotation<TailBy<TokenList, 2>> extends ParseResult<
          infer Node,
          infer TokenList,
          infer Error
        >
        ? Error extends ParsingError<any, any>
          ? ParseError<Error>
          : ParseResult<
              Identifier<
                Name,
                Node,
                NodeData<IdentifierLineNumber, IdentifierLineNumber>
              >,
              TokenList
            >
        : ParseError<ParsingError<'Type expected.', ColonLineNumber>>
      : ParseResult<
          Identifier<
            Name,
            null,
            NodeData<IdentifierLineNumber, IdentifierLineNumber>
          >,
          Tail<TokenList>
        >
    : ParseResult<
        Identifier<
          Name,
          null,
          NodeData<IdentifierLineNumber, IdentifierLineNumber>
        >,
        Tail<TokenList>
      >
  : null;

type ParseVariableDeclarationHelper<
  TokenList extends Array<Token<any>>,
  Id extends BaseNode<any>,
  KindLineNumber extends number,
  IdentifierLineNumber extends number,
  EqualsLineNumber extends number,
> = ParseExpression<Tail<TokenList>> extends ParseResult<
  infer Node,
  infer TokenList,
  infer Error
>
  ? Error extends ParsingError<any, any>
    ? ParseError<Error>
    : Node extends BaseNode<NodeData<infer InitLineNumber, any>>
    ? ParseResult<
        VariableDeclaration<
          [
            VariableDeclarator<
              Id,
              Node,
              NodeData<IdentifierLineNumber, InitLineNumber>
            >,
          ],
          'const',
          NodeData<KindLineNumber, InitLineNumber>
        >,
        TokenList
      >
    : never
  : ParseError<ParsingError<'Expression expected.', EqualsLineNumber>>;

type ParseTypeAnnotation<TokenList extends Array<Token<any>>> =
  TokenList[0] extends SymbolToken<'string', TokenData<any, infer LineNumber>>
    ? ParseResult<
        TypeAnnotation<
          StringTypeAnnotation<NodeData<LineNumber, LineNumber>>,
          NodeData<LineNumber, LineNumber>
        >,
        Tail<TokenList>
      >
    : TokenList[0] extends SymbolToken<
        'boolean',
        TokenData<any, infer LineNumber>
      >
    ? ParseResult<
        TypeAnnotation<
          BooleanTypeAnnotation<NodeData<LineNumber, LineNumber>>,
          NodeData<LineNumber, LineNumber>
        >,
        Tail<TokenList>
      >
    : TokenList[0] extends SymbolToken<'null', TokenData<any, infer LineNumber>>
    ? ParseResult<
        TypeAnnotation<
          NullLiteralTypeAnnotation<NodeData<LineNumber, LineNumber>>,
          NodeData<LineNumber, LineNumber>
        >,
        Tail<TokenList>
      >
    : TokenList[0] extends SymbolToken<
        'number',
        TokenData<any, infer LineNumber>
      >
    ? ParseResult<
        TypeAnnotation<
          NumberTypeAnnotation<NodeData<LineNumber, LineNumber>>,
          NodeData<LineNumber, LineNumber>
        >,
        Tail<TokenList>
      >
    : TokenList[0] extends SymbolToken<'any', TokenData<any, infer LineNumber>>
    ? ParseResult<
        TypeAnnotation<
          AnyTypeAnnotation<NodeData<LineNumber, LineNumber>>,
          NodeData<LineNumber, LineNumber>
        >,
        Tail<TokenList>
      >
    : TokenList[0] extends SymbolToken<
        infer E,
        TokenData<any, infer LineNumber>
      >
    ? ParseResult<
        TypeAnnotation<
          GenericTypeAnnotation<E, NodeData<LineNumber, LineNumber>>,
          NodeData<LineNumber, LineNumber>
        >,
        Tail<TokenList>
      >
    : null;

type ParseVariableDeclaration<TokenList extends Array<Token<any>>> =
  TokenList[0] extends SymbolToken<
    'const',
    TokenData<any, infer KindLineNumber>
  >
    ? ParseIdentifier<Tail<TokenList>, true> extends ParseResult<
        infer Node,
        infer TokenList,
        infer Error
      >
      ? Error extends ParsingError<any, any>
        ? ParseError<Error>
        : TokenList[0] extends GenericToken<
            '=',
            TokenData<any, infer EqualsLineNumber>
          >
        ? ParseVariableDeclarationHelper<
            TokenList,
            Node,
            KindLineNumber,
            Node['data']['startLineNumber'],
            EqualsLineNumber
          >
        : ParsingError<
            "'const' declarations must be initialized.",
            Node['data']['startLineNumber']
          >
      : ParseError<
          ParsingError<
            'Variable declaration list cannot be empty.',
            KindLineNumber
          >
        >
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
      ? ParseResult<
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
          TailBy<TokenList, 2>
        >
      : ParseError<ParsingError<'Identifier expected.', DotLineNumber>>
    : TokenList[0] extends GenericToken<
        '[',
        TokenData<any, infer BracketLineNumber>
      >
    ? ParseExpression<Tail<TokenList>> extends ParseResult<
        infer ExpressionNode,
        infer ExpressionTokenList,
        infer ExpressionError
      >
      ? ExpressionError extends ParsingError<any, any>
        ? ParseError<ExpressionError>
        : ExpressionNode extends BaseNode<NodeData<infer S, any>>
        ? ExpressionTokenList[0] extends GenericToken<']', any>
          ? ParseResult<
              MemberExpression<Node, ExpressionNode, true, NodeData<1, 1>>,
              Tail<ExpressionTokenList>
            >
          : ParseError<ParsingError<"']' expected.", S>>
        : never
      : ParseError<ParsingError<'Expression expected.', BracketLineNumber>>
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
          ? ParseResult<
              CallExpression<Node, G[0], NodeData<NodeStartLine, L>>,
              G[1]
            >
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
  ? ParseResult<
      ObjectExpression<Result, NodeData<InitialLineNumber, L>>,
      Tail<TokenList>
    >
  : TokenList extends []
  ? ParseError<ParsingError<"'}' expected.", InitialLineNumber>>
  : NeedComma extends true
  ? TokenList[0] extends GenericToken<',', any>
    ? ParseObjectItem<Tail<TokenList>, InitialLineNumber, Result>
    : TokenList[0] extends Token<TokenData<any, infer L>>
    ? ParseError<ParsingError<"',' expected.", L>>
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
    ? ParseExpression<TailBy<TokenList, 2>> extends ParseResult<
        infer Node,
        infer TokenList,
        infer Error
      >
      ? Error extends ParsingError<any, any>
        ? ParseError<Error>
        : Node extends BaseNode<NodeData<any, infer ValueLineNumber>>
        ? ParseObject<
            TokenList,
            InitialLineNumber,
            Push<
              Result,
              ObjectProperty<
                Identifier<
                  Name,
                  null,
                  NodeData<NameLineNumber, NameLineNumber>
                >,
                Node,
                NodeData<NameLineNumber, ValueLineNumber>
              >
            >,
            true
          >
        : never
      : ParsingError<'Expression expected.', InitialLineNumber>
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
      ? ParseResult<
          ArrayExpression<A[0], NodeData<StartLineNumber, EndLineNumber>>,
          A[1]
        >
      : never
    : A
  : never;

type ParseExpressionStatement<TokenList extends Array<Token<any>>> =
  ParseExpression<TokenList> extends ParseResult<
    infer Node,
    infer TokenList,
    infer Error
  >
    ? Error extends ParsingError<any, any>
      ? ParseError<Error>
      : ParseResult<ExpressionStatement<Node, Node['data']>, TokenList>
    : null;

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
                  ? ParseResult<
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
                      H[1]
                    >
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
    ? ParseError<ParsingError<"'}' expected.", LineNumber>>
    : ParseError<ParsingError<"'}' expected.", InitialLineNumber>>
  : TokenList[0] extends GenericToken<'}', TokenData<any, infer LineNumber>>
  ? ParseResult<
      BlockStatement<Result, NodeData<InitialLineNumber, LineNumber>>,
      Tail<TokenList>
    >
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
    : ParseError<ParsingError<"';' expected.", LineNumber>>
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
> = ParseStatementHelper<TokenList, InFunctionScope> extends ParseResult<
  infer Node,
  infer TokenList,
  infer Error,
  infer Data
>
  ? Error extends ParsingError<any, any>
    ? ParseError<Error>
    : Data extends boolean
    ? ParseBlockStatement<
        TokenList,
        LineNumber,
        InFunctionScope,
        Push<Result, Node>,
        Data
      >
    : never
  : never;

type ParseTopLevelHelper<
  TokenList extends Array<Token<any>>,
  Result extends Array<BaseNode<any>>,
> = ParseStatementHelper<TokenList, false> extends ParseResult<
  infer Node,
  infer TokenList,
  infer Error,
  infer Data
>
  ? Error extends ParsingError<any, any>
    ? ParseError<Error>
    : Data extends boolean
    ? ParseTopLevel<TokenList, Push<Result, Node>, Data>
    : never
  : never;

type ParseIfStatement<
  TokenList extends Array<Token<any>>,
  InFunctionScope extends boolean,
> = TokenList[0] extends SymbolToken<'if', TokenData<any, infer IfLineNumber>>
  ? TokenList[1] extends GenericToken<
      '(',
      TokenData<any, infer ParenLineNumber>
    >
    ? ParseExpression<TailBy<TokenList, 2>> extends ParseResult<
        infer Node,
        infer TokenList,
        infer Error
      >
      ? Error extends ParsingError<any, any>
        ? ParseError<Error>
        : Node extends BaseNode<NodeData<any, infer IfExpressionLineNumber>>
        ? ParseIfStatementHelper<
            Node,
            TokenList,
            IfLineNumber,
            InFunctionScope,
            IfExpressionLineNumber
          >
        : never
      : ParseError<ParsingError<'Expression expected.', ParenLineNumber>>
    : ParseError<ParsingError<"'(' expected.", IfLineNumber>>
  : null;

type ParseReturnStatementHelper<
  TokenList extends Array<Token<any>>,
  StartLineNumber extends number,
> = TokenList[0] extends GenericToken<
  ';',
  TokenData<any, infer SemicolonLineNumber>
>
  ? ParseResult<
      ReturnStatement<null, NodeData<StartLineNumber, SemicolonLineNumber>>,
      Tail<TokenList>
    >
  : ParseExpression<TokenList> extends ParseResult<
      infer Node,
      infer TokenList,
      infer Error
    >
  ? Error extends ParsingError<any, any>
    ? ParseError<Error>
    : Node extends BaseNode<NodeData<any, infer EndLineNumber>>
    ? [
        ReturnStatement<Node, NodeData<StartLineNumber, EndLineNumber>>,
        TokenList,
      ]
    : null
  : never;

type ParseReturnStatement<
  TokenList extends Array<Token<any>>,
  InFunctionScope extends boolean,
> = TokenList[0] extends SymbolToken<'return', TokenData<any, infer LineNumber>>
  ? InFunctionScope extends true
    ? TokenList[1] extends Token<TokenData<infer PrecedingLinebreak, any>, any>
      ? PrecedingLinebreak extends false
        ? ParseReturnStatementHelper<Tail<TokenList>, LineNumber>
        : ParseResult<
            ReturnStatement<null, NodeData<LineNumber, LineNumber>>,
            Tail<TokenList>
          >
      : ParseResult<ReturnStatement<null, NodeData<LineNumber, LineNumber>>, []>
    : ParseError<
        ParsingError<
          "A 'return' statement can only be used within a function body.",
          LineNumber
        >
      >
  : null;

type ParseIfStatementHelper<
  Node extends BaseNode<any>,
  TokenList extends Array<Token<any>>,
  StartLineNumber extends number,
  InFunctionScope extends boolean,
  IfExpressionLineNumber extends number,
> = TokenList[0] extends GenericToken<
  ')',
  TokenData<any, infer ClosingParenLineNumber>
>
  ? TokenList[1] extends GenericToken<
      '{',
      TokenData<any, infer CurlyLineNumber>
    >
    ? ParseBlockStatement<
        TailBy<TokenList, 2>,
        CurlyLineNumber,
        InFunctionScope
      > extends ParseResult<infer BlockNode, infer TokenList, infer Error>
      ? Error extends ParsingError<any, any>
        ? ParseError<Error>
        : BlockNode extends BaseNode<NodeData<any, infer EndLineNumber>>
        ? ParseResult<
            IfStatement<
              Node,
              BlockNode,
              NodeData<StartLineNumber, EndLineNumber>
            >,
            TokenList
          >
        : never
      : never
    : ParseError<ParsingError<"'{' expected.", ClosingParenLineNumber>>
  : ParseError<ParsingError<"')' expected.", IfExpressionLineNumber>>;

type ParseStatementHelper<
  TokenList extends Array<Token<any>>,
  InFunctionScope extends boolean,
> = ParseFunctionDeclaration<TokenList> extends ParseResult<
  infer Node,
  infer TokenList,
  infer Error
>
  ? Error extends ParsingError<any, any>
    ? ParseError<Error>
    : ParseResult<Node, TokenList, null, false>
  : ParseVariableDeclaration<TokenList> extends ParseResult<
      infer Node,
      infer TokenList,
      infer Error
    >
  ? Error extends ParsingError<any, any>
    ? ParseError<Error>
    : ParseResult<Node, TokenList, null, true>
  : ParseIfStatement<TokenList, InFunctionScope> extends ParseResult<
      infer Node,
      infer TokenList,
      infer Error
    >
  ? Error extends ParsingError<any, any>
    ? ParseError<Error>
    : ParseResult<Node, TokenList, null, false>
  : ParseReturnStatement<TokenList, InFunctionScope> extends ParseResult<
      infer Node,
      infer TokenList,
      infer Error
    >
  ? Error extends ParsingError<any, any>
    ? ParseError<Error>
    : ParseResult<Node, TokenList, null, true>
  : ParseExpressionStatement<TokenList> extends ParseResult<
      infer Node,
      infer TokenList,
      infer Error
    >
  ? Error extends ParsingError<any, any>
    ? ParseError<Error>
    : ParseResult<Node, TokenList, null, true>
  : ParseError<ParsingError<'Declaration or statement expected.', 1>>;

export type Parse<TokenList extends Array<Token<any>>> =
  ParseTopLevel<TokenList>;
