/**
 * @fileoverview Tests for react-in-jsx-scope.
 */

'use strict';

const RuleTester = require('../../helpers/ruleTester');
const parsers = require('../../helpers/parsers');
const rule = require('../../../lib/rules/react-in-jsx-scope');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
});

ruleTester.run('react-in-jsx-scope', rule, {
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
