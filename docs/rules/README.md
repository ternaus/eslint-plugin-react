# Rule catalog

Start with the setup in the [repository README](../../README.md). Use this page when you need to choose an additional rule or inspect whether a rule can apply an automatic fix.

The plugin exports 73 active rules. The `all` preset enables every rule as an error.

A `--fix` entry means ESLint can apply that rule’s fix with `eslint --fix`. A `suggestion` entry means the rule can offer an editor suggestion; it is not changed by the normal automatic-fix pass.

## Rules

| Rule | What it reports | `recommended` | `all` | Category | Fix support | Type info |
| --- | --- | :---: | :---: | --- | --- | :---: |
| [`react/async-server-action`](async-server-action.md) | Require functions with the `use server` directive to be async | error | ✓ | correctness | suggestion | no |
| [`react/boolean-prop-naming`](boolean-prop-naming.md) | Enforces consistent naming for boolean props | — | ✓ | policy | — | no |
| [`react/button-has-type`](button-has-type.md) | Disallow usage of `button` elements without an explicit `type` attribute | error | ✓ | correctness | — | no |
| [`react/controlled-form-requires-handler`](controlled-form-requires-handler.md) | Require the React 19 handler contract for controlled DOM form controls | error | ✓ | correctness | — | no |
| [`react/destructuring-assignment`](destructuring-assignment.md) | Enforce consistent usage of destructuring assignment of props, state, and context | — | ✓ | policy | `--fix` | no |
| [`react/display-name`](display-name.md) | Disallow missing displayName in a React component definition | — | ✓ | policy | — | no |
| [`react/forbid-component-props`](forbid-component-props.md) | Disallow certain props on components | — | ✓ | policy | — | no |
| [`react/forbid-dom-props`](forbid-dom-props.md) | Disallow certain props on DOM Nodes | — | ✓ | policy | — | no |
| [`react/forbid-elements`](forbid-elements.md) | Disallow certain elements | — | ✓ | policy | — | no |
| [`react/function-component-definition`](function-component-definition.md) | Enforce a specific function type for function components | — | ✓ | policy | `--fix` | no |
| [`react/hook-use-state`](hook-use-state.md) | Ensure destructuring and symmetric naming of useState hook value and setter variables | — | ✓ | policy | suggestion | no |
| [`react/iframe-missing-sandbox`](iframe-missing-sandbox.md) | Enforce sandbox attribute on iframe elements | — | ✓ | security | — | no |
| [`react/jsx-boolean-value`](jsx-boolean-value.md) | Enforce boolean attributes notation in JSX | — | ✓ | policy | `--fix` | no |
| [`react/jsx-curly-brace-presence`](jsx-curly-brace-presence.md) | Disallow unnecessary JSX expressions when literals alone are sufficient or enforce JSX expressions on literals in JSX children or attributes | — | ✓ | policy | `--fix` | no |
| [`react/jsx-filename-extension`](jsx-filename-extension.md) | Disallow file extensions that may contain JSX | — | ✓ | policy | — | no |
| [`react/jsx-fragments`](jsx-fragments.md) | Enforce shorthand or standard form for React fragments | — | ✓ | policy | `--fix` | no |
| [`react/jsx-handler-names`](jsx-handler-names.md) | Enforce event handler naming conventions in JSX | — | ✓ | policy | — | no |
| [`react/jsx-key`](jsx-key.md) | Disallow missing `key` props in iterators/collection literals | error | ✓ | correctness | — | no |
| [`react/jsx-max-depth`](jsx-max-depth.md) | Enforce JSX maximum depth | — | ✓ | policy | — | no |
| [`react/jsx-no-bind`](jsx-no-bind.md) | Disallow `.bind()` or arrow functions in JSX props | — | ✓ | performance | — | no |
| [`react/jsx-no-comment-textnodes`](jsx-no-comment-textnodes.md) | Disallow comments from being inserted as text nodes | error | ✓ | correctness | — | no |
| [`react/jsx-no-constructed-context-values`](jsx-no-constructed-context-values.md) | Disallows JSX context provider values from taking values that will cause needless rerenders | warn | ✓ | performance | — | no |
| [`react/jsx-no-duplicate-props`](jsx-no-duplicate-props.md) | Disallow duplicate properties in JSX | error | ✓ | correctness | — | no |
| [`react/jsx-no-key-after-spread`](jsx-no-key-after-spread.md) | Disallow an explicit key prop after a JSX spread | error | ✓ | correctness | — | no |
| [`react/jsx-no-leaked-render`](jsx-no-leaked-render.md) | Disallow problematic leaked values from being rendered | — | ✓ | correctness | `--fix` | no |
| [`react/jsx-no-literals`](jsx-no-literals.md) | Disallow usage of string literals in JSX | — | ✓ | policy | — | no |
| [`react/jsx-no-script-url`](jsx-no-script-url.md) | Disallow usage of `javascript:` URLs | error | ✓ | security | — | no |
| [`react/jsx-no-useless-fragment`](jsx-no-useless-fragment.md) | Disallow unnecessary fragments | — | ✓ | correctness | `--fix` | no |
| [`react/jsx-pascal-case`](jsx-pascal-case.md) | Enforce PascalCase for user-defined JSX components | — | ✓ | policy | — | no |
| [`react/jsx-props-no-spread-multi`](jsx-props-no-spread-multi.md) | Disallow JSX prop spreading the same identifier multiple times | — | ✓ | policy | — | no |
| [`react/jsx-props-no-spreading`](jsx-props-no-spreading.md) | Disallow JSX prop spreading | — | ✓ | policy | — | no |
| [`react/jsx-sort-props`](jsx-sort-props.md) | Enforce props alphabetical sorting | — | ✓ | policy | `--fix` | no |
| [`react/no-access-state-in-setstate`](no-access-state-in-setstate.md) | Disallow when this.state is accessed within setState | — | ✓ | correctness | — | no |
| [`react/no-adjacent-inline-elements`](no-adjacent-inline-elements.md) | Disallow adjacent inline elements not separated by whitespace. | — | ✓ | policy | — | no |
| [`react/no-array-index-key`](no-array-index-key.md) | Disallow usage of Array index in keys | warn | ✓ | correctness | — | no |
| [`react/no-arrow-function-lifecycle`](no-arrow-function-lifecycle.md) | Lifecycle methods should be methods on the prototype, not class fields | — | ✓ | correctness | `--fix` | no |
| [`react/no-children-prop`](no-children-prop.md) | Disallow passing of children as props | — | ✓ | correctness | — | no |
| [`react/no-danger`](no-danger.md) | Disallow usage of dangerous React properties | warn | ✓ | security | — | no |
| [`react/no-danger-with-children`](no-danger-with-children.md) | Disallow when a DOM element is using both children and dangerouslySetInnerHTML | error | ✓ | security | — | no |
| [`react/no-deprecated`](no-deprecated.md) | Disallow React APIs removed in React 19 | error | ✓ | correctness | — | no |
| [`react/no-did-mount-set-state`](no-did-mount-set-state.md) | Disallow usage of setState in componentDidMount | — | ✓ | correctness | — | no |
| [`react/no-did-update-set-state`](no-did-update-set-state.md) | Disallow usage of setState in componentDidUpdate | — | ✓ | correctness | — | no |
| [`react/no-direct-mutation-state`](no-direct-mutation-state.md) | Disallow direct mutation of this.state | error | ✓ | correctness | — | no |
| [`react/no-function-default-props`](no-function-default-props.md) | Disallow function component defaultProps ignored by React 19 | error | ✓ | correctness | — | no |
| [`react/no-implicit-ref-callback-return`](no-implicit-ref-callback-return.md) | Disallow ref callbacks that implicitly return an assignment or update | error | ✓ | correctness | `--fix` | no |
| [`react/no-invalid-html-attribute`](no-invalid-html-attribute.md) | Disallow static HTML attributes and values forbidden for a React DOM element | error | ✓ | correctness | — | no |
| [`react/no-misspelled-lifecycle-methods`](no-misspelled-lifecycle-methods.md) | Disallow misspelled or incorrectly static React lifecycle methods | error | ✓ | correctness | — | no |
| [`react/no-multi-comp`](no-multi-comp.md) | Disallow multiple component definition per file | — | ✓ | policy | — | no |
| [`react/no-namespace`](no-namespace.md) | Enforce that namespaces are not used in React elements | error | ✓ | correctness | — | no |
| [`react/no-object-type-as-default-prop`](no-object-type-as-default-prop.md) | Disallow usage of referential-type variables as default param in functional component | — | ✓ | policy | — | no |
| [`react/no-prop-types`](no-prop-types.md) | Disallow component propTypes ignored by React 19 | error | ✓ | correctness | — | no |
| [`react/no-redundant-should-component-update`](no-redundant-should-component-update.md) | Disallow usage of shouldComponentUpdate when extending React.PureComponent | — | ✓ | performance | — | no |
| [`react/no-render-return-undefined`](no-render-return-undefined.md) | Disallow React components from returning undefined | — | ✓ | correctness | — | no |
| [`react/no-set-state`](no-set-state.md) | Disallow usage of setState | — | ✓ | policy | — | no |
| [`react/no-string-refs`](no-string-refs.md) | Disallow using string references | error | ✓ | correctness | — | no |
| [`react/no-this-in-sfc`](no-this-in-sfc.md) | Disallow `this` from being used in stateless functional components | — | ✓ | policy | — | no |
| [`react/no-unescaped-entities`](no-unescaped-entities.md) | Disallow unescaped HTML entities from appearing in markup | — | ✓ | policy | suggestion | no |
| [`react/no-unknown-property`](no-unknown-property.md) | Disallow usage of unknown DOM property | error | ✓ | correctness | `--fix` | no |
| [`react/no-unsafe`](no-unsafe.md) | Disallow usage of unsafe lifecycle methods | — | ✓ | correctness | — | no |
| [`react/no-unused-class-component-methods`](no-unused-class-component-methods.md) | Disallow declaring unused methods of component class | — | ✓ | policy | — | no |
| [`react/no-unused-prop-types`](no-unused-prop-types.md) | Disallow definitions of unused propTypes | — | ✓ | policy | — | no |
| [`react/no-unused-state`](no-unused-state.md) | Disallow definitions of unused state | — | ✓ | policy | — | no |
| [`react/no-will-update-set-state`](no-will-update-set-state.md) | Disallow usage of setState in componentWillUpdate | — | ✓ | correctness | — | no |
| [`react/prefer-read-only-props`](prefer-read-only-props.md) | Enforce that props are read-only | — | ✓ | policy | `--fix` | no |
| [`react/prefer-stateless-function`](prefer-stateless-function.md) | Enforce stateless components to be written as a pure function | — | ✓ | policy | — | no |
| [`react/prefer-use-state-lazy-initialization`](prefer-use-state-lazy-initialization.md) | Prefer lazy initialization for React useState values that call a function | warn | ✓ | performance | — | no |
| [`react/self-closing-comp`](self-closing-comp.md) | Disallow extra closing tags for components without children | — | ✓ | policy | `--fix` | no |
| [`react/sort-comp`](sort-comp.md) | Enforce component methods order | — | ✓ | policy | — | no |
| [`react/sort-default-props`](sort-default-props.md) | Enforce defaultProps declarations alphabetical sorting | — | ✓ | policy | — | no |
| [`react/state-in-constructor`](state-in-constructor.md) | Enforce class component state initialization style | — | ✓ | policy | — | no |
| [`react/static-property-placement`](static-property-placement.md) | Enforces where React component static properties should be positioned. | — | ✓ | policy | — | no |
| [`react/style-prop-object`](style-prop-object.md) | Enforce style prop value is an object | — | ✓ | policy | — | no |
| [`react/void-dom-elements-no-children`](void-dom-elements-no-children.md) | Disallow void DOM elements (e.g. `<img />`, `<br />`) from receiving children | error | ✓ | correctness | — | no |
