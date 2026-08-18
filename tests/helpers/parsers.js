'use strict';

const babelParser = require('@babel/eslint-parser');
const typescriptParser = require('@typescript-eslint/parser');

function minEcmaVersion(features, parserOptions) {
  const minEcmaVersionForFeatures = {
    'class fields': 2022,
    'nullish coalescing': 2020,
    'optional chaining': 2020,
  };
  const versions = [
    parserOptions?.ecmaVersion,
    ...Object.entries(minEcmaVersionForFeatures).flatMap(([feature, version]) =>
      features.has(feature) ? [version] : [],
    ),
  ]
    .filter((version) => typeof version === 'number')
    .map((version) => (version > 5 && version < 2015 ? version + 2009 : version));

  return versions.length === 0 ? undefined : Math.max(...versions);
}

function withDescription(test, parser) {
  const { features = new Set(), ...testCase } = test;
  const extras = [
    `features: [${[...features].join(',')}]`,
    `parser: ${parser}`,
    testCase.parserOptions ? `parserOptions: ${JSON.stringify(testCase.parserOptions)}` : undefined,
    testCase.options ? `options: ${JSON.stringify(testCase.options)}` : undefined,
    testCase.settings ? `settings: ${JSON.stringify(testCase.settings)}` : undefined,
  ].filter(Boolean);
  const comment = `\n// ${extras.join(', ')}`;
  const appendOutputComment = (output) => (output == null ? output : output + comment);
  const result = {
    ...testCase,
    code: testCase.code + comment,
    errors: Array.isArray(testCase.errors)
      ? testCase.errors.map((error) => ({
          ...error,
          suggestions: Array.isArray(error.suggestions)
            ? error.suggestions.map((suggestion) => ({
                ...suggestion,
                output: appendOutputComment(suggestion.output),
              }))
            : error.suggestions,
        }))
      : testCase.errors,
  };

  if ('output' in testCase) {
    result.output = appendOutputComment(testCase.output);
  }

  return result;
}

function babelParserOptions(test, features) {
  return {
    ...test.parserOptions,
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      parserOpts: {
        plugins: features.has('decorators') ? ['flow', 'jsx', 'decorators-legacy'] : ['flow', 'jsx'],
      },
    },
  };
}

const parsers = {
  BABEL: babelParser,
  TYPESCRIPT_ESLINT: typescriptParser,
  '@TYPESCRIPT_ESLINT': typescriptParser,
  all(tests) {
    return tests.flatMap((input) => {
      if (Array.isArray(input)) return input;
      const test = typeof input === 'string' ? { code: input } : { ...input };

      if ('parser' in test) {
        delete test.features;
        return test;
      }

      const features = new Set(test.features ?? []);
      delete test.features;
      const ecmaVersion = minEcmaVersion(features, test.parserOptions);
      const cannotUseEspree = [
        'no-espree',
        'bind operator',
        'decorators',
        'do expressions',
        'flow',
        'ts',
        'types',
      ].some((feature) => features.has(feature));
      const cannotUseTypeScript =
        ['no-typescript', 'flow', 'jsx namespace', 'bind operator', 'do expressions'].some((feature) =>
          features.has(feature),
        ) || test.code.includes('/*eslint no-undef:1*/');
      const cannotUseBabel =
        ['ts', 'types', 'bind operator', 'do expressions'].some((feature) => features.has(feature)) ||
        test.code.includes('/*eslint no-undef:1*/');

      return [
        ...(cannotUseEspree
          ? []
          : [
              withDescription(
                {
                  ...test,
                  ...(ecmaVersion ? { parserOptions: { ...test.parserOptions, ecmaVersion } } : {}),
                  features,
                },
                'espree',
              ),
            ]),
        ...(cannotUseTypeScript
          ? []
          : [withDescription({ ...test, features, parser: parsers.TYPESCRIPT_ESLINT }, '@typescript-eslint/parser')]),
        ...(cannotUseBabel
          ? []
          : [
              withDescription(
                {
                  ...test,
                  features,
                  parser: parsers.BABEL,
                  parserOptions: babelParserOptions(test, features),
                },
                '@babel/eslint-parser',
              ),
            ]),
      ];
    });
  },
};

module.exports = parsers;
