/**
 * @fileoverview Tests for no-danger
 * @author Scott Andrews
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const assert = require('assert');
const { Linter } = require('eslint');
const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-danger');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-danger', rule, {
  valid: parsers.all([
    { code: '<App />;' },
    { code: '<App dangerouslySetInnerHTML={{ __html: "" }} />;' },
    { code: '<div className="bar"></div>;' },
    {
      code: '<div className="bar"></div>;',
      options: [{ customComponentNames: ['*'] }],
    },
    {
      code: `
        function App() {
          return <Title dangerouslySetInnerHTML={{ __html: "<span>hello</span>" }} />;
        }
      `,
      options: [{ customComponentNames: ['Home'] }],
    },
    {
      code: `
        function App() {
          return <TextMUI dangerouslySetInnerHTML={{ __html: "<span>hello</span>" }} />;
        }
      `,
      options: [{ customComponentNames: ['MUI*'] }],
    },
    {
      code: 'React.createElement("div", { className: "bar" });',
    },
    {
      code: 'React.createElement(App, { dangerouslySetInnerHTML: { __html: "" } });',
    },
    {
      code: `
        const props = { dangerouslySetInnerHTML: { __html: "" } };
        React.createElement("div", props);
      `,
    },
    {
      code: 'React.createElement("div", { ...props });',
    },
  ]),
  invalid: parsers.all([
    {
      code: '<div dangerouslySetInnerHTML={{ __html: "" }}></div>;',
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: 'React.createElement("div", { dangerouslySetInnerHTML: { __html: "" } });',
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: 'React.createElement("div", { "dangerouslySetInnerHTML": { __html: "" } });',
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: `
        import { createElement } from 'react';

        createElement('div', { dangerouslySetInnerHTML: { __html: '' } });
      `,
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: `
        import { createElement } from 'fooi';

        createElement('div', { dangerouslySetInnerHTML: { __html: '' } });
      `,
      settings: { react: { pragma: 'FooI' } },
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: 'React.createElement(App, { dangerouslySetInnerHTML: { __html: "" } });',
      options: [{ customComponentNames: ['App'] }],
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: '<App dangerouslySetInnerHTML={{ __html: "<span>hello</span>" }} />;',
      options: [{ customComponentNames: ['*'] }],
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: `
        function App() {
          return <Title dangerouslySetInnerHTML={{ __html: "<span>hello</span>" }} />;
        }
      `,
      options: [{ customComponentNames: ['Title'] }],
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: `
        function App() {
          return <TextFoo dangerouslySetInnerHTML={{ __html: "<span>hello</span>" }} />;
        }
      `,
      options: [{ customComponentNames: ['*Foo'] }],
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: `
        function App() {
          return <FooText dangerouslySetInnerHTML={{ __html: "<span>hello</span>" }} />;
        }
      `,
      options: [{ customComponentNames: ['Foo*'] }],
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: `
        function App() {
          return <TextMUI dangerouslySetInnerHTML={{ __html: "<span>hello</span>" }} />;
        }
      `,
      options: [{ customComponentNames: ['*MUI'] }],
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: `
        import type { ComponentProps } from "react";

        const Comp = "div";
        const Component = () => <></>;

        const NestedComponent = (_props: ComponentProps<"div">) => <></>;

        Component.NestedComponent = NestedComponent;

        function App() {
          return (
            <>
              <div dangerouslySetInnerHTML={{ __html: "<div>aaa</div>" }} />
              <Comp dangerouslySetInnerHTML={{ __html: "<div>aaa</div>" }} />

              <Component.NestedComponent
                dangerouslySetInnerHTML={{ __html: '<div>aaa</div>' }}
              />
            </>
          );
        }
      `,
      features: ['fragment', 'types'],
      options: [{ customComponentNames: ['*'] }],
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
          line: 14,
        },
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
          line: 15,
        },
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
          line: 18,
        },
      ],
    },
  ]),
});

describe('destructured pragma imports', () => {
  it('matches ASCII module specifiers when a Turkish locale would lowercase I differently', () => {
    const originalToLocaleLowerCase = String.prototype.toLocaleLowerCase;
    String.prototype.toLocaleLowerCase = function toLocaleLowerCase() {
      return String(this) === 'ReactI' ? 'reactı' : originalToLocaleLowerCase.call(this);
    };

    try {
      const linter = new Linter();
      [
        `
          import { createElement } from 'reacti';

          createElement('div', { dangerouslySetInnerHTML: { __html: '' } });
        `,
        `
          const { createElement } = require('reacti');

          createElement('div', { dangerouslySetInnerHTML: { __html: '' } });
        `,
      ].forEach((code) => {
        const messages = linter.verify(
          code,
          {
            files: ['**/*.js'],
            languageOptions: {
              parserOptions: {
                ecmaFeatures: { jsx: true },
              },
            },
            plugins: { react: { rules: { 'no-danger': rule } } },
            rules: { 'react/no-danger': 'error' },
            settings: { react: { pragma: 'ReactI' } },
          },
          'component.js',
        );

        assert.equal(messages.length, 1);
        assert.equal(messages[0].ruleId, 'react/no-danger');
        assert.equal(messages[0].messageId, 'dangerousProp');
      });
    } finally {
      String.prototype.toLocaleLowerCase = originalToLocaleLowerCase;
    }
  });
});
