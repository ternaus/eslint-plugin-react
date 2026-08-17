/**
 * @fileoverview Tests for no-did-update-set-state.
 */

'use strict';

const RuleTester = require('../../helpers/ruleTester');
const parsers = require('../../helpers/parsers');
const rule = require('../../../lib/rules/no-did-update-set-state');

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2022 } });
ruleTester.run('no-did-update-set-state', rule, {
  valid: parsers.all([
    {
      code: 'class Component extends React.Component { componentDidUpdate() { this.setState({ ready: true }); } }',
      settings: { react: { version: '19.0.0' } },
    },
    {
      code: 'class Component extends React.Component { componentDidUpdate() { this.setState({ ready: true }); } }',
      settings: { react: { version: '20.0.0' } },
    },
  ]),
  invalid: [],
});
