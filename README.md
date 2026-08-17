# @ternaus/eslint-plugin-react

React linting rules for ESLint 10. This is a maintained, native-ESM fork of
[`jsx-eslint/eslint-plugin-react`](https://github.com/jsx-eslint/eslint-plugin-react):
it retains the `react/*` rule namespace and its rule set while removing legacy
tooling and configuration paths.

## Requirements

- ESLint 10
- Node.js 22.13, 24, or 26
- Flat configuration in `eslint.config.js`

ESLint 9 and `.eslintrc*` files are not supported.

## Install

```sh
yarn add --dev eslint@^10 @ternaus/eslint-plugin-react
```

## Configure

Add the recommended rules to `eslint.config.js`:

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

The package is native ESM. Node.js 22.13 and later can also load it with
`require`, so existing CommonJS flat configs can use the same plugin object:

```js
const react = require('@ternaus/eslint-plugin-react');

module.exports = [
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    ...react.configs.flat.recommended,
  },
];
```

The plugin is always registered as `react`; rule IDs therefore remain
`react/rule-name` even though the package is scoped.

## Configs

| Config | Purpose |
| --- | --- |
| `react.configs.flat.recommended` | React correctness and established best practices. |
| `react.configs.flat.all` | Every non-deprecated rule as an error. Adopt incrementally. |
| `react.configs.flat['jsx-runtime']` | Turns off `react/react-in-jsx-scope` and `react/jsx-uses-react` for the automatic JSX runtime. |

Configs are also available as importable subpaths, for example
`@ternaus/eslint-plugin-react/configs/recommended`.

## Settings

Place shared React settings in a flat-config object’s `settings` field. The
most common setting is `settings.react.version: 'detect'`. Rules that need
custom components also read `componentWrapperFunctions`, `propWrapperFunctions`,
`linkComponents`, and `formComponents` from that same object. See the relevant
rule page for its exact setting shape.

## Rules

Every shipped rule has a focused reference page in
[`docs/rules`](docs/rules). The rule metadata links to the same page from ESLint
editors. Rule behavior is tested with Espree, `@typescript-eslint/parser`, and
`@babel/eslint-parser` (including Flow syntax).

## Development

```sh
corepack enable
yarn install --immutable
yarn quality:complete
```

Biome formats the repository and owns overlapping lint rules; its completeness
check requires every exception to be registered with a reason. ESLint enforces
the remaining JavaScript and plugin-authoring rules. `yarn quality:complete`
runs formatting, both lint layers, type contracts, coverage thresholds, package
inspection, and an external tarball consumer test.

See [CONTRIBUTING.md](CONTRIBUTING.md) for change requirements,
[RELEASING.md](RELEASING.md) for publication, and [UPSTREAM.md](UPSTREAM.md) for
fork provenance and synchronization policy.

## License

MIT. The upstream project’s copyright and full Git history are preserved.
