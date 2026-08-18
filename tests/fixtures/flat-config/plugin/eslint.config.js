'use strict';

const react = require('../../../..');

module.exports = [
  {
    files: ['**/*.jsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
    },
    rules: {
      'react/no-invalid-html-attribute': 1,
    },
  },
];
