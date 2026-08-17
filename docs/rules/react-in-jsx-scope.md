# react/react-in-jsx-scope

📝 Disallow missing React when using JSX.

💼🚫 This rule is enabled in the ☑️ `recommended` [config](https://github.com/ternaus/eslint-plugin-react#configs). This rule is _disabled_ in the 🏃 `jsx-runtime` [config](https://github.com/ternaus/eslint-plugin-react#configs).

<!-- end auto-generated rule header -->

React 19 requires the automatic JSX runtime, so this rule is a no-op. It remains
available under its established rule ID for drop-in configuration compatibility.

## Rule Details

The rule intentionally reports no code. React 19+ JSX does not require a
`React` binding to be in scope.

## When Not To Use It

Do not enable this rule for new configuration. Existing configuration can retain
it without changing lint results.
