'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/context-provider-requires-value');

const ruleTester = new RuleTester({
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 2024, sourceType: 'module' },
});
const context = 'import { createContext } from "react"; const Theme = createContext("light");';

ruleTester.run('context-provider-requires-value', rule, {
  valid: [
    `${context} <Theme value="dark" />;`,
    `${context} <Theme value={undefined} />;`,
    `${context} <Theme.Provider value={null} />;`,
    `${context} <Theme {...props} />;`,
    `${context} <Theme.Consumer>{theme => theme}</Theme.Consumer>;`,
    `${context} function App(Theme) { return <Theme />; }`,
    'import Theme from "./theme.js"; <Theme />;',
    'const Theme = createContext("light"); <Theme />;',
    'import { createContext } from "other"; const Theme = createContext("light"); <Theme />;',
    'import { createContext } from "react"; let Theme = createContext("light"); Theme = Wrapper; <Theme />;',
    'const Theme = {}; <Theme.Provider />;',
    '<namespace:Theme />;',
    '<Theme namespace:value="dark" />;',
    '<UI.Theme.Provider />;',
    `${context} import { createElement } from "react"; createElement(Theme, props);`,
    `${context} import { createElement } from "react"; createElement(Theme, { ...props });`,
    `${context} import { createElement } from "react"; createElement(Theme, { [key]: value });`,
    `${context} import { createElement } from "react"; createElement(Theme, { value: undefined });`,
    `${context} import { createElement } from "react"; createElement(Theme["Provider"], null);`,
    `${context} React.createElement(Theme, null);`,
  ],
  invalid: [
    { code: `${context} <Theme />;`, errors: [{ messageId: 'missingValue' }] },
    { code: `${context} <Theme theme="dark" />;`, errors: [{ messageId: 'missingValue' }] },
    { code: `${context} <Theme.Provider />;`, errors: [{ messageId: 'missingValue' }] },
    {
      code: 'import React from "react"; const Theme = React.createContext(null); <Theme />;',
      errors: [{ messageId: 'missingValue' }],
    },
    {
      code: 'const { createContext: context, createElement } = require("react"); const Theme = context(null); createElement(Theme);',
      errors: [{ messageId: 'missingValue' }],
    },
    {
      code: `${context} import { createElement } from "react"; createElement(Theme.Provider, null, child);`,
      errors: [{ messageId: 'missingValue' }],
    },
    {
      code: `${context} import * as React from "react"; React.createElement(Theme, { children: child });`,
      errors: [{ messageId: 'missingValue' }],
    },
  ],
});
