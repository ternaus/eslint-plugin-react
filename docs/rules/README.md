# Rule catalog

Start with the setup in the [repository README](../../README.md). Use this page when you need to choose an additional rule or inspect whether a rule can apply an automatic fix.

The plugin exports 104 active rules and 2 deprecated rules. The `all` preset enables every active rule as an error. Deprecated rules remain available for an explicit configuration but are not enabled by a preset.

A `--fix` entry means ESLint can apply that rule’s fix with `eslint --fix`. A `suggestion` entry means the rule can offer an editor suggestion; it is not changed by the normal automatic-fix pass.

## Rules

| Rule | What it reports | `recommended` | `all` | Fix support | Status |
| --- | --- | :---: | :---: | --- | --- |
| [`react/async-server-action`](async-server-action.md) | Require functions with the `use server` directive to be async | — | ✓ | suggestion | active |
| [`react/boolean-prop-naming`](boolean-prop-naming.md) | Enforces consistent naming for boolean props | — | ✓ | — | active |
| [`react/button-has-type`](button-has-type.md) | Disallow usage of `button` elements without an explicit `type` attribute | — | ✓ | — | active |
| [`react/checked-requires-onchange-or-readonly`](checked-requires-onchange-or-readonly.md) | Enforce using `onChange` or `readonly` attribute when `checked` is used | — | ✓ | — | active |
| [`react/default-props-match-prop-types`](default-props-match-prop-types.md) | Enforce all defaultProps have a corresponding non-required PropType | — | ✓ | — | active |
| [`react/destructuring-assignment`](destructuring-assignment.md) | Enforce consistent usage of destructuring assignment of props, state, and context | — | ✓ | `--fix` | active |
| [`react/display-name`](display-name.md) | Disallow missing displayName in a React component definition | ✓ | ✓ | — | active |
| [`react/forbid-component-props`](forbid-component-props.md) | Disallow certain props on components | — | ✓ | — | active |
| [`react/forbid-dom-props`](forbid-dom-props.md) | Disallow certain props on DOM Nodes | — | ✓ | — | active |
| [`react/forbid-elements`](forbid-elements.md) | Disallow certain elements | — | ✓ | — | active |
| [`react/forbid-foreign-prop-types`](forbid-foreign-prop-types.md) | Disallow using another component's propTypes | — | ✓ | — | active |
| [`react/forbid-prop-types`](forbid-prop-types.md) | Disallow certain propTypes | — | ✓ | — | active |
| [`react/forward-ref-uses-ref`](forward-ref-uses-ref.md) | Require all forwardRef components include a ref parameter | — | ✓ | suggestion | active |
| [`react/function-component-definition`](function-component-definition.md) | Enforce a specific function type for function components | — | ✓ | `--fix` | active |
| [`react/hook-use-state`](hook-use-state.md) | Ensure destructuring and symmetric naming of useState hook value and setter variables | — | ✓ | suggestion | active |
| [`react/iframe-missing-sandbox`](iframe-missing-sandbox.md) | Enforce sandbox attribute on iframe elements | — | ✓ | — | active |
| [`react/jsx-boolean-value`](jsx-boolean-value.md) | Enforce boolean attributes notation in JSX | — | ✓ | `--fix` | active |
| [`react/jsx-child-element-spacing`](jsx-child-element-spacing.md) | Enforce or disallow spaces inside of curly braces in JSX attributes and expressions | — | ✓ | — | active |
| [`react/jsx-closing-bracket-location`](jsx-closing-bracket-location.md) | Enforce closing bracket location in JSX | — | ✓ | `--fix` | active |
| [`react/jsx-closing-tag-location`](jsx-closing-tag-location.md) | Enforce closing tag location for multiline JSX | — | ✓ | `--fix` | active |
| [`react/jsx-curly-brace-presence`](jsx-curly-brace-presence.md) | Disallow unnecessary JSX expressions when literals alone are sufficient or enforce JSX expressions on literals in JSX children or attributes | — | ✓ | `--fix` | active |
| [`react/jsx-curly-newline`](jsx-curly-newline.md) | Enforce consistent linebreaks in curly braces in JSX attributes and expressions | — | ✓ | `--fix` | active |
| [`react/jsx-curly-spacing`](jsx-curly-spacing.md) | Enforce or disallow spaces inside of curly braces in JSX attributes and expressions | — | ✓ | `--fix` | active |
| [`react/jsx-equals-spacing`](jsx-equals-spacing.md) | Enforce or disallow spaces around equal signs in JSX attributes | — | ✓ | `--fix` | active |
| [`react/jsx-filename-extension`](jsx-filename-extension.md) | Disallow file extensions that may contain JSX | — | ✓ | — | active |
| [`react/jsx-first-prop-new-line`](jsx-first-prop-new-line.md) | Enforce proper position of the first property in JSX | — | ✓ | `--fix` | active |
| [`react/jsx-fragments`](jsx-fragments.md) | Enforce shorthand or standard form for React fragments | — | ✓ | `--fix` | active |
| [`react/jsx-handler-names`](jsx-handler-names.md) | Enforce event handler naming conventions in JSX | — | ✓ | — | active |
| [`react/jsx-indent`](jsx-indent.md) | Enforce JSX indentation | — | ✓ | `--fix` | active |
| [`react/jsx-indent-props`](jsx-indent-props.md) | Enforce props indentation in JSX | — | ✓ | `--fix` | active |
| [`react/jsx-key`](jsx-key.md) | Disallow missing `key` props in iterators/collection literals | ✓ | ✓ | — | active |
| [`react/jsx-max-depth`](jsx-max-depth.md) | Enforce JSX maximum depth | — | ✓ | — | active |
| [`react/jsx-max-props-per-line`](jsx-max-props-per-line.md) | Enforce maximum of props on a single line in JSX | — | ✓ | `--fix` | active |
| [`react/jsx-newline`](jsx-newline.md) | Require or prevent a new line after jsx elements and expressions. | — | ✓ | `--fix` | active |
| [`react/jsx-no-bind`](jsx-no-bind.md) | Disallow `.bind()` or arrow functions in JSX props | — | ✓ | — | active |
| [`react/jsx-no-comment-textnodes`](jsx-no-comment-textnodes.md) | Disallow comments from being inserted as text nodes | ✓ | ✓ | — | active |
| [`react/jsx-no-constructed-context-values`](jsx-no-constructed-context-values.md) | Disallows JSX context provider values from taking values that will cause needless rerenders | — | ✓ | — | active |
| [`react/jsx-no-duplicate-props`](jsx-no-duplicate-props.md) | Disallow duplicate properties in JSX | ✓ | ✓ | — | active |
| [`react/jsx-no-leaked-render`](jsx-no-leaked-render.md) | Disallow problematic leaked values from being rendered | — | ✓ | `--fix` | active |
| [`react/jsx-no-literals`](jsx-no-literals.md) | Disallow usage of string literals in JSX | — | ✓ | — | active |
| [`react/jsx-no-script-url`](jsx-no-script-url.md) | Disallow usage of `javascript:` URLs | — | ✓ | — | active |
| [`react/jsx-no-target-blank`](jsx-no-target-blank.md) | Disallow `target="_blank"` attribute without `rel="noreferrer"` | ✓ | ✓ | `--fix` | active |
| [`react/jsx-no-undef`](jsx-no-undef.md) | Disallow undeclared variables in JSX | ✓ | ✓ | — | active |
| [`react/jsx-no-useless-fragment`](jsx-no-useless-fragment.md) | Disallow unnecessary fragments | — | ✓ | `--fix` | active |
| [`react/jsx-one-expression-per-line`](jsx-one-expression-per-line.md) | Require one JSX element per line | — | ✓ | `--fix` | active |
| [`react/jsx-pascal-case`](jsx-pascal-case.md) | Enforce PascalCase for user-defined JSX components | — | ✓ | — | active |
| [`react/jsx-props-no-multi-spaces`](jsx-props-no-multi-spaces.md) | Disallow multiple spaces between inline JSX props | — | ✓ | `--fix` | active |
| [`react/jsx-props-no-spread-multi`](jsx-props-no-spread-multi.md) | Disallow JSX prop spreading the same identifier multiple times | — | ✓ | — | active |
| [`react/jsx-props-no-spreading`](jsx-props-no-spreading.md) | Disallow JSX prop spreading | — | ✓ | — | active |
| [`react/jsx-sort-default-props`](jsx-sort-default-props.md) | Enforce defaultProps declarations alphabetical sorting | — | — | — | deprecated |
| [`react/jsx-sort-props`](jsx-sort-props.md) | Enforce props alphabetical sorting | — | ✓ | `--fix` | active |
| [`react/jsx-space-before-closing`](jsx-space-before-closing.md) | Enforce spacing before closing bracket in JSX | — | — | `--fix` | deprecated |
| [`react/jsx-tag-spacing`](jsx-tag-spacing.md) | Enforce whitespace in and around the JSX opening and closing brackets | — | ✓ | `--fix` | active |
| [`react/jsx-uses-react`](jsx-uses-react.md) | Disallow React to be incorrectly marked as unused | ✓ | ✓ | — | active |
| [`react/jsx-uses-vars`](jsx-uses-vars.md) | Disallow variables used in JSX to be incorrectly marked as unused | ✓ | ✓ | — | active |
| [`react/jsx-wrap-multilines`](jsx-wrap-multilines.md) | Disallow missing parentheses around multiline JSX | — | ✓ | `--fix` | active |
| [`react/no-access-state-in-setstate`](no-access-state-in-setstate.md) | Disallow when this.state is accessed within setState | — | ✓ | — | active |
| [`react/no-adjacent-inline-elements`](no-adjacent-inline-elements.md) | Disallow adjacent inline elements not separated by whitespace. | — | ✓ | — | active |
| [`react/no-array-index-key`](no-array-index-key.md) | Disallow usage of Array index in keys | — | ✓ | — | active |
| [`react/no-arrow-function-lifecycle`](no-arrow-function-lifecycle.md) | Lifecycle methods should be methods on the prototype, not class fields | — | ✓ | `--fix` | active |
| [`react/no-children-prop`](no-children-prop.md) | Disallow passing of children as props | ✓ | ✓ | — | active |
| [`react/no-danger`](no-danger.md) | Disallow usage of dangerous React properties | — | ✓ | — | active |
| [`react/no-danger-with-children`](no-danger-with-children.md) | Disallow when a DOM element is using both children and dangerouslySetInnerHTML | ✓ | ✓ | — | active |
| [`react/no-deprecated`](no-deprecated.md) | Disallow usage of deprecated methods | ✓ | ✓ | — | active |
| [`react/no-did-mount-set-state`](no-did-mount-set-state.md) | Disallow usage of setState in componentDidMount | — | ✓ | — | active |
| [`react/no-did-update-set-state`](no-did-update-set-state.md) | Disallow usage of setState in componentDidUpdate | — | ✓ | — | active |
| [`react/no-direct-mutation-state`](no-direct-mutation-state.md) | Disallow direct mutation of this.state | ✓ | ✓ | — | active |
| [`react/no-find-dom-node`](no-find-dom-node.md) | Disallow usage of findDOMNode | ✓ | ✓ | — | active |
| [`react/no-invalid-html-attribute`](no-invalid-html-attribute.md) | Disallow usage of invalid attributes | — | ✓ | suggestion | active |
| [`react/no-is-mounted`](no-is-mounted.md) | Disallow usage of isMounted | ✓ | ✓ | — | active |
| [`react/no-multi-comp`](no-multi-comp.md) | Disallow multiple component definition per file | — | ✓ | — | active |
| [`react/no-namespace`](no-namespace.md) | Enforce that namespaces are not used in React elements | — | ✓ | — | active |
| [`react/no-object-type-as-default-prop`](no-object-type-as-default-prop.md) | Disallow usage of referential-type variables as default param in functional component | — | ✓ | — | active |
| [`react/no-redundant-should-component-update`](no-redundant-should-component-update.md) | Disallow usage of shouldComponentUpdate when extending React.PureComponent | — | ✓ | — | active |
| [`react/no-render-return-undefined`](no-render-return-undefined.md) | Disallow React components from returning undefined | — | ✓ | — | active |
| [`react/no-render-return-value`](no-render-return-value.md) | Disallow usage of the return value of ReactDOM.render | ✓ | ✓ | — | active |
| [`react/no-set-state`](no-set-state.md) | Disallow usage of setState | — | ✓ | — | active |
| [`react/no-string-refs`](no-string-refs.md) | Disallow using string references | ✓ | ✓ | — | active |
| [`react/no-this-in-sfc`](no-this-in-sfc.md) | Disallow `this` from being used in stateless functional components | — | ✓ | — | active |
| [`react/no-typos`](no-typos.md) | Disallow common typos | — | ✓ | — | active |
| [`react/no-unescaped-entities`](no-unescaped-entities.md) | Disallow unescaped HTML entities from appearing in markup | ✓ | ✓ | suggestion | active |
| [`react/no-unknown-property`](no-unknown-property.md) | Disallow usage of unknown DOM property | ✓ | ✓ | `--fix` | active |
| [`react/no-unsafe`](no-unsafe.md) | Disallow usage of unsafe lifecycle methods | — | ✓ | — | active |
| [`react/no-unstable-nested-components`](no-unstable-nested-components.md) | Disallow creating unstable components inside components | — | ✓ | — | active |
| [`react/no-unused-class-component-methods`](no-unused-class-component-methods.md) | Disallow declaring unused methods of component class | — | ✓ | — | active |
| [`react/no-unused-prop-types`](no-unused-prop-types.md) | Disallow definitions of unused propTypes | — | ✓ | — | active |
| [`react/no-unused-state`](no-unused-state.md) | Disallow definitions of unused state | — | ✓ | — | active |
| [`react/no-will-update-set-state`](no-will-update-set-state.md) | Disallow usage of setState in componentWillUpdate | — | ✓ | — | active |
| [`react/prefer-es6-class`](prefer-es6-class.md) | Enforce ES5 or ES6 class for React Components | — | ✓ | — | active |
| [`react/prefer-exact-props`](prefer-exact-props.md) | Prefer exact proptype definitions | — | ✓ | — | active |
| [`react/prefer-read-only-props`](prefer-read-only-props.md) | Enforce that props are read-only | — | ✓ | `--fix` | active |
| [`react/prefer-stateless-function`](prefer-stateless-function.md) | Enforce stateless components to be written as a pure function | — | ✓ | — | active |
| [`react/prefer-use-state-lazy-initialization`](prefer-use-state-lazy-initialization.md) | Prefer lazy initialization for React useState values that call a function | — | ✓ | — | active |
| [`react/prop-types`](prop-types.md) | Disallow missing props validation in a React component definition | ✓ | ✓ | — | active |
| [`react/react-in-jsx-scope`](react-in-jsx-scope.md) | Disallow missing React when using JSX | ✓ | ✓ | — | active |
| [`react/require-default-props`](require-default-props.md) | Enforce a defaultProps definition for every prop that is not a required prop | — | ✓ | — | active |
| [`react/require-optimization`](require-optimization.md) | Enforce React components to have a shouldComponentUpdate method | — | ✓ | — | active |
| [`react/require-render-return`](require-render-return.md) | Enforce ES5 or ES6 class for returning value in render function | ✓ | ✓ | — | active |
| [`react/self-closing-comp`](self-closing-comp.md) | Disallow extra closing tags for components without children | — | ✓ | `--fix` | active |
| [`react/sort-comp`](sort-comp.md) | Enforce component methods order | — | ✓ | — | active |
| [`react/sort-default-props`](sort-default-props.md) | Enforce defaultProps declarations alphabetical sorting | — | ✓ | — | active |
| [`react/sort-prop-types`](sort-prop-types.md) | Enforce propTypes declarations alphabetical sorting | — | ✓ | `--fix` | active |
| [`react/state-in-constructor`](state-in-constructor.md) | Enforce class component state initialization style | — | ✓ | — | active |
| [`react/static-property-placement`](static-property-placement.md) | Enforces where React component static properties should be positioned. | — | ✓ | — | active |
| [`react/style-prop-object`](style-prop-object.md) | Enforce style prop value is an object | — | ✓ | — | active |
| [`react/void-dom-elements-no-children`](void-dom-elements-no-children.md) | Disallow void DOM elements (e.g. `<img />`, `<br />`) from receiving children | — | ✓ | — | active |
