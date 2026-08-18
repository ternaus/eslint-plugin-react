# react/prefer-use-state-lazy-initialization

📝 Prefer lazy initialization for React useState values that call a function.

`useState(createTodos())` evaluates `createTodos()` before every render that
reaches the call, even though React uses that value only for initialization.
Pass an initializer function instead when computing the initial state does
work:

```js
useState(() => createTodos());
```

React may invoke an initializer more than once in development Strict Mode to
help detect impure code. The initializer must therefore remain pure, but the
lazy form avoids eagerly recomputing it on later renders. See React's
[guidance on avoiding recreating the initial state](https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state).

## Rule Details

The rule reports a statically identifiable React `useState` call when its
first argument contains a function call that runs eagerly. It follows named
imports, including aliases, and `React.useState`. It does not execute code,
perform type-flow analysis, or report a user-defined function that merely has
the same name.

Examples of **incorrect** code for this rule:

```jsx
import { useState } from 'react';

function TodoList() {
  const [todos] = useState(createTodos());
  return <List todos={todos} />;
}
```

```jsx
import { useState } from 'react';

function TodoList({ initialFilter }) {
  const [state] = useState({
    filter: normalizeFilter(initialFilter),
    todos: createTodos(),
  });
  return <List {...state} />;
}
```

Examples of **correct** code for this rule:

```jsx
import { useState } from 'react';

function TodoList() {
  const [todos] = useState(() => createTodos());
  return <List todos={todos} />;
}
```

```jsx
import { useState } from 'react';

function Counter() {
  const [count] = useState(0);
  return <output>{count}</output>;
}
```

The rule does not offer an autofix: wrapping an expression can change its
semantics when it references render-time values or intentionally causes an
effect. Review each report and choose the initializer deliberately.

## When Not To Use It

Do not enable this rule if your project prefers direct initialization for
readability and the eager work is insignificant, or if individual reports need
context that static analysis cannot establish.
