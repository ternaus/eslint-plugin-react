/**
 * @fileoverview Tests for no-unsafe.
 */

'use strict';

const RuleTester = require('../../helpers/ruleTester');
const parsers = require('../../helpers/parsers');
const rule = require('../../../lib/rules/no-unsafe');

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2022 } });
ruleTester.run('no-unsafe', rule, {
  valid: parsers.all([
    {
      code: 'class Component extends React.Component { componentDidMount() {} }',
      settings: { react: { version: '19.0.0' } },
    },
    {
      code: 'class Component extends React.Component { componentDidMount() {} }',
      settings: { react: { version: '20.0.0' } },
    },
  ]),
  invalid: parsers.all([
    {
      code: 'class Component extends React.Component { UNSAFE_componentWillMount() {} }',
      settings: { react: { version: '19.0.0' } },
      errors: [{ messageId: 'unsafeMethod' }],
    },
    {
      code: 'class Component extends React.Component { componentWillUpdate() {} }',
      options: [{ checkAliases: true }],
      settings: { react: { version: '20.0.0' } },
      errors: [{ messageId: 'unsafeMethod' }],
    },
  ]),
});
