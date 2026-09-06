'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-invalid-use-argument');

const ruleTester = new RuleTester({
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 2024, sourceType: 'module' },
});
const reactUse = 'import { use } from "react";';

ruleTester.run('no-invalid-use-argument', rule, {
  valid: [
    `${reactUse} use(promise);`,
    `${reactUse} use(Context);`,
    `${reactUse} use({ then(resolve) { resolve("ok"); } });`,
    `${reactUse} use(browser());`,
    `${reactUse} use(...args);`,
    `${reactUse} use(/unknown/);`,
    `${reactUse} use(await load());`,
    `${reactUse} function App(undefined) { return use(undefined); }`,
    `${reactUse} function App(use) { return use(42); }`,
    'function use(value) { return value; } use(42);',
    'import { use } from "other"; use(null);',
    'let { use } = require("react"); use = other; use(null);',
    'let React = require("react"); React = other; React.use(null);',
    'import React from "react"; React[method](42);',
    'import React from "react"; React["use"](42);',
    'import React from "react"; React?.use(42);',
    `${reactUse} use?.(42);`,
  ],
  invalid: [
    ...[
      '42',
      'null',
      'true',
      '"text"',
      '0n',
      'undefined',
      'NaN',
      'Infinity',
      '`text ${value}`',
      'void value',
      'typeof value',
      '!value',
      '-1',
      '() => promise',
      'function () {}',
    ].map((argument) => ({
      code: `${reactUse} use(${argument});`,
      errors: [{ messageId: 'unsupported' }],
    })),
    { code: `${reactUse} use();`, errors: [{ messageId: 'unsupported' }] },
    { code: 'import React from "react"; React.use(null);', errors: [{ messageId: 'unsupported' }] },
    { code: 'import { use as read } from "react"; read(42);', errors: [{ messageId: 'unsupported' }] },
    { code: 'const { use: read } = require("react"); read(false);', errors: [{ messageId: 'unsupported' }] },
  ],
});
