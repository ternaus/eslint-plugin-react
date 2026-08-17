# react/jsx-uses-react

📝 Disallow React to be incorrectly marked as unused.

💼🚫 This rule is enabled in the ☑️ `recommended` [config](https://github.com/ternaus/eslint-plugin-react#configs). This rule is _disabled_ in the 🏃 `jsx-runtime` [config](https://github.com/ternaus/eslint-plugin-react#configs).

<!-- end auto-generated rule header -->

React 19 requires the automatic JSX runtime, so this rule is a no-op. It remains
available under its established rule ID for drop-in configuration compatibility.

## Rule Details

The rule validates `settings.react.version` and otherwise reports no code. React
19+ compilers handle JSX without using a `React` binding, so ESLint's ordinary
unused-variable rules receive the correct information without this compatibility
rule.

## When Not To Use It

Do not enable this rule for new configuration. Existing configuration can retain
it without changing lint results.
