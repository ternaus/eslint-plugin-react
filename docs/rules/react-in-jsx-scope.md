# react/react-in-jsx-scope

📝 Disallow missing React when using JSX.

💼🚫 This rule is enabled in the ☑️ `recommended` [config](https://github.com/ternaus/eslint-plugin-react#configs). This rule is _disabled_ in the 🏃 `jsx-runtime` [config](https://github.com/ternaus/eslint-plugin-react#configs).

<!-- end auto-generated rule header -->

When using JSX, `<a />` expands to `React.createElement("a")`. Therefore the `React` variable must be in scope.

If you are using the @jsx pragma this rule will check the designated variable and not the `React` one.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
/** @jsx Foo.bar */
var React = require('react');

var Hello = <div>Hello {this.props.name}</div>;
```

Examples of **correct** code for this rule:

```jsx
import React from 'react';

var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
var React = require('react');

var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
/** @jsx Foo.bar */
var Foo = require('foo');

var Hello = <div>Hello {this.props.name}</div>;
```

## When Not To Use It

If you are not using JSX, or if you are setting `React` as a global variable.

If you use the [automatic JSX runtime](https://react.dev/learn/writing-markup-with-jsx#the-jsx-compiler), add `react.configs.flat['jsx-runtime']` after the recommended config in `eslint.config.js`.

**Note**: When React >= 19.0.0 is detected, this rule is automatically disabled, since the automatic JSX transform is mandatory in React 19.
