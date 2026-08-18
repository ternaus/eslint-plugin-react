const AST_IMPLEMENTATION_RULES = [
  'complexity/noArguments',
  'complexity/noDivRegex',
  'complexity/noExcessiveCognitiveComplexity',
  'complexity/noExcessiveLinesPerFunction',
  'complexity/noForEach',
  'complexity/noImplicitCoercions',
  'complexity/noRedundantDefaultExport',
  'complexity/noUselessUndefined',
  'complexity/useMaxParams',
  'complexity/useOptionalChain',
  'complexity/useSimplifiedLogicExpression',
  'performance/noAwaitInLoops',
  'performance/noDelete',
  'performance/useTopLevelRegex',
  'suspicious/noControlCharactersInRegex',
  'suspicious/noUnnecessaryConditions',
  'suspicious/useIterableCallbackReturn',
];

const FIXTURE_AND_RULE_SEMANTICS = [
  'a11y/useSemanticElements',
  'style/noCommonJs',
  'style/noContinue',
  'style/noDefaultExport',
  'style/noExcessiveClassesPerFile',
  'style/noExcessiveLinesPerFile',
  'style/noIncrementDecrement',
  'style/noJsxLiterals',
  'style/noMagicNumbers',
  'style/noNegationElse',
  'style/noNestedTernary',
  'style/noParameterAssign',
  'style/noParameterProperties',
  'style/noRestrictedGlobals',
  'style/noTernary',
  'style/noUnusedTemplateLiteral',
  'style/noUselessElse',
  'style/useAtIndex',
  'style/useBlockStatements',
  'style/useCollapsedElseIf',
  'style/useCollapsedIf',
  'style/useConsistentArrayType',
  'style/useConsistentArrowReturn',
  'style/useConsistentBuiltinInstantiation',
  'style/useConsistentMethodSignatures',
  'style/useConsistentTypeDefinitions',
  'style/useDestructuring',
  'style/useExplicitLengthCheck',
  'style/useExportType',
  'style/useExportsLast',
  'style/useFilenamingConvention',
  'style/useForOf',
  'style/useNamingConvention',
  'style/useNodejsImportProtocol',
  'style/useNumberNamespace',
  'style/useObjectSpread',
  'style/useSelfClosingElements',
  'style/useSingleVarDeclarator',
  'style/useThrowNewError',
  'suspicious/noArrayIndexKey',
  'suspicious/noBitwiseOperators',
  'suspicious/noConsole',
  'suspicious/noEmptyBlockStatements',
  'suspicious/noEqualsToNull',
  'suspicious/noExplicitAny',
  'suspicious/noMisplacedAssertion',
  'suspicious/noTemplateCurlyInString',
  'suspicious/noUnknownAttribute',
  'suspicious/noUnusedExpressions',
  'suspicious/noShadow',
];

const TOOLING_AND_DEPENDENCY_RULES = [
  'correctness/noNodejsModules',
  'correctness/noProcessGlobal',
  'correctness/noUndeclaredDependencies',
  'correctness/noUnresolvedImports',
  'correctness/useImportExtensions',
  'correctness/useQwikValidLexicalScope',
];

const REPOSITORY_BOUNDARY_RULES = ['security/noSecrets'];

/** Every Biome exception is explicit and reviewed by the completeness check. */
export const BIOME_RULE_EXCEPTIONS = Object.freeze([
  ...AST_IMPLEMENTATION_RULES.map((rule) => ({
    reason: 'AST traversal and compatibility logic needs this construct; behavior is protected by rule tests.',
    rule,
  })),
  ...FIXTURE_AND_RULE_SEMANTICS.map((rule) => ({
    reason:
      'The repository implements and tests React lint rules, so this global style rule would conflict with rule semantics or fixture inputs.',
    rule,
  })),
  ...TOOLING_AND_DEPENDENCY_RULES.map((rule) => ({
    reason:
      'This is Node.js package tooling or a dependency-resolution concern owned by residual ESLint and package tests.',
    rule,
  })),
  ...REPOSITORY_BOUNDARY_RULES.map((rule) => ({
    reason:
      'The rule is valuable in application code but would constrain the implementation, generated metadata, or test fixtures of this lint-plugin repository.',
    rule,
  })),
]);
