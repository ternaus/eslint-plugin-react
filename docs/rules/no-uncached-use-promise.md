# react/no-uncached-use-promise

Reports a fresh global `fetch()` result or `new Promise()` passed to React
`use` during client rendering. Enabled as an error in `recommended`.

React needs the same Promise instance across retries and re-renders. Creating
a Promise in render can repeatedly suspend the component. See [React's
uncached-Promise warning](https://react.dev/reference/react/use#im-getting-a-warning-a-component-was-suspended-by-an-uncached-promise).

## Incorrect

```jsx
'use client';

import { use } from 'react';

function Albums() {
  const request = fetch('/albums');
  return <AlbumList albums={use(request)} />;
}
```

The same diagnostic applies to `use(fetch('/albums'))` and
`use(new Promise(...))` directly in render.

## Correct

```jsx
'use client';

import { use } from 'react';

function Albums({ albumsPromise }) {
  return <AlbumList albums={use(albumsPromise)} />;
}
```

A Suspense-compatible cache or a Server Component can supply the Promise.
The rule does not prescribe cache storage or invalidation.

## Analysis boundary

Only files with a `'use client'` directive are checked. Other client modules
may inherit their environment through imports, which this rule does not
follow. Server Components and files with an unknown environment are skipped.

Within those files, the `use` call must belong directly to a synchronous
function component recognized by its JSX return, or a custom Hook named
`use` followed by an uppercase letter or digit. Nested event handlers and
unrecognized wrappers are skipped.

The rule recognizes direct calls and a local `const` initialized by `fetch`
or `new Promise` in the same render function. Module-level Promises, mutable
bindings, longer alias chains, application loaders, member calls, Promise
combinators, and shadowed globals are skipped. In particular,
`use(loadCachedData())` is allowed because the loader may reuse its Promise.
Conditional `use` calls remain valid.

No automatic fix is offered. Choosing a cache lifetime or moving a request
outside a component changes application behavior.
