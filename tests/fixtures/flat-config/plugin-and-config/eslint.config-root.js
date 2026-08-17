'use strict';

const react = require('../../../..');
module.exports = [
  {
    files: ['**/*.jsx'],
    plugins: { react },
  },
  {
    files: ['**/*.jsx'],
    ...react.configs.flat.recommended,
  },
];
