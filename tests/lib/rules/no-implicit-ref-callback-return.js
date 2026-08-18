'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-implicit-ref-callback-return');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2024,
    sourceType: 'module',
  },
});

ruleTester.run('no-implicit-ref-callback-return', rule, {
  valid: [
    '<div ref={(node) => { instance = node; }} />',
    '<div ref={(node) => register(node)} />',
    '<div ref={refCallback} />',
    '<View ref={(node) => { instance = node; }} />',
  ],
  invalid: [
    {
      code: '<div ref={(node) => (instance = node)} />',
      errors: [{ messageId: 'implicitReturn' }],
      output: '<div ref={(node) => { instance = node; }} />',
    },
    {
      code: '<input ref={(node) => nodeCount++} />',
      errors: [{ messageId: 'implicitReturn' }],
      output: '<input ref={(node) => { nodeCount++; }} />',
    },
  ],
});
