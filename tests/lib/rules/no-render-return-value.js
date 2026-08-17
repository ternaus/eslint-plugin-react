/**
 * @fileoverview Prevent usage of setState
 * @author Mark Dalgleish
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-render-return-value');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-render-return-value', rule, {
  valid: parsers.all([
    {
      code: 'ReactDOM.render(<div />, document.body);',
    },
    {
      code: `
        let node;
        ReactDOM.render(<div ref={ref => node = ref}/>, document.body);
      `,
    },
    {
      code: 'var foo = render(<div />, root)',
    },
    {
      code: 'var foo = ReactDom.renderder(<div />, root)',
    },
  ]),

  invalid: parsers.all([
    {
      code: 'var Hello = ReactDOM.render(<div />, document.body);',
      errors: [
        {
          messageId: 'noReturnValue',
          data: { node: 'ReactDOM' },
        },
      ],
    },
    {
      code: `
        var o = {
          inst: ReactDOM.render(<div />, document.body)
        };
      `,
      errors: [
        {
          messageId: 'noReturnValue',
          data: { node: 'ReactDOM' },
        },
      ],
    },
    {
      code: `
        function render () {
          return ReactDOM.render(<div />, document.body)
        }
      `,
      errors: [
        {
          messageId: 'noReturnValue',
          data: { node: 'ReactDOM' },
        },
      ],
    },
    {
      code: 'var render = (a, b) => ReactDOM.render(a, b)',
      errors: [
        {
          messageId: 'noReturnValue',
          data: { node: 'ReactDOM' },
        },
      ],
    },
    {
      code: 'this.o = ReactDOM.render(<div />, document.body);',
      errors: [
        {
          messageId: 'noReturnValue',
          data: { node: 'ReactDOM' },
        },
      ],
    },
    {
      code: 'var v; v = ReactDOM.render(<div />, document.body);',
      errors: [
        {
          messageId: 'noReturnValue',
          data: { node: 'ReactDOM' },
        },
      ],
    },
  ]),
});
