'use strict';

const assert = require('assert');
const Linter = require('eslint').Linter;
const SourceCode = require('eslint').SourceCode;
const espree = require('espree');

const getFromContext = require('../../lib/util/pragma').getFromContext;
const noArrayIndexKey = require('../../lib/rules/no-array-index-key');

const DEFAULT_CONFIG = {
  ecmaVersion: 6,
  comment: true,
  tokens: true,
  range: true,
  loc: true,
};

const DEFAULT_SETTINGS = {
  react: {
    pragma: 'React',
  },
};

const fakeContext = (code, settings = DEFAULT_SETTINGS) => {
  const ast = espree.parse(code, DEFAULT_CONFIG);
  return {
    sourceCode: new SourceCode(code, ast),
    settings,
  };
};

describe('pragma', () => {
  describe('getFromContext', () => {
    it('finds the pragma in a block comment', () => {
      const code = '/* @jsx jsx */';
      assert.strictEqual(getFromContext(fakeContext(code)), 'jsx');
    });

    it('finds the pragma in a docstring comment', () => {
      const code = '/** @jsx jsx */';
      assert.strictEqual(getFromContext(fakeContext(code)), 'jsx');
    });

    it('finds the pragma in a line comment', () => {
      const code = '// @jsx jsx';
      assert.strictEqual(getFromContext(fakeContext(code)), 'jsx');
    });

    it('prefers a pragma annotation over the configured pragma', () => {
      const code = '// @jsx annotation.createElement';
      assert.strictEqual(getFromContext(fakeContext(code, { react: { pragma: 'Configured' } })), 'annotation');
    });

    it('defaults to the value of settings.react.pragma', () => {
      const code = '';
      assert.strictEqual(getFromContext(fakeContext(code)), DEFAULT_SETTINGS.react.pragma);
    });

    it('returns React if the pragma is invalid', () => {
      const code = '/* @jsx invalid-jsx-pragma */';
      assert.equal(getFromContext(fakeContext(code)), 'React');
    });

    it('uses the configured pragma when comments are unavailable', () => {
      const context = {
        sourceCode: {},
        settings: { react: { pragma: 'Configured' } },
      };
      assert.strictEqual(getFromContext(context), 'Configured');
    });

    it('uses React by default when comments are unavailable', () => {
      const context = {
        sourceCode: {},
        settings: {},
      };
      assert.strictEqual(getFromContext(context), 'React');
    });

    it('does not crash a React rule when SourceCode lacks getAllComments', () => {
      const descriptor = Object.getOwnPropertyDescriptor(SourceCode.prototype, 'getAllComments');
      Object.defineProperty(SourceCode.prototype, 'getAllComments', { value: undefined });

      try {
        const messages = new Linter().verify(
          "items.map((item, index) => Configured.createElement('li', { key: index }));",
          [
            {
              languageOptions: {
                ecmaVersion: 2022,
              },
              plugins: {
                react: {
                  rules: { 'no-array-index-key': noArrayIndexKey },
                },
              },
              rules: { 'react/no-array-index-key': 'error' },
              settings: { react: { pragma: 'Configured', version: '19.0.0' } },
            },
          ],
        );

        assert.strictEqual(messages.length, 1);
        assert.strictEqual(messages[0].ruleId, 'react/no-array-index-key');
      } finally {
        Object.defineProperty(SourceCode.prototype, 'getAllComments', descriptor);
      }
    });
  });
});
