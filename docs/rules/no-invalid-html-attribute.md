# react/no-invalid-html-attribute

Reports static HTML attributes and literal values that HTML5 metadata forbids
for a React DOM intrinsic element. It is enabled in `recommended`.

The rule uses generated data from `html-validate@9.7.1`. The generated module
is published with this package, so linting does not read the filesystem or load
`html-validate` at runtime. To update the metadata, change the exact dev
dependency, run `yarn generate:html-metadata`, inspect the data diff, and run
`yarn quality:complete`.

## Incorrect

```jsx
<div href="/docs" />

<button type="link" />

<input type="telephone" />
```

```jsx
import React from 'react';

React.createElement('form', { method: 'put' });
```

## Correct

```jsx
<button type="submit" data-variant="compact" aria-label="Save" />

<div align="center" />
```

Obsolete-but-valid HTML is intentionally not reported. `data-*` and `aria-*`
attributes are also outside this rule; use an accessibility-focused tool for
ARIA semantics.

## Boundaries

The rule analyzes lowercase HTML elements in JSX and statically proven
`React.createElement` calls. PascalCase components, custom elements, React
Native host components, SVG and MathML are skipped. Dynamic values, unknown
spreads, and unknown attribute spellings are skipped as well: spelling belongs
to `react/no-unknown-property`, and this rule avoids duplicating it.

No automatic fix is offered because removing or changing an attribute can alter
application behavior.
