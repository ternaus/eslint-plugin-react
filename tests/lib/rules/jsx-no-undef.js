/**
 * @fileoverview Tests for jsx-no-undef
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/jsx-no-undef');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  ecmaFeatures: {
    jsx: true,
  },
  jsxPragma: null,
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run('jsx-no-undef', rule, {
  valid: parsers.all([
    {
      code: '/*eslint no-undef:1*/ var React, App; React.render(<App />);',
    },
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<img />);',
    },
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<x-gif />);',
    },
    {
      code: '/*eslint no-undef:1*/ var React, app; React.render(<app.Foo />);',
    },
    {
      code: '/*eslint no-undef:1*/ var React, app; React.render(<app.foo.Bar />);',
    },
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<Apppp:Foo />);',
      features: ['jsx namespace'],
    },
    {
      code: `
        /*eslint no-undef:1*/
        var React;
        class Hello extends React.Component {
          render() {
            return <this.props.tag />
          }
        }
      `,
    },
    {
      code: 'var React; React.render(<Text />);',
      globals: {
        Text: true,
      },
      options: [{ allowGlobals: true }],
    },
    {
      code: `
        import Text from "cool-module";
        const TextWrapper = function (props) {
          return (
            <Text />
          );
        };
      `,
      parserOptions: Object.assign({ sourceType: 'module' }, parserOptions),
      options: [{ allowGlobals: false }],
    },
  ]),

  invalid: parsers.all([
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<App />);',
      errors: [
        {
          messageId: 'undefined',
          data: { identifier: 'App' },
        },
        { message: "'App' is not defined." },
      ],
    },
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<Appp.Foo />);',
      errors: [
        {
          messageId: 'undefined',
          data: { identifier: 'Appp' },
        },
        { message: "'Appp' is not defined." },
      ],
    },
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<appp.Foo />);',
      errors: [
        {
          messageId: 'undefined',
          data: { identifier: 'appp' },
        },
        { message: "'appp' is not defined." },
      ],
    },
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<appp.foo.Bar />);',
      errors: [
        {
          messageId: 'undefined',
          data: { identifier: 'appp' },
        },
        { message: "'appp' is not defined." },
      ],
    },
    {
      code: `
        const TextWrapper = function (props) {
          return (
            <Text />
          );
        };
        export default TextWrapper;
      `,
      parserOptions: Object.assign({ sourceType: 'module' }, parserOptions),
      errors: [
        {
          messageId: 'undefined',
          data: { identifier: 'Text' },
        },
      ],
      options: [{ allowGlobals: false }],
      globals: {
        Text: true,
      },
    },
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<Foo />);',
      errors: [
        {
          messageId: 'undefined',
          data: { identifier: 'Foo' },
        },
        { message: "'Foo' is not defined." },
      ],
    },
  ]),
});
