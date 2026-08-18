# Rule catalog

Start with the setup in the [repository README](../../README.md). Use this page when you need to choose an additional rule or inspect whether a rule can apply an automatic fix.

The plugin exports 11 active rules, all included in `recommended`.

This table is exhaustive. For an upstream rule ID that is absent here, see [why this package does not support it](../upstream-rule-support.md).

A `--fix` entry means ESLint can apply that rule’s fix with `eslint --fix`. A `suggestion` entry means the rule can offer an editor suggestion; it is not changed by the normal automatic-fix pass.

## Rules

| Rule | What it reports | `recommended` | Category | Fix support | Type info |
| --- | --- | :---: | --- | --- | :---: |
| [`react/controlled-form-requires-handler`](controlled-form-requires-handler.md) | Require the React 19 handler contract for controlled DOM form controls | error | correctness | — | no |
| [`react/jsx-no-constructed-context-values`](jsx-no-constructed-context-values.md) | Disallow Context provider values that change identity on every render | warn | performance | — | no |
| [`react/jsx-no-key-after-spread`](jsx-no-key-after-spread.md) | Disallow an explicit key prop after a JSX spread | error | correctness | — | no |
| [`react/no-deprecated`](no-deprecated.md) | Disallow React APIs removed in React 19 | error | correctness | — | no |
| [`react/no-direct-mutation-state`](no-direct-mutation-state.md) | Disallow direct mutation of this.state | error | correctness | — | no |
| [`react/no-function-default-props`](no-function-default-props.md) | Disallow function component defaultProps ignored by React 19 | error | correctness | — | no |
| [`react/no-implicit-ref-callback-return`](no-implicit-ref-callback-return.md) | Disallow ref callbacks that implicitly return an assignment or update | error | correctness | `--fix` | no |
| [`react/no-invalid-html-attribute`](no-invalid-html-attribute.md) | Disallow static HTML attributes and values forbidden for a React DOM element | error | correctness | — | no |
| [`react/no-misspelled-lifecycle-methods`](no-misspelled-lifecycle-methods.md) | Disallow misspelled or incorrectly static React lifecycle methods | error | correctness | — | no |
| [`react/no-prop-types`](no-prop-types.md) | Disallow component propTypes ignored by React 19 | error | correctness | — | no |
| [`react/prefer-use-state-lazy-initialization`](prefer-use-state-lazy-initialization.md) | Prefer lazy initialization for React useState values that call a function | warn | performance | — | no |
