# react/context-provider-requires-value

Requires an explicit `value` on a statically identified Context provider.
Enabled as an error in `recommended`.

A provider without `value` passes `undefined`. It does not use the default
passed to `createContext`; that default applies only when no provider exists
above the consumer. See [React's missing-value troubleshooting](https://react.dev/reference/react/useContext#i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different).

## Incorrect

```jsx
import { createContext } from 'react';

const Theme = createContext('light');

<Theme><Page /></Theme>;
<Theme.Provider theme="dark"><Page /></Theme.Provider>;
```

## Correct

```jsx
<Theme value="dark"><Page /></Theme>;
<Theme.Provider value={undefined}><Page /></Theme.Provider>;
```

Explicit `undefined` is allowed. The rule checks the presence of `value`, not
its application-specific meaning.

## Analysis boundary

The provider must be a local `const` initialized directly by React
`createContext`. Both `<Context>` and `<Context.Provider>` are checked, as
are imported React `createElement` calls with a missing, null, or
object-literal props argument. Named imports, aliases of React imports,
namespace imports, and static CommonJS imports are recognized.

Imported application contexts, mutable bindings, context aliases, computed
member access, unknown props, spreads, and computed object keys are skipped.
The rule resolves lexical bindings, so a parameter shadowing the context name
is not treated as the original context. `Context.Consumer` is not a provider.

There is no automatic fix: the linter cannot choose the intended context value.
