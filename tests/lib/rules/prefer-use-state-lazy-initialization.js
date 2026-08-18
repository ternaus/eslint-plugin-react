'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/prefer-use-state-lazy-initialization');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2024, ecmaFeatures: { jsx: true }, sourceType: 'module' },
});

ruleTester.run('prefer-use-state-lazy-initialization', rule, {
  valid: [
    {
      code: "import { useState } from 'react'; function App() { const [value] = useState(() => readInitialValue()); return value; }",
    },
    {
      code: 'function useState(value) { return [value]; } const [value] = useState(readInitialValue());',
    },
    {
      code: "import { useState } from 'react'; const [value] = useState({ formatter: () => createFormatter() });",
    },
  ],
  invalid: [
    {
      code: "import { useState as state } from 'react'; const [value] = state(readInitialValue());",
      errors: [{ messageId: 'useLazyInitialization' }],
    },
    {
      code: "import * as React from 'react'; const [value] = React.useState(createInitialValue());",
      errors: [{ messageId: 'useLazyInitialization' }],
    },
    {
      code: "const { useState } = require('react'); const [value] = useState({ todos: createTodos() });",
      errors: [{ messageId: 'useLazyInitialization' }],
    },
  ],
});
