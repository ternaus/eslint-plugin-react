'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-invalid-browser-call');

const ruleTester = new RuleTester({
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 2024, sourceType: 'module' },
});

ruleTester.run('no-invalid-browser-call', rule, {
  valid: [
    "import { browser } from 'react-dom'; use(browser());",
    "import { browser } from 'react-dom'; const bailout = browser();",
    "import { browser } from 'react-dom'; function read() { return browser(); }",
    "import { browser } from 'react-dom'; controller.abort(browser());",
    "import { browser } from 'react-dom'; consume((value, browser()));",
    "import { browser } from 'other'; browser();",
    'function browser() {} browser();',
    "import * as ReactDOM from 'react-dom'; ReactDOM[method]();",
    "import * as ReactDOM from 'react-dom'; ReactDOM?.browser();",
  ],
  invalid: [
    {
      code: "import { browser } from 'react-dom'; browser();",
      errors: [{ messageId: 'unused' }],
    },
    {
      code: "import { browser } from 'react-dom'; void browser();",
      errors: [{ messageId: 'unused' }],
    },
    {
      code: "import { browser } from 'react-dom'; consume((browser(), value));",
      errors: [{ messageId: 'unused' }],
    },
    {
      code: "import { browser } from 'react-dom'; (value, browser());",
      errors: [{ messageId: 'unused' }],
    },
    {
      code: "import * as ReactDOM from 'react-dom'; throw ReactDOM.browser();",
      errors: [{ messageId: 'thrown' }],
    },
    {
      code: "const { browser: clientOnly } = require('react-dom'); clientOnly();",
      errors: [{ messageId: 'unused' }],
    },
  ],
});
