/**
 * @fileoverview Disallow React components from returning undefined.
 */

'use strict';

const RuleTester = require('../../helpers/ruleTester');
const parsers = require('../../helpers/parsers');
const rule = require('../../../lib/rules/no-render-return-undefined');

const parserOptions = {
  ecmaVersion: 2022,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-render-return-undefined', rule, {
  valid: parsers.all([
    {
      code: 'function helper() { return undefined; }',
    },
    {
      code: 'function Component() { return undefined; }',
    },
    {
      code: 'function Component() { return null; }',
    },
    {
      code: `
        function Component({ visible }) {
          let content;
          if (visible) {
            content = <div />;
          }
          return content;
        }
      `,
    },
    {
      code: `
        function Component({ visible }) {
          if (visible) {
            return <div />;
          }
          return null;
        }
      `,
    },
    {
      code: `
        function Component() {
          return <div>{(() => undefined)()}</div>;
        }
      `,
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        function Component({ visible }) {
          if (visible) {
            return <div />;
          }
          return;
        }
      `,
      errors: [{ messageId: 'undefinedReturn', line: 6 }],
    },
    {
      code: `
        function Component({ visible }) {
          if (visible) {
            return <div />;
          }
          return undefined;
        }
      `,
      errors: [{ messageId: 'undefinedReturn', line: 6 }],
    },
    {
      code: `
        function Component({ visible }) {
          if (visible) {
            return <div />;
          }
          return void 0;
        }
      `,
      errors: [{ messageId: 'undefinedReturn', line: 6 }],
    },
    {
      code: `
        function Component({ visible }) {
          let content;
          if (visible) {
            return <div />;
          }
          return content;
        }
      `,
      errors: [{ messageId: 'undefinedReturn', line: 7 }],
    },
    {
      code: `
        function Component({ visible }) {
          if (visible) {
            return <div />;
          }
        }
      `,
      errors: [{ messageId: 'missingReturn', line: 2 }],
    },
    {
      code: `
        import { useEffect } from 'react';

        function Component() {
          useEffect(() => {});
        }
      `,
      errors: [{ messageId: 'missingReturn', line: 4 }],
    },
    {
      code: `
        const Component = React.memo(() => {
          return undefined;
        });
      `,
      errors: [{ messageId: 'undefinedReturn', line: 3 }],
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return undefined;
          }
        }
      `,
      errors: [{ messageId: 'undefinedReturn', line: 4 }],
    },
    {
      code: `
        import { useEffect } from 'react';

        type Props = { visible: boolean };

        function Component({ visible }: Props) {
          useEffect(() => {});
          return visible ? <div /> : undefined;
        }
      `,
      features: ['types'],
      errors: [{ messageId: 'undefinedReturn', line: 8 }],
    },
  ]),
});
