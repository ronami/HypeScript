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
import type {
  ParseArrayResult,
  ParseError,
  ParseErrorResult,
  ParseResult,
} from './utils/utilityTypes';

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
        : ParseErrorResult<'Type expected.', ColonLineNumber>
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
    : ParseResult<
        VariableDeclaration<
          [
            VariableDeclarator<
              Id,
              Node,
              NodeData<IdentifierLineNumber, Node['data']['startLineNumber']>
            >,
          ],
          'const',
          NodeData<KindLineNumber, Node['data']['startLineNumber']>
        >,
        TokenList
      >
  : ParseErrorResult<'Expression expected.', EqualsLineNumber>;

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
        : ParseError<
            ParsingError<
              "'const' declarations must be initialized.",
              Node['data']['startLineNumber']
            >
          >
      : ParseError<
          ParsingError<
            'Variable declaration list cannot be empty.',
            KindLineNumber
          >
        >
    : null;

type ParseMemberExpression<
  Node extends BaseNode<NodeData<number, number>>,
  TokenList extends Array<Token<any>>,
> = TokenList[0] extends GenericToken<'.', TokenData<any, infer DotLineNumber>>
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
          NodeData<Node['data']['startLineNumber'], IdentifierLineNumber>
        >,
        TailBy<TokenList, 2>
      >
    : ParseErrorResult<'Identifier expected.', DotLineNumber>
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
      : ExpressionTokenList[0] extends GenericToken<
          ']',
          TokenData<any, infer ClosingBracketLineNumber>
        >
      ? ParseResult<
          MemberExpression<
            Node,
            ExpressionNode,
            true,
            NodeData<
              ExpressionNode['data']['startLineNumber'],
              ClosingBracketLineNumber
            >
          >,
          Tail<ExpressionTokenList>
        >
      : ParseError<
          ParsingError<
            "']' expected.",
            ExpressionNode['data']['startLineNumber']
          >
        >
    : ParseErrorResult<'Expression expected.', BracketLineNumber>
  : null;

type ParseCallExpression<
  Node extends BaseNode<NodeData<number, number>>,
  TokenList extends Array<Token<any>>,
> = TokenList[0] extends GenericToken<
  '(',
  TokenData<any, infer ParenLineNumber>
>
  ? ParseCallExpressionArguments<
      Tail<TokenList>,
      ParenLineNumber,
      ')'
    > extends ParseArrayResult<infer NodeList, infer TokenList, infer Error>
    ? Error extends ParsingError<any, any>
      ? ParseError<Error>
      : ParseResult<
          CallExpression<
            Node,
            NodeList,
            NodeData<
              Node['data']['startLineNumber'],
              TokenList[0]['data']['lineNumber']
            >
          >,
          Tail<TokenList>
        >
    : null
  : null;

type ParseCallExpressionArguments<
  TokenList extends Array<Token<any>>,
  ParenLineNumber extends number,
  ClosingString extends string,
  NeedComma extends boolean = false,
  Result extends Array<BaseNode<any>> = [],
> = TokenList[0] extends GenericToken<ClosingString, any>
  ? ParseArrayResult<Result, TokenList>
  : TokenList extends []
  ? ParseErrorResult<`'${ClosingString}' expected.`, ParenLineNumber>
  : NeedComma extends true
  ? TokenList[0] extends GenericToken<',', any>
    ? ParseCallExpressionArgumentsHelper<
        Tail<TokenList>,
        ParenLineNumber,
        ClosingString,
        Result
      >
    : TokenList[0] extends Token<TokenData<any, infer LineNumber>>
    ? ParseErrorResult<"',' expected.", LineNumber>
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
> = ParseExpression<TokenList> extends ParseResult<
  infer Node,
  infer TokenList,
  infer Error
>
  ? Error extends ParsingError<any, any>
    ? ParseError<Error>
    : ParseCallExpressionArguments<
        TokenList,
        ParenLineNumber,
        ClosingString,
        true,
        Push<Result, Node>
      >
  : null;

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
  ? ParseErrorResult<"'}' expected.", InitialLineNumber>
  : NeedComma extends true
  ? TokenList[0] extends GenericToken<',', any>
    ? ParseObjectItem<Tail<TokenList>, InitialLineNumber, Result>
    : TokenList[0] extends Token<TokenData<any, infer L>>
    ? ParseErrorResult<"',' expected.", L>
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
        : ParseObject<
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
                NodeData<NameLineNumber, Node['data']['endLineNumber']>
              >
            >,
            true
          >
      : ParseErrorResult<'Expression expected.', InitialLineNumber>
    : ParseErrorResult<"'}' expected.", InitialLineNumber>
  : ParseErrorResult<"'}' expected.", InitialLineNumber>;

type ParseArrayExpression<
  TokenList extends Array<Token<any>>,
  StartLineNumber extends number,
> = ParseCallExpressionArguments<
  TokenList,
  StartLineNumber,
  ']'
