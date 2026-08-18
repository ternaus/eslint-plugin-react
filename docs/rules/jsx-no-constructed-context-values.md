# react/jsx-no-constructed-context-values

Reports Context values that receive a new object, array, function, class, or
regular-expression identity on every component render. It is enabled in
`recommended` as a warning.

## Why this matters

A Context consumer re-renders when its provider receives a value with a new
identity. Constructing that value while rendering can therefore update every
consumer even when the meaningful data did not change. Memoize object-like
values with `useMemo` and callbacks with `useCallback` when their identity does
not need to change.

## Incorrect

```jsx
import { createContext } from 'react';

const ThemeContext = createContext(null);

function App() {
  return <ThemeContext value={{ mode: 'dark' }} />;
}
```

## Correct

```jsx
import { createContext, useMemo } from 'react';

const ThemeContext = createContext(null);

function App() {
  const value = useMemo(() => ({ mode: 'dark' }), []);
  return <ThemeContext value={value} />;
}
```

## Boundary

The rule follows `createContext` bindings imported from `react`, including
aliases and `React.createContext`, and reports only inside a proven React
component. It skips dynamic values and names that merely look like React APIs.
