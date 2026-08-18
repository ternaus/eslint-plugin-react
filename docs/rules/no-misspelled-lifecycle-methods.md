# react/no-misspelled-lifecycle-methods

Reports unambiguous spelling or casing mistakes in React class lifecycle
methods, and whether the method is declared with the required staticness. It is
enabled in `recommended`.

The rule recognizes a class only when its superclass is a statically proven
import from `react` (`Component` or `PureComponent`). A class that merely uses
the name `React` is not enough.

## Incorrect

```jsx
import React from 'react';

class Profile extends React.Component {
  componentDidMout() {}

  static componentDidMount() {}
}
```

## Correct

```jsx
import { Component } from 'react';

class Profile extends Component {
  componentDidMount() {}

  static getDerivedStateFromProps(props, state) {
    return state;
  }
}
```

This is a narrow rule for React class lifecycles. It does not inspect function
components, object literals, custom base classes, or arbitrary identifiers.
