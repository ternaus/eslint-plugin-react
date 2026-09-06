# react/no-deprecated

Reports React APIs removed in React 19 and the deprecated `useFormState` API
when the rule can prove their origin from an import or a static CommonJS
`require`.

The rule reports `ReactDOM.render`, `hydrate`, `unmountComponentAtNode`,
`findDOMNode`, `createFactory`, removed server stream renderers, and context
declarations removed from React class components.

`useFormState` is still available in React 19, but React recommends
`useActionState`. Its diagnostic says **deprecated**, not **removed**. See the
[React 19 announcement](https://react.dev/blog/2024/12/05/react-19#new-hook-useactionstate).

It does not report `react-dom/test-utils` `act` or `react-test-renderer`, which
remain supported APIs.

## Incorrect

```jsx
import * as ReactDOM from 'react-dom';

ReactDOM.render(<App />, root);
```

```jsx
import { findDOMNode } from 'react-dom';

findDOMNode(instance);
```

```jsx
import React from 'react';

class App extends React.Component {
  static contextTypes = {};
}
```

## Correct

```jsx
import { createRoot } from 'react-dom/client';

createRoot(root).render(<App />);
```

```jsx
const ReactDOM = { render() {} };

ReactDOM.render(<App />, root);
```

The second example is not a React import, so the rule deliberately stays
silent. It also resolves the lexical binding at each use, so a function
parameter that shadows an imported name is not reported.

## Limitations

Only statically identifiable ES module imports and direct
`require('react…')` declarations are analyzed. Dynamic imports, re-exports,
and values passed through another module are skipped rather than guessed.
