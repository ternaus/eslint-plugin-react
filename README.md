# @ternaus/eslint-plugin-react

> [Support ongoing maintenance on PayPal](https://www.paypal.com/paypalme/ternaus)

React 19+ rules for ESLint 10 that Biome does not provide. Use it alongside
Biome 2.5.8, which owns general JavaScript, JSX, DOM, and React
checks. This independent native-ESM continuation of
[`jsx-eslint/eslint-plugin-react`](https://github.com/jsx-eslint/eslint-plugin-react)
preserves the `react/*` namespace, upstream Git history, and MIT attribution.

## What this package is for

Start with Biome's `all` preset. Add this plugin for React 19 contracts that
Biome does not yet expose, such as invalid HTML attribute values, controlled
form handlers, and React APIs removed in version 19. The `recommended` preset
contains the entire supported package contract.

This project supports React 19 and newer, ESLint 10, Node.js 22.13, 24, and
26, and flat config in `eslint.config.js`. The repository verifies its Biome
ownership boundary with Biome 2.5.8. React 18 and earlier, ESLint 9, and
`.eslintrc*` files are not supported.

## Install

```sh
yarn add --dev @biomejs/biome@2.5.8 eslint@^10 @ternaus/eslint-plugin-react
```

## Use it with Biome

Enable Biome's recommended and additional stable rules, including the React
domain:

```json
{
  "linter": {
    "domains": { "react": "all" },
    "rules": { "preset": "all" }
  }
}
```

Then add this package's residual React checks to `eslint.config.js`:

```js
import react from '@ternaus/eslint-plugin-react';

export default [
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    ...react.configs.flat.recommended,
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
});
```

The available alias is `react/flat/recommended`. The same config is available
for direct composition through `react.configs.flat.recommended`.

Run both tools, then review and apply available automatic fixes:

```sh
yarn biome check .
yarn biome check . --write
yarn eslint .
yarn eslint . --fix
```

The package is native ESM, but Node.js 22.13 and later can load it with
`require`. A CommonJS flat config uses the same plugin object:

```js
const react = require('@ternaus/eslint-plugin-react');

module.exports = [
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    ...react.configs.flat.recommended,
  },
];
```

The plugin is always registered as `react`, so rule IDs stay in the familiar
`react/rule-name` form even though the package is scoped.

## Choose the checks you need

<!-- rule-config-summary:start -->
| Config | Active rules | Use it when |
| --- | ---: | --- |
| `recommended` | 11 | You want the supported baseline of React 19 contracts that Biome does not provide. |
<!-- rule-config-summary:end -->

Use `recommended` for normal development. It contains every rule this package
owns. You can raise the two performance signals to errors when that fits your
project:

```js
import react from '@ternaus/eslint-plugin-react';

const recommended = react.configs.flat.recommended;

export default [
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    ...recommended,
    rules: {
      ...recommended.rules,
      'react/jsx-no-constructed-context-values': 'error',
    },
  },
];
```

The [rule catalog](docs/rules/README.md) lists every rule, what it reports,
whether each preset enables it, and whether it supports `--fix` or an editor
suggestion. Each rule name links to examples and options.

## Platform boundary

Platform-neutral JSX and React-core checks can analyze React Native source, but
this package has no React Native compatibility contract or native-specific
preset. Rules about HTML and React DOM form behavior operate only on proven
lowercase HTML elements; they skip `View`, `Text`, custom elements, SVG,
MathML, and dynamic host elements.

## React version and settings

React version detection is not part of this package: every rule has one React
19+ behavior path and never reads `react/package.json`. Biome owns the
overlapping React and JSX checks. Each remaining rule page documents its own
options and settings.

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

Biome formats the repository and owns general JavaScript, JSX, DOM, and React
rules; its completeness check requires every exception to be registered with a
reason. ESLint enforces the residual Node.js and ESLint-plugin authoring rules.

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
  version = {8.0.0-rc.1},
  year = {2026}
}
```

## License

MIT. The upstream project’s copyright and full Git history are preserved.
