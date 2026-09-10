# react/view-transition-event-requires-cleanup

Reports inline React ViewTransition event callbacks that start an animation but
cannot return a cleanup function. Enabled as a warning in `recommended` and
`all`.

React uses the returned cleanup to cancel animations when a transition is
interrupted. See the [React ViewTransition reference](https://react.dev/reference/react/ViewTransition#view-transition-events).

## Incorrect

```jsx
import { ViewTransition } from 'react';

<ViewTransition onEnter={(instance) => instance.new.animate(keyframes)}>
  <Page />
</ViewTransition>;
```

## Correct

```jsx
<ViewTransition
  onEnter={(instance) => {
    const animation = instance.new.animate(keyframes);
    return () => animation.cancel();
  }}
>
  <Page />
</ViewTransition>;
```

## Analysis boundary

The rule checks inline `onEnter`, `onExit`, `onShare`, and `onUpdate` callbacks
on an imported React `ViewTransition`. It recognizes `.animate()` calls rooted
in the callback's first parameter. Referenced callbacks and animations reached
through aliases are skipped. An unknown returned value is accepted as a possible
cleanup function, while an async callback is always reported when it starts an
identified animation.

There is no automatic fix.
