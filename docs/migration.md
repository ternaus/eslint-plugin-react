# Migration to the React 19 rule set

Version 8 is the first public release of this package. It deliberately starts
with a React 19+, ESLint 10, flat-config-only contract instead of carrying
compatibility implementations that no supported project needs.

The tables below are a map for source configurations. The removed rules have
no runtime aliases. Choose the listed replacement only when it addresses the
same concern in your project; otherwise remove the rule from the configuration.

## Removed rules

| Removed rule | What to do instead |
| --- | --- |
| `default-props-match-prop-types` | Remove it; React 19 does not use component `propTypes`. |
| `forbid-foreign-prop-types` | Remove it; React 19 does not use component `propTypes`. |
| `forbid-prop-types` | Use TypeScript or your project’s schema validation policy. |
| `forward-ref-uses-ref` | Remove it; `ref` is a normal prop in React 19. |
| `jsx-child-element-spacing` | Let Biome format JSX. |
| `jsx-closing-bracket-location` | Let Biome format JSX. |
| `jsx-closing-tag-location` | Let Biome format JSX. |
| `jsx-curly-newline` | Let Biome format JSX. |
| `jsx-curly-spacing` | Let Biome format JSX. |
| `jsx-equals-spacing` | Let Biome format JSX. |
| `jsx-first-prop-new-line` | Let Biome format JSX. |
| `jsx-indent` | Let Biome format JSX. |
| `jsx-indent-props` | Let Biome format JSX. |
| `jsx-max-props-per-line` | Let Biome format JSX. |
| `jsx-newline` | Let Biome format JSX. |
| `jsx-no-target-blank` | Remove it; modern HTML gives `_blank` an implicit `noopener`. |
| `jsx-no-undef` | Remove it; ESLint 10 resolves JSX references itself. |
| `jsx-one-expression-per-line` | Let Biome format JSX. |
| `jsx-props-no-multi-spaces` | Let Biome format JSX. |
| `jsx-sort-default-props` | Use `react/sort-default-props`. |
| `jsx-space-before-closing` | Let Biome format JSX. |
| `jsx-tag-spacing` | Let Biome format JSX. |
| `jsx-uses-react` | Remove it; React 19’s automatic JSX runtime does not need a React import. |
| `jsx-uses-vars` | Remove it; ESLint 10 resolves JSX references itself. |
| `jsx-wrap-multilines` | Let Biome format JSX. |
| `no-find-dom-node` | Use `react/no-deprecated`. |
| `no-is-mounted` | Use `react/no-deprecated`. |
| `no-render-return-value` | Use `react/no-deprecated`. |
| `no-typos` | Use `react/no-misspelled-lifecycle-methods` for the supported React lifecycle subset. |
| `no-unstable-nested-components` | Use `react-hooks/static-components`. |
| `prefer-es6-class` | Remove it; create-class compatibility is outside the React 19 contract. |
| `prefer-exact-props` | Remove it; React 19 does not use component `propTypes`. |
| `prop-types` | Use TypeScript or schema validation; React 19 ignores component `propTypes`. |
| `react-in-jsx-scope` | Remove it; React 19 uses the automatic JSX runtime. |
| `require-default-props` | Use JavaScript default parameters or TypeScript optional properties. |
| `require-optimization` | Use React Compiler and targeted performance profiling. |
| `require-render-return` | Remove it; this is not a React 19 invariant. |
| `sort-prop-types` | Remove it; React 19 does not use component `propTypes`. |

## Renamed rule

| Previous rule | Replacement |
| --- | --- |
| `checked-requires-onchange-or-readonly` | `controlled-form-requires-handler` |

The replacement follows React 19’s complete DOM form contract: `onInput` is
also valid for `value`, `checked` still requires `onChange`, and it detects
conflicting controlled and uncontrolled props.

## Platform boundary

Platform-neutral JSX and React-core rules can analyze React Native source, but
this package does not provide a React Native compatibility contract or preset.
DOM rules apply only to known lowercase HTML elements and skip `View`, `Text`,
custom elements, SVG, MathML, and dynamically determined host elements.
