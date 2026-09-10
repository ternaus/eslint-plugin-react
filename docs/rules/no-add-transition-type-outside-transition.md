# react/no-add-transition-type-outside-transition

Reports `addTransitionType` calls that are not lexically contained in a React
`startTransition` callback. Enabled as an error in `all` and omitted from
`recommended`.

React requires `addTransitionType` to run while a `startTransition` callback is
active. See the [React addTransitionType reference](https://react.dev/reference/react/addTransitionType).

## Incorrect

```jsx
import { addTransitionType } from 'react';

addTransitionType('slide-forward');
```

## Correct

```jsx
import { addTransitionType, startTransition } from 'react';

startTransition(() => {
  addTransitionType('slide-forward');
  navigate('/next');
});
```

## Analysis boundary

The rule recognizes inline callbacks and local function declarations or
variables passed directly to `startTransition`. It does not build a call graph,
so an external helper called by a transition callback can be reported even when
the runtime call is valid. This boundary keeps the rule out of `recommended`.

There is no automatic fix.
