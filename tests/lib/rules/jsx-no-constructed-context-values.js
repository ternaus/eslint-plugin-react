'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/jsx-no-constructed-context-values');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2024, ecmaFeatures: { jsx: true }, sourceType: 'module' },
});

ruleTester.run('jsx-no-constructed-context-values', rule, {
  valid: [
    {
      code: "import { createContext, useMemo } from 'react'; const Context = createContext(null); function App() { const value = useMemo(() => ({ theme: 'dark' }), []); return <Context value={value} />; }",
    },
    {
      code: "const createContext = () => ({}); const Context = createContext(); function App() { return <Context value={{ theme: 'dark' }} />; }",
    },
    {
      code: "import { createContext } from 'react'; const Context = createContext(null); function renderValue() { return <Context value={{ theme: 'dark' }} />; }",
    },
    {
      code: 'import { createContext } from \'react\'; const Context = createContext(null); function App() { return <Context value="constant" />; }',
    },
  ],
  invalid: [
    {
      code: "import { createContext } from 'react'; const Context = createContext(null); function App() { return <Context value={{ theme: 'dark' }} />; }",
      errors: [{ messageId: 'defaultMsg' }],
    },
    {
      code: "import { Component, createContext } from 'react'; const Context = createContext(null); class App extends Component { render() { const value = [1, 2]; return <Context value={value} />; } }",
      errors: [{ messageId: 'withIdentifierMsg' }],
    },
    {
      code: "import { createContext } from 'react'; const Context = createContext(null); function App() { return <Context value={[/theme/]}/>; }",
      errors: [{ messageId: 'defaultMsg' }],
    },
    {
      code: "import { createContext } from 'react'; const Context = createContext(null); function createValue() {} function App() { return <Context value={createValue} />; }",
      errors: [{ messageId: 'withIdentifierMsgFunc' }],
    },
    {
      code: "import { createContext } from 'react'; const Context = createContext(null); const Value = class {}; function App() { return <Context value={Value} />; }",
      errors: [{ messageId: 'withIdentifierMsg' }],
    },
    {
      code: "import { createContext } from 'react'; const Context = createContext(null); function App() { return <Context value={enabled && { theme: 'dark' }} />; }",
      errors: [{ messageId: 'defaultMsg' }],
    },
    {
      code: "import * as React from 'react'; const Context = React.createContext(null); const App = () => <Context value={new Map()} />;",
      errors: [{ messageId: 'defaultMsg' }],
    },
    {
      code: "import { createContext } from 'react'; const Context = createContext(null); export default function () { return <Context value={{ theme: 'dark' }} />; }",
      errors: [{ messageId: 'defaultMsg' }],
    },
  ],
});
