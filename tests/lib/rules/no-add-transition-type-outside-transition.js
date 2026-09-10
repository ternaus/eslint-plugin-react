'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-add-transition-type-outside-transition');

const ruleTester = new RuleTester({
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 2024, sourceType: 'module' },
});

ruleTester.run('no-add-transition-type-outside-transition', rule, {
  valid: [
    `
      import { addTransitionType, startTransition } from 'react';
      startTransition(() => addTransitionType('slide-forward'));
    `,
    `
      import * as React from 'react';
      React.startTransition(() => {
        function setType() { React.addTransitionType('slide-back'); }
        setType();
      });
    `,
    `
      import { addTransitionType, startTransition } from 'react';
      function update() { addTransitionType('slide-forward'); }
      startTransition(update);
    `,
    `
      import { addTransitionType, startTransition } from 'react';
      const update = () => addTransitionType('slide-forward');
      startTransition(update);
    `,
    "import { addTransitionType } from 'other'; addTransitionType('slide');",
    "function addTransitionType() {} addTransitionType('slide');",
  ],
  invalid: [
    {
      code: "import { addTransitionType } from 'react'; addTransitionType('slide');",
      errors: [{ messageId: 'outsideTransition' }],
    },
    {
      code: `
        import * as React from 'react';
        function App() {
          React.addTransitionType('slide');
          return <Page />;
        }
      `,
      errors: [{ messageId: 'outsideTransition' }],
    },
    {
      code: `
        import { addTransitionType } from 'react';
        import { startTransition } from 'other';
        startTransition(() => addTransitionType('slide'));
      `,
      errors: [{ messageId: 'outsideTransition' }],
    },
  ],
});
