'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-prop-types');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2024,
    sourceType: 'module',
  },
});

ruleTester.run('no-prop-types', rule, {
  valid: [
    'const schema = { string: true }; schema.propTypes = { label: schema.string };',
    'function NotAComponent() { return null; } NotAComponent.propTypes = {};',
    `
      import React from 'react';
      class NotAComponent {
        static propTypes = {};
      }
    `,
  ],
  invalid: [
    {
      code: 'function Button() { return <button />; } Button.propTypes = { label: PropTypes.string };',
      errors: [{ messageId: 'propTypes' }],
    },
    {
      code: 'const Button = () => <button />; Button.propTypes = { label: PropTypes.string };',
      errors: [{ messageId: 'propTypes' }],
    },
    {
      code: `
        import React from 'react';
        class Button extends React.Component {
          static propTypes = { label: PropTypes.string };
        }
      `,
      errors: [{ messageId: 'propTypes' }],
    },
  ],
});
