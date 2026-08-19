'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-invalid-html-attribute');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2024,
    sourceType: 'module',
  },
});

ruleTester.run('no-invalid-html-attribute', rule, {
  valid: [
    '<button type="submit" className="primary" data-variant="compact" aria-label="Save" />',
    '<input type="email" defaultValue="address@example.com" />',
    '<img alt="Profile photo" src="/profile.webp" />',
    '<input accept="image/*" name="avatar" />',
    '<script type="application/ld+json">{"{}"}</script>',
    '<div align="center" />',
    '<a rel="custom-token" href="/docs" />',
    '<Button href="/docs" type="not-an-html-button-type" />',
    '<View href="/docs" />',
    '<button type={buttonType} />',
    '<div {...props} href="/docs" />',
    "React.createElement('button', { type: 'not-an-html-button-type' });",
    "const React = { createElement() {} }; React.createElement('button', { type: 'not-an-html-button-type' });",
    "import React from 'react'; React.createElement('button', { type: 'submit' });",
    "import { createElement } from 'react'; createElement('input', { type: 'email' });",
  ],
  invalid: [
    {
      code: '<div href="/docs" />',
      errors: [{ messageId: 'invalidAttribute', data: { attribute: 'href', element: 'div' } }],
    },
    {
      code: '<button type="link" />',
      errors: [{ messageId: 'invalidValue', data: { attribute: 'type', element: 'button', value: 'link' } }],
    },
    {
      code: '<input type="telephone" />',
      errors: [{ messageId: 'invalidValue', data: { attribute: 'type', element: 'input', value: 'telephone' } }],
    },
    {
      code: '<meta charSet="latin-1" />',
      errors: [{ messageId: 'invalidValue', data: { attribute: 'charset', element: 'meta', value: 'latin-1' } }],
    },
    {
      code: "import React from 'react'; React.createElement('form', { method: 'put' });",
      errors: [{ messageId: 'invalidValue', data: { attribute: 'method', element: 'form', value: 'put' } }],
    },
  ],
});
