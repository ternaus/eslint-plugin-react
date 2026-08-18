'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/jsx-no-key-after-spread');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2024,
    sourceType: 'module',
  },
});

ruleTester.run('jsx-no-key-after-spread', rule, {
  valid: [
    '<Row key={row.id} {...props} />',
    '<Row key={row.id} />',
    '<Row {...props} />',
    '<Row {...props} data-key={row.id} />',
  ],
  invalid: [
    {
      code: '<Row {...props} key={row.id} />',
      errors: [{ messageId: 'keyAfterSpread' }],
    },
    {
      code: '<Row first {...firstProps} second {...secondProps} key={row.id} />',
      errors: [{ messageId: 'keyAfterSpread' }],
    },
  ],
});
