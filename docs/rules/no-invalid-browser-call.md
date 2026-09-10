# react/no-invalid-browser-call

Reports a `browser()` result from `react-dom` that is discarded or thrown.
Enabled as an error in `recommended` and `all`.

React uses the value returned by `browser()` as an opaque signal. Calling it by
itself has no effect, and throwing it does not activate a Suspense boundary. See
the [React browser reference](https://react.dev/reference/react-dom/browser).

## Incorrect

```jsx
import { browser } from 'react-dom';

browser();
void browser();
(browser(), continueRendering());
throw browser();
```

## Correct

```jsx
import { browser } from 'react-dom';
import { use } from 'react';

use(browser());
const clientOnly = browser();
abort(browser());
```

## Analysis boundary

The rule recognizes named and namespace imports, aliases, and static CommonJS
imports from `react-dom`. It reports a discarded expression statement, `void`
operand, statically discarded sequence operand, or `throw` argument. Other uses
are left alone because the opaque result can be stored, passed to `use`,
returned, or supplied to an abort operation.

There is no automatic fix.
