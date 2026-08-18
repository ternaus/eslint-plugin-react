# react/no-prop-types

React 19 ignores `propTypes` declared on a component. This rule reports a
`propTypes` assignment only when it can prove that the target is a function
component returning JSX or a class extending an imported React component.

```jsx
function Button() {
  return <button />;
}

Button.propTypes = { label: PropTypes.string };
```

Use TypeScript for component props, or validate untrusted values at an explicit
runtime boundary with a schema library. The rule does not generate types or
delete declarations automatically because either change can alter public API
contracts.

Plain objects and functions that do not satisfy the component evidence are
skipped.
