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
      settings: { react: { version: '19.0.0' } },
    },
    {
      code: 'class Component extends React.Component { render() { return <div>{this.refs.node}</div>; } }',
      settings: { react: { version: '20.0.0' } },
    },
  ]),
  invalid: parsers.all([
    {
      code: 'class Component extends React.Component { render() { return <div ref="node" />; } }',
      settings: { react: { version: '19.0.0' } },
      errors: [{ messageId: 'stringInRefDeprecated' }],
    },
    {
      code: 'class Component extends React.Component { render() { return <div ref={`node`} />; } }',
      options: [{ noTemplateLiterals: true }],
      settings: { react: { version: '20.0.0' } },
      errors: [{ messageId: 'stringInRefDeprecated' }],
    },
  ]),
});
