import eslintPlugin from 'eslint-plugin-eslint-plugin';
import node from 'eslint-plugin-n';
import globals from 'globals';

const ruleFiles = ['lib/rules/**/*.js'];
const testFiles = ['tests/**/*.js'];

export default [
  {
    ignores: ['coverage/**', 'node_modules/**', '.yarn/**', 'tests/fixtures/**'],
  },
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
    rules: {
      'no-warning-comments': ['error', { terms: ['TODO', 'FIXME', 'XXX'], location: 'anywhere' }],
      'preserve-caught-error': 'error',
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
];
