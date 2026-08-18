/**
 * @fileoverview Tests for no-did-mount-set-state.
 */

'use strict';

const RuleTester = require('../../helpers/ruleTester');
const parsers = require('../../helpers/parsers');
const rule = require('../../../lib/rules/no-did-mount-set-state');

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2022 } });
ruleTester.run('no-did-mount-set-state', rule, {
  valid: parsers.all([
    {
      code: 'class Component extends React.Component { componentDidMount() { this.setState({ ready: true }); } }',
    },
  ]),
  invalid: [],
});
