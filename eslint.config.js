import js from '@eslint/js';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import node from 'eslint-plugin-n';
import globals from 'globals';

import { residualEslintConfig } from './scripts/rule-ownership.mjs';

const ruleFiles = ['lib/rules/**/*.js'];
const testFiles = ['tests/**/*.js'];

export default [
  {
    ignores: ['coverage/**', 'node_modules/**', '.yarn/**', 'tests/fixtures/**'],
  },
  js.configs.recommended,
  node.configs['flat/recommended-module'],
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.node,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      'no-warning-comments': ['error', { terms: ['TODO', 'FIXME', 'XXX'], location: 'anywhere' }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'array-includes',
                'array.prototype.*',
                'es-iterator-helpers/**',
                'hasown',
                'object.entries',
                'object.fromentries',
                'object.values',
                'string.prototype.*',
              ],
              message: 'Node 22+ provides this API natively; do not add compatibility polyfills.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ruleFiles,
    plugins: {
      'eslint-plugin': eslintPlugin,
    },
    rules: {
      'eslint-plugin/require-meta-schema': 'error',
      'eslint-plugin/require-meta-docs-url': 'error',
    },
  },
  {
    files: testFiles,
    languageOptions: {
      globals: {
        ...globals.node,
        after: 'readonly',
        afterEach: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        describe: 'readonly',
        it: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'n/no-extraneous-require': 'off',
      'n/no-unpublished-require': 'off',
    },
  },
].map(residualEslintConfig);
