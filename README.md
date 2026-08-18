# @ternaus/eslint-plugin-react

> [Support ongoing maintenance on PayPal](https://www.paypal.com/paypalme/ternaus)

React 19+ linting rules for ESLint 10. This is an independent native-ESM
continuation of [`jsx-eslint/eslint-plugin-react`](https://github.com/jsx-eslint/eslint-plugin-react).
It preserves the established `react/*` rule namespace, upstream Git history,
and MIT attribution while removing legacy tooling and configuration paths.

## What this package is for

Use this plugin to find React correctness problems, unsafe legacy APIs, JSX
mistakes, and optional consistency issues. Start with the curated
`recommended` preset. Add a specific rule when it matches a problem in your
codebase, or use `all` once to audit the full rule set before choosing which
checks to keep.

This project supports React 19 and newer, ESLint 10, Node.js 22.13, 24, and 26,
and flat config in `eslint.config.js`. React 18 and earlier, ESLint 9, and
`.eslintrc*` files are not supported.

## Install

```sh
yarn add --dev eslint@^10 @ternaus/eslint-plugin-react
```

## Use it

Create `eslint.config.js` and start with the recommended React checks:

```js
import react from '@ternaus/eslint-plugin-react';

export default [
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    ...react.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
```

Keep this React config scoped to JavaScript and TypeScript source files that
your parser can handle as JSX. Configure Markdown, JSON, CSS, and other
processor-managed files separately instead of applying React rules to a broad
`**/*` glob.

### Use `defineConfig`

`defineConfig` can resolve the plugin's flat presets by name. Register the
plugin under `react`, then extend the matching `react/flat/*` alias:

```js
import { defineConfig } from 'eslint/config';
import react from '@ternaus/eslint-plugin-react';

export default defineConfig({
  files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
  plugins: { react },
  extends: ['react/flat/recommended'],
  settings: {
    react: {
      version: 'detect',
    },
  },
});
```

The available aliases are `react/flat/recommended`, `react/flat/all`, and
`react/flat/jsx-runtime`. The existing `react.configs.flat.*` objects remain
available for direct composition.

Run the checks, then review and apply available automatic fixes:

```sh
yarn eslint .
yarn eslint . --fix
```

React 19 requires the automatic JSX runtime. The historical
`react-in-jsx-scope` and `jsx-uses-react` rule IDs are retained as no-ops for
drop-in configuration compatibility, so `react.configs.flat['jsx-runtime']` is
not needed. The alias remains available for configurations that already extend
it.

The package is native ESM, but Node.js 22.13 and later can load it with
`require`. A CommonJS flat config uses the same plugin object:

```js
const react = require('@ternaus/eslint-plugin-react');

module.exports = [
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    ...react.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
```

The plugin is always registered as `react`, so rule IDs stay in the familiar
`react/rule-name` form even though the package is scoped.

## Choose the checks you need

<!-- rule-config-summary:start -->
| Config | Active rules | Use it when |
| --- | ---: | --- |
| `recommended` | 21 | You want the supported baseline for React correctness and established best practices. |
| `all` | 104 | You want to audit every non-deprecated rule, then keep only the rules that fit your codebase. |
| `jsx-runtime` | 2 disabled | Compatibility alias for existing flat configs; React 19+ always uses the automatic JSX runtime. |
<!-- rule-config-summary:end -->

Use `recommended` for normal development. Treat `all` as an audit: it enables
every active rule at error severity, including opinionated and style-oriented
rules. After reviewing the findings, keep individual rules deliberately:

```js
import react from '@ternaus/eslint-plugin-react';

const recommended = react.configs.flat.recommended;

export default [
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    ...recommended,
    rules: {
      ...recommended.rules,
      'react/no-array-index-key': 'error',
    },
  },
];
```

The [rule catalog](docs/rules/README.md) lists every rule, what it reports,
whether each preset enables it, and whether it supports `--fix` or an editor
suggestion. Each rule name links to examples and options.

## React settings

The minimum supported version is React 19. Set `settings.react.version` to
`'detect'` when React is installed in the linted workspace, or to a fixed
version such as `'19.0.0'` when it is not. Any resolved version below 19 is a
configuration error.

The plugin has no React runtime or peer dependency. With `'detect'`, it resolves
React from the file being linted; if React is unavailable, it warns and assumes
the latest version. A fixed version avoids that warning in tooling-only
repositories. Rules with project-specific components read
`componentWrapperFunctions`, `propWrapperFunctions`, `linkComponents`, and
`formComponents` from the same `settings.react` object. Each rule page documents
its exact option and setting shape.

### Migrating to React 19+

Update a fixed `settings.react.version` below 19 to `'19.0.0'` or newer. Existing
`'detect'` configurations need no change once the workspace resolves React 19+.
The two classic-JSX scope rules remain in configurations but perform no checks,
because React 19 requires the automatic JSX runtime.

## How the project verifies rule behavior

Every rule has a focused reference page and regression tests. The test suite
runs eligible cases with Espree, `@typescript-eslint/parser`, and
`@babel/eslint-parser`, including Flow syntax. The complete quality command also
enforces coverage thresholds, validates the generated rule catalog, inspects the
published archive, and loads that archive as ESM, CommonJS, and TypeScript.

## Develop the plugin

```sh
corepack enable
yarn install --immutable
yarn quality:complete
```

Biome formats the repository and owns overlapping lint rules; its completeness
check requires every exception to be registered with a reason. ESLint enforces
the remaining JavaScript and plugin-authoring rules.

See [CONTRIBUTING.md](CONTRIBUTING.md) for change requirements,
[RELEASING.md](RELEASING.md) for publication, and [UPSTREAM.md](UPSTREAM.md) for
the project's provenance and independent-maintenance policy.

## Cite this project

If this project supports published work, cite the exact release you used. GitHub’s
**Cite this repository** control reads [CITATION.cff](CITATION.cff) and provides
ready-to-copy APA and BibTeX entries. You can also use this BibTeX entry:

```bibtex
@software{Iglovikov_eslint_plugin_react_2026,
  author = {Iglovikov, Vladimir},
  title = {{@ternaus/eslint-plugin-react}},
  url = {https://github.com/ternaus/eslint-plugin-react},
  version = {8.0.0-alpha.0},
  year = {2026}
}
```

## License

MIT. The upstream project’s copyright and full Git history are preserved.
