# react/no-direct-mutation-state

Reports direct mutation of `this.state` in a React class component. It is
enabled in `recommended`.

## Why this matters

React schedules state updates through `setState`. Mutating a state object
yourself can leave the rendered output out of sync with the value your code
expects. Initializing `this.state` in a constructor is the one exception.

## Incorrect

```jsx
import { Component } from 'react';

class Counter extends Component {
  increment() {
    this.state.count += 1;
  }

  render() {
    return <button onClick={() => this.increment()}>{this.state.count}</button>;
  }
}
```

## Correct

```jsx
import { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  increment() {
    this.setState(({ count }) => ({ count: count + 1 }));
  }

  render() {
    return <button onClick={() => this.increment()}>{this.state.count}</button>;
  }
}
```

## Boundary

The rule reports only a mutation whose enclosing class is proven to extend
`Component` or `PureComponent` imported from `react`. It skips constructors,
unrelated classes, and unproven base classes.
