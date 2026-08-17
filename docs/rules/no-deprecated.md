# react/no-deprecated

📝 Disallow usage of deprecated methods.

💼 This rule is enabled in the ☑️ `recommended` [config](https://github.com/ternaus/eslint-plugin-react#configs).

<!-- end auto-generated rule header -->

This plugin targets React 19+. The rule reports every API in its known
deprecated-API list; it does not vary its result by a configured React version.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
React.render(<MyComponent />, root);

React.unmountComponentAtNode(root);

React.findDOMNode(this.refs.foo);

React.renderToString(<MyComponent />);

React.renderToStaticMarkup(<MyComponent />);

React.createClass({ /* Class object */ });

const propTypes = {
  foo: PropTypes.bar,
};

//Any factories under React.DOM
React.DOM.div();

import React, { PropTypes } from 'react';

// legacy lifecycles
componentWillMount() { }
componentWillReceiveProps() { }
componentWillUpdate() { }

// legacy root APIs
import { render } from 'react-dom';
ReactDOM.render(<div></div>, container);

import { hydrate } from 'react-dom';
ReactDOM.hydrate(<div></div>, container);

import {unmountComponentAtNode} from 'react-dom';
ReactDOM.unmountComponentAtNode(container);

import { renderToNodeStream } from 'react-dom/server';
ReactDOMServer.renderToNodeStream(element);
```

Examples of **correct** code for this rule:

```jsx
import { PropTypes } from 'prop-types';

UNSAFE_componentWillMount() { }
UNSAFE_componentWillReceiveProps() { }
UNSAFE_componentWillUpdate() { }

ReactDOM.createPortal(child, container);

import { createRoot } from 'react-dom/client';
const root = createRoot(container);
root.unmount();

import { hydrateRoot } from 'react-dom/client';
const root = hydrateRoot(container, <App/>);
```
