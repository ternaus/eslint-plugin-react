'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-direct-mutation-state');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2024, ecmaFeatures: { jsx: true }, sourceType: 'module' },
});

ruleTester.run('no-direct-mutation-state', rule, {
  valid: [
    {
      code: 'class NotAComponent { render() { this.state.count += 1; } }',
    },
    {
      code: "import * as React from 'react'; class App extends React.Component { increment() { this.setState(({ count }) => ({ count: count + 1 })); } render() { return null; } }",
    },
    {
      code: "import { Component } from 'react'; class App extends Component { constructor() { super(); this.state = { count: 0 }; } render() { return null; } }",
    },
    {
      code: "import { Component } from 'react'; class App extends Component { render() { function update() { this.state.count += 1; } return null; } }",
    },
  ],
  invalid: [
    {
      code: "import { Component } from 'react'; class App extends Component { increment() { this.state.count += 1; } render() { return null; } }",
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: "import * as React from 'react'; class App extends React.PureComponent { reset() { this.state.value = null; } render() { return null; } }",
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: "import { Component } from 'react'; class App extends Component { increment() { this.state['count']++; } render() { return null; } }",
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: "import { Component } from 'react'; class App extends Component { constructor() { super(); setTimeout(() => { this.state.ready = true; }); } render() { return null; } }",
      errors: [{ messageId: 'noDirectMutation' }],
    },
  ],
});
