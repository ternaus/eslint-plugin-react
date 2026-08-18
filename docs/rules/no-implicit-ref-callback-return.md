# react/no-implicit-ref-callback-return

React 19 interprets a value returned from a ref callback as cleanup. A concise
assignment callback therefore has different semantics from earlier React
versions:

```jsx
<div ref={(node) => (instance = node)} />
```

Write a block body instead:

```jsx
<div ref={(node) => { instance = node; }} />
```

The rule automatically fixes assignment and update expressions. It leaves a
call expression such as `node => register(node)` alone because the called
function may intentionally return a cleanup function.
