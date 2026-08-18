/**
 * @fileoverview Tests for prefer-use-state-lazy-initialization
 */

'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/prefer-use-state-lazy-initialization');
const parsers = require('../../helpers/parsers');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('prefer-use-state-lazy-initialization', rule, {
  valid: parsers.all([
    {
      code: `
        import { useState } from 'react';

        function Todos() {
          const [todos] = useState(() => createTodos());
          return todos;
        }
      `,
    },
    {
      code: `
        import { useState } from 'react';

        function Todos() {
          const [todos] = useState(function initializeTodos() {
            return createTodos();
          });
          return todos;
        }
      `,
    },
    {
      code: `
        import { useState as state } from 'react';

        function Todos() {
          function state(initialValue) {
            return [initialValue, () => {}];
          }

          const [todos] = state(createTodos());
          return todos;
        }
      `,
    },
  ]),
  invalid: parsers.all([
    {
      code: `
        import { useState as state } from 'react';

        function Todos() {
          const [todos] = state(createTodos());
          return todos;
        }
      `,
      errors: [{ messageId: 'useLazyInitialization' }],
    },
    {
      code: `
        import React from 'react';

        function Todos() {
          const [todos] = React.useState(createTodos());
          return todos;
        }
      `,
      errors: [{ messageId: 'useLazyInitialization' }],
    },
    {
      code: `
        import { useState } from 'react';

        function Todos() {
          const [state] = useState({ todos: createTodos() });
          return state;
        }
      `,
      errors: [{ messageId: 'useLazyInitialization' }],
    },
    {
      code: `
        import { useState } from 'react';

        function Todos({ hasTodos }) {
          const [todos] = useState(hasTodos ? createTodos() : createEmptyTodos());
          return todos;
        }
      `,
      errors: [{ messageId: 'useLazyInitialization' }],
    },
    {
      code: `
        import { useState } from 'react';

        function Todos({ hasTodos }) {
          const [todos] = useState(hasTodos && [createTodos()]);
          return todos;
        }
      `,
      errors: [{ messageId: 'useLazyInitialization' }],
    },
    {
      code: `
        import { useState } from 'react';

        function Todos() {
          const [label] = useState(\`Todos: \${createTodoLabel()}\`);
          return label;
        }
      `,
      errors: [{ messageId: 'useLazyInitialization' }],
    },
  ]),
});
