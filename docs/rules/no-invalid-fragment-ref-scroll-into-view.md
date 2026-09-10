# react/no-invalid-fragment-ref-scroll-into-view

Reports statically invalid arguments passed to `scrollIntoView` through a ref
attached to a React Fragment. Enabled as an error in `recommended` and `all`.

Unlike `Element.scrollIntoView`, `FragmentInstance.scrollIntoView` accepts only
an optional `alignToTop` boolean. Passing a scroll-options object throws. See the
[React Fragment reference](https://react.dev/reference/react/Fragment#fragmentinstance).

## Incorrect

```jsx
import { Fragment, useRef } from 'react';

const fragmentRef = useRef(null);
<Fragment ref={fragmentRef}>{children}</Fragment>;
fragmentRef.current.scrollIntoView({ behavior: 'smooth' });
```

## Correct

```jsx
fragmentRef.current.scrollIntoView();
fragmentRef.current.scrollIntoView(false);
```

## Analysis boundary

The rule follows an identifier used directly as the `ref` of an imported
`Fragment` or `React.Fragment` in the same file. It reports literal non-booleans,
arrays, objects, templates, and inline functions. Unknown expressions are
skipped, as are reassigned refs, refs also attached to another JSX element, and
aliases of a ref.

There is no automatic fix.
