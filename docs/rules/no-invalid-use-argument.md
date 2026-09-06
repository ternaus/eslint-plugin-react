# react/no-invalid-use-argument

Reports missing arguments and statically unsupported primitive or function
arguments to React `use`. Enabled as an error in `recommended`.

React `use` reads a supported resource, such as a Promise or Context. It
cannot read a primitive directly. See the [React use reference](https://react.dev/reference/react/use).

## Incorrect

```jsx
import { use } from 'react';

use();
use(42);
use(null);
use('ready');
use(() => promise);
```

## Correct

```jsx
use(promise);
use(ThemeContext);
use(loadCachedData());
```

## Analysis boundary

The rule recognizes named and namespace React imports, aliases of those
imports, and static CommonJS imports. It checks primitive literals, template
literals, unary expressions, inline functions, and unshadowed `undefined`,
`NaN`, and `Infinity`. It does not evaluate code or follow value aliases.

Unknown values, object literals, arrays, regular expressions, arbitrary
function calls, spread arguments, computed member calls, and optional calls
are skipped. Objects can implement thenables or represent another supported
resource, so the rule does not impose a closed list of valid object shapes.

There is no automatic fix. The rule also does not enforce Hook call order or
reject conditional `use` calls; those concerns belong to the Hooks linter.
