/**
 * @fileoverview Tests for no-string-refs.
 */

'use strict';

const RuleTester = require('../../helpers/ruleTester');
const parsers = require('../../helpers/parsers');
const rule = require('../../../lib/rules/no-string-refs');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
});

ruleTester.run('no-string-refs', rule, {
  valid: parsers.all([
    {
      code: 'class Component extends React.Component { render() { return <div ref={this.nodeRef} />; } }',
    },
    {
      code: 'class Component extends React.Component { render() { return <div>{this.refs.node}</div>; } }',
    },
  ]),
  invalid: parsers.all([
    {
      code: 'class Component extends React.Component { render() { return <div ref="node" />; } }',
      errors: [{ messageId: 'stringInRefDeprecated' }],
    },
    {
      code: 'class Component extends React.Component { render() { return <div ref={`node`} />; } }',
      options: [{ noTemplateLiterals: true }],
      errors: [{ messageId: 'stringInRefDeprecated' }],
    },
  ]),
});
