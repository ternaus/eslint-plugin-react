'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-misspelled-lifecycle-methods');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
  },
});

ruleTester.run('no-misspelled-lifecycle-methods', rule, {
  valid: [
    "import React from 'react'; class Button extends React.Component { componentDidMount() {} }",
    "import { Component } from 'react'; class Button extends Component { static getDerivedStateFromProps() {} }",
    'class Button { componentDidMout() {} static componentDidMount() {} }',
    'const React = {}; class Button extends React.Component { componentDidMout() {} }',
  ],
  invalid: [
    {
      code: "import React from 'react'; class Button extends React.Component { componentDidMout() {} }",
      errors: [{ data: { actual: 'componentDidMout', expected: 'componentDidMount' }, messageId: 'misspelledMethod' }],
    },
    {
      code: "import { Component } from 'react'; class Button extends Component { static componentDidMount() {} }",
      errors: [{ data: { method: 'componentDidMount' }, messageId: 'instanceMethod' }],
    },
    {
      code: "import { PureComponent } from 'react'; class Button extends PureComponent { getDerivedStateFromProps() {} }",
      errors: [{ data: { method: 'getDerivedStateFromProps' }, messageId: 'staticMethod' }],
    },
    {
      code: "import React from 'react'; class Button extends React.Component { shouldComponentUpate() {} }",
      errors: [
        { data: { actual: 'shouldComponentUpate', expected: 'shouldComponentUpdate' }, messageId: 'misspelledMethod' },
      ],
    },
  ],
});
