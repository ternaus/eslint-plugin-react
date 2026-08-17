# react/no-render-return-undefined

📝 Disallow React components from returning undefined.

<!-- end auto-generated rule header -->

React 19 permits a component to return `undefined`. This opt-in rule is for
codebases that want every component path to state its intent: render a value,
or return `null` to render nothing.

## Rule Details

The rule reports only components it can identify statically. That includes
components with JSX, supported class and wrapper declarations, and named
functions that call an imported React Hook. Ordinary helper functions are not
reported merely because they return `undefined`.

Examples of **incorrect** code for this rule:

```jsx
function Notice({ visible }) {
  if (visible) {
    return <p>Saved</p>;
  }
  return;
}

const Panel = React.memo(() => {
  return undefined;
});

function Loading({ ready }) {
  let content;
  if (ready) {
    return <p>Ready</p>;
  }
  return content;
}
```

Examples of **correct** code for this rule:

```jsx
function Notice({ visible }) {
  if (visible) {
    return <p>Saved</p>;
  }
  return null;
}

function formatStatus() {
  return undefined;
}
```

## What the rule checks

It reports a bare `return`, `return undefined`, `return void ...`, a return of
an uninitialized local variable, and simple paths that finish without a render
value. It does not use TypeScript type flow, execute code, or infer values
through calls and arbitrary assignments. A local that may be assigned at
runtime is therefore left alone.

## When Not To Use It

Do not enable this rule if your project intentionally relies on React's
`undefined` rendering behavior or if the extra explicit `null` returns would
add noise without making component control flow clearer.
