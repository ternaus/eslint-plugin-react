# react/no-function-default-props

React 19 ignores `defaultProps` on function components. This rule reports an
assignment only when its target is statically proven to be a function component
returning JSX.

```jsx
function Button({ size }) {
  return <button data-size={size} />;
}

Button.defaultProps = { size: 'medium' };
```

Use a JavaScript default parameter instead:

```jsx
function Button({ size = 'medium' }) {
  return <button data-size={size} />;
}
```

Class component `defaultProps` and unproven objects are not reported. No fix is
offered because safely rewriting destructuring, rest props, and public types
requires project-specific intent.
