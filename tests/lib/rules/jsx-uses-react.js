/**
 * @fileoverview Tests for jsx-uses-react.
 */

'use strict';

const assert = require('node:assert/strict');

const RuleTester = require('../../helpers/ruleTester');
const parsers = require('../../helpers/parsers');
const rule = require('../../../lib/rules/jsx-uses-react');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
});

ruleTester.run('jsx-uses-react', rule, {
  valid: parsers.all([
    {
      code: 'const App = () => <main />;',
      settings: { react: { version: '19.0.0' } },
    },
    {
      code: 'const App = () => <main />;',
      settings: { react: { version: '20.0.0' } },
    },
  ]),
  invalid: [],
});

describe('jsx-uses-react React compatibility', () => {
  it('rejects configured React 18 before linting', () => {
    assert.throws(
      () => rule.create({ settings: { react: { version: '18.3.1' } } }),
      /React 18\.3\.1 is unsupported\. @ternaus\/eslint-plugin-react requires React 19\.0\.0 or newer\./u,
    );
  });
});
