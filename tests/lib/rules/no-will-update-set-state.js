/**
 * @fileoverview Tests for no-will-update-set-state.
 */

'use strict';

const RuleTester = require('../../helpers/ruleTester');
const parsers = require('../../helpers/parsers');
const rule = require('../../../lib/rules/no-will-update-set-state');

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2022 } });
ruleTester.run('no-will-update-set-state', rule, {
  valid: parsers.all([
    {
      code: 'class Component extends React.Component { componentWillUpdate() { return true; } }',
    },
  ]),
  invalid: parsers.all([
    {
      code: 'class Component extends React.Component { componentWillUpdate() { this.setState({ ready: true }); } }',
      errors: [{ messageId: 'noSetState', data: { name: 'componentWillUpdate' } }],
    },
    {
      code: 'class Component extends React.Component { UNSAFE_componentWillUpdate() { this.setState({ ready: true }); } }',
      errors: [{ messageId: 'noSetState', data: { name: 'UNSAFE_componentWillUpdate' } }],
    },
  ]),
});
