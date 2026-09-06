'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-invalid-title-children');

const ruleTester = new RuleTester({
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 2024, sourceType: 'module' },
});

ruleTester.run('no-invalid-title-children', rule, {
  valid: [
    '<title>Page</title>',
    '<title>{`Page ${page}`}</title>',
    '<title>{page}</title>',
    '<title>{[page]}</title>',
    '<title>{[...parts, page]}</title>',
    '<title><PageTitle /></title>',
    '<title>{/* explanation */}Page</title>',
    '<title>\n  {page}\n</title>',
    '<title>\r\n\t{page}\r\n</title>',
    '<title />',
    '<title {...props}>Page {page}</title>',
    '<title is="custom-title">Page {page}</title>',
    '<svg><title>Chart {number}</title></svg>',
    '<math><title>Formula {number}</title></math>',
    '<svg><foreignObject><svg><title>Chart {number}</title></svg></foreignObject></svg>',
    '<Title>Page {page}</Title>',
    '<head:title>Page {page}</head:title>',
    'const React = { createElement() {} }; React.createElement("title", null, "Page ", page);',
    'import React from "react"; React.createElement("title", null, `Page ${page}`);',
    'import React from "react"; React.createElement("title", null, React.createElement(PageTitle));',
    'import React from "react"; React.createElement("title");',
    'import React from "react"; React.createElement("title", props, "Page ", page);',
    'import React from "react"; React.createElement("title", undefined, `Page ${page}`);',
    'import React from "react"; function App(undefined) { return React.createElement("title", undefined, "Page ", page); }',
    'import React from "react"; React.createElement("title", { is: "custom-title" }, "Page ", page);',
    'import React from "react"; React.createElement("title", null, ...parts);',
    'import React from "react"; React.createElement("svg", null, React.createElement("title", null, "Chart ", number));',
  ],
  invalid: [
    '<title>Page {page}</title>',
    '<title>{prefix}{page}</title>',
    '<title> {page}</title>',
    '<title>{["Page", page]}</title>',
    '<title><b>Page</b></title>',
    '<title>{<span>Page</span>}</title>',
    '<title children={["Page", page]} />',
    '<title children={["Page", page]}>{/* comment */}</title>',
    '<svg><foreignObject><title>Page {page}</title></foreignObject></svg>',
    'function Page({ page }) { return <title>Page {page}</title>; }',
    'import React from "react"; React.createElement("title", null, "Page ", page);',
    'import React from "react"; React.createElement("title", undefined, "Page ", page);',
    'import React from "react"; React.createElement("title", null, React.createElement("b", null, "Page"));',
    'import { createElement as element } from "react"; element("title", { children: ["Page", page] });',
    'const React = require("react"); React.createElement("title", {}, "Page", page);',
  ].map((code) => ({ code, errors: [{ messageId: 'invalidChildren' }] })),
});