> extends ParseArrayResult<infer NodeList, infer TokenList, infer Error>
  ? Error extends ParsingError<any, any>
    ? ParseError<Error>
    : ParseResult<
        ArrayExpression<
          NodeList,
          NodeData<StartLineNumber, TokenList[0]['data']['lineNumber']>
        >,
        Tail<TokenList>
      >
  : null;

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
          > extends ParseArrayResult<
            infer NodeList,
            infer TokenList,
            infer Error
          >
          ? Error extends ParsingError<any, any>
            ? ParseError<Error>
            : ParseBlockStatement<
                Tail<TokenList>,
                TokenList[0]['data']['lineNumber'],
                true
              > extends ParseResult<infer Node, infer TokenList, infer Error>
            ? Error extends ParsingError<any, any>
              ? ParseError<Error>
              : ParseResult<
                  FunctionDeclaration<
                    Identifier<
                      Name,
                      null,
                      NodeData<FunctionNameLineNumber, FunctionNameLineNumber>
                    >,
                    NodeList,
                    Node,
                    NodeData<FunctionLineNumber, Node['data']['endLineNumber']>
                  >,
                  TokenList
                >
            : never
          : never
        : ParseErrorResult<"'(' expected.", FunctionNameLineNumber>
      : ParseErrorResult<'Identifier expected.', FunctionLineNumber>
    : null;

type ParseFunctionParams<
  TokenList extends Array<Token<any>>,
  InitialLineNumber extends number,
  Result extends Array<BaseNode<NodeData<number, number>>> = [],
  NeedSemicolon extends boolean = false,
> = TokenList[0] extends GenericToken<
  ')',
  TokenData<any, infer ParenLineNumber>
>
  ? TokenList[1] extends GenericToken<'{', any>
    ? ParseArrayResult<Result, Tail<TokenList>>
    : ParseErrorResult<"'{' expected.", ParenLineNumber>
  : TokenList extends []
  ? ParseErrorResult<"')' expected.", InitialLineNumber>
  : NeedSemicolon extends true
  ? TokenList[0] extends GenericToken<',', any>
    ? ParseFunctionParamsHelper<Tail<TokenList>, InitialLineNumber, Result>
    : ParseError<
        ParsingError<"',' expected.", Result[0]['data']['endLineNumber']>
      >
  : ParseFunctionParamsHelper<TokenList, InitialLineNumber, Result>;

type ParseFunctionParamsHelper<
  TokenList extends Array<Token<any>>,
  LineNumber extends number,
  Result extends Array<BaseNode<any>>,
> = ParseIdentifier<TokenList, true> extends ParseResult<
  infer Node,
  infer TokenList,
  infer Error
>
  ? Error extends ParsingError<any, any>
    ? ParseError<Error>
    : ParseFunctionParams<TokenList, LineNumber, Push<Result, Node>, true>
  : ParseErrorResult<'Identifier expected.', LineNumber>;

type ParseBlockStatement<
  TokenList extends Array<Token<any>>,
  InitialLineNumber extends number,
  InFunctionScope extends boolean,
  Result extends Array<BaseNode<any>> = [],
  NeedSemicolon extends boolean = false,
> = TokenList extends []
  ? Result[0] extends BaseNode<NodeData<any, infer LineNumber>>
    ? ParseErrorResult<"'}' expected.", LineNumber>
    : ParseErrorResult<"'}' expected.", InitialLineNumber>
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
    : ParseErrorResult<"';' expected.", LineNumber>
  : never;

type ParseTopLevel<
  TokenList extends Array<Token<any>>,
  Result extends Array<BaseNode<any>> = [],
  NeedSemicolon extends boolean = false,
> = TokenList extends []
  ? ParseArrayResult<Result, TokenList>
  : TokenList[0] extends GenericToken<';', any>
  ? ParseTopLevel<Tail<TokenList>, Result, false>
  : NeedSemicolon extends false
  ? ParseTopLevelHelper<TokenList, Result>
  : TokenList[0] extends Token<
      TokenData<infer PrecedingLinebreak, infer LineNumber>
    >
  ? PrecedingLinebreak extends true
    ? ParseTopLevelHelper<TokenList, Result>
    : ParseErrorResult<"';' expected.", LineNumber>
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
        : ParseIfStatementHelper<
            Node,
            TokenList,
            IfLineNumber,
            InFunctionScope,
            Node['data']['endLineNumber']
          >
      : ParseErrorResult<'Expression expected.', ParenLineNumber>
    : ParseErrorResult<"'(' expected.", IfLineNumber>
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
    : ParseResult<
        ReturnStatement<
          Node,
          NodeData<StartLineNumber, Node['data']['endLineNumber']>
        >,
        TokenList
      >
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
        : ParseResult<
            IfStatement<
              Node,
              BlockNode,
              NodeData<StartLineNumber, BlockNode['data']['endLineNumber']>
            >,
            TokenList
          >
      : never
    : ParseErrorResult<"'{' expected.", ClosingParenLineNumber>
  : ParseErrorResult<"')' expected.", IfExpressionLineNumber>;

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
  : ParseErrorResult<'Declaration or statement expected.', 1>;

export type Parse<TokenList extends Array<Token<any>>> =
  ParseTopLevel<TokenList> extends ParseArrayResult<
    infer NodeList,
    infer TokenList,
    infer Error
  >
    ? Error extends ParsingError<any, any>
      ? Error
      : NodeList
    : never;
