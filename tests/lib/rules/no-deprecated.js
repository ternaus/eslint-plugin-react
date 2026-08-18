'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-deprecated');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2024,
    sourceType: 'module',
  },
});

ruleTester.run('no-deprecated', rule, {
  valid: [
    'const ReactDOM = { render() {} }; ReactDOM.render(<App />, root);',
    'const findDOMNode = () => null; findDOMNode(instance);',
    "function require() { return { render() {} }; } const ReactDOM = require('react-dom'); ReactDOM.render(<App />, root);",
    "import { act } from 'react-dom/test-utils'; act(() => {});",
    "import TestRenderer from 'react-test-renderer'; TestRenderer.create(<App />);",
    "import { renderToString } from 'react-dom/server'; renderToString(<App />);",
    `
      import * as ReactDOM from 'react-dom';
      function render(ReactDOM) {
        ReactDOM.render(<App />, root);
      }
    `,
    `
      import React from 'react';
      class NotAComponent {
        static contextTypes = {};
      }
    `,
  ],
  invalid: [
    {
      code: "import * as ReactDOM from 'react-dom'; ReactDOM.render(<App />, root);",
      errors: [{ messageId: 'removed', data: { api: 'ReactDOM.render', replacement: 'createRoot' } }],
    },
    {
      code: "import { hydrate as hydrateLegacy } from 'react-dom'; hydrateLegacy(<App />, root);",
      errors: [{ messageId: 'removed', data: { api: 'ReactDOM.hydrate', replacement: 'hydrateRoot' } }],
    },
    {
      code: "const { unmountComponentAtNode: unmount } = require('react-dom'); unmount(root);",
      errors: [{ messageId: 'removed', data: { api: 'ReactDOM.unmountComponentAtNode', replacement: 'root.unmount' } }],
    },
    {
      code: "import { findDOMNode as findNode } from 'react-dom'; findNode(instance);",
      errors: [{ messageId: 'removed', data: { api: 'findDOMNode', replacement: 'a ref' } }],
    },
    {
      code: "import React, { createFactory as factory } from 'react'; factory('div');",
      errors: [{ messageId: 'removed', data: { api: 'createFactory', replacement: 'JSX' } }],
    },
    {
      code: "import { renderToNodeStream as stream } from 'react-dom/server'; stream(<App />);",
      errors: [{ messageId: 'removed', data: { api: 'renderToNodeStream', replacement: 'renderToPipeableStream' } }],
    },
    {
      code: "import { useFormState } from 'react-dom'; useFormState(action, initialState);",
      errors: [{ messageId: 'removed', data: { api: 'useFormState', replacement: 'useActionState' } }],
    },
    {
      code: `
        import React from 'react';
        class Component extends React.Component {
          static contextTypes = {};
          static childContextTypes = {};
        }
      `,
      errors: [
        { messageId: 'legacyContext', data: { name: 'contextTypes' } },
        { messageId: 'legacyContext', data: { name: 'childContextTypes' } },
      ],
    },
  ],
});
