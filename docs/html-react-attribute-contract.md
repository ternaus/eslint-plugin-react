# HTML and React attribute contract

This document defines how `react/no-invalid-html-attribute` decides whether a
static attribute is valid. It is the source policy for future metadata changes.

The short decision is:

- WHATWG HTML is the authority for HTML content attributes and their allowed
  values.
- React's official DOM documentation and React DOM implementation are the
  authority for React props and React-specific attribute behavior.
- The checked-in HTML table is this rule's reviewed HTML contract. It is based
  on WHATWG and is not generated from a third-party validator.
- The table is published as package data. Keeping it in the repository makes
  changes reviewable and keeps linting independent of the build environment.

Issue [#29](https://github.com/ternaus/eslint-plugin-react/issues/29) exposed
the boundary this document governs: `value` is valid on `<option>` as an HTML
attribute, and React supports controlled `value` props on `<select>` and
`<textarea>`. Before the contract was split into HTML and React layers, the
HTML metadata only included `input.value`, so the other valid uses were
reported.

## What this rule is checking

The rule checks a narrow contract:

> Is this statically written attribute, or this statically known attribute value,
> valid for this lowercase HTML/React DOM intrinsic element?

It does not try to solve every JSX attribute problem. The following concerns
belong elsewhere:

- unknown attribute spelling is handled by Biome's
  `suspicious/noUnknownAttribute`;
- ARIA role and state semantics belong to an accessibility-focused checker;
- component props on `<Button>`, `<Select>`, or another PascalCase component are
  outside this rule;
- React Native, SVG, MathML, and custom host-element contracts are outside the
  package boundary;
- values that are only known at runtime cannot be validated statically.

Keeping these boundaries explicit prevents this rule from treating a partial
HTML table as a universal React type system.

## The source hierarchy

### 1. WHATWG HTML Living Standard

Use the [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/)
for:

- global HTML attributes;
- element-specific content attributes;
- whether an attribute is an enumerated attribute;
- the allowed keywords for an enumerated attribute;
- the difference between a content attribute and an IDL/property value;
- current and obsolete HTML attributes.

The element sections are the important references. For example, the standard
lists the content attributes for [`select`](https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element),
[`option`](https://html.spec.whatwg.org/multipage/form-elements.html#the-option-element),
and [`textarea`](https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element)
separately. A DOM property appearing in an element's Web IDL interface does not
automatically mean that the same name is an HTML content attribute.

This distinction is required for `value`:

| Element | HTML content attribute | React DOM prop | Rule consequence |
| --- | --- | --- | --- |
| `input` | `value` exists | `value` controls the input | Allow both contracts. |
| `option` | `value` exists | `value` supplies the option value | Allow the HTML attribute. |
| `select` | `value` is not listed as a content attribute | `value` controls the selected option | Allow the React prop. |
| `textarea` | `value` is not listed as a content attribute | `value` controls the text area | Allow the React prop. |

The table is not interchangeable across elements. A shared spelling does not
imply a shared source or meaning.

### 2. React's official DOM documentation

Use React's official documentation for props that React adds, renames, or gives
special behavior to:

- [`<input>`](https://react.dev/reference/react-dom/components/input);
- [`<select>`](https://react.dev/reference/react-dom/components/select);
- [`<textarea>`](https://react.dev/reference/react-dom/components/textarea);
- [React DOM components](https://react.dev/reference/react-dom/components).

The documentation is authoritative for the public React contract. It explicitly
documents controlled props such as `value` and `defaultValue`, event props such
as `onChange`, and React-specific behavior such as the controlled/uncontrolled
boundary.

Use React documentation to answer questions such as:

- Is `value` accepted on this React host component?
- Is `defaultValue` the supported uncontrolled form prop?
- Does React normalize `className`, `htmlFor`, `autoComplete`, or
  `maxLength`?
- Does React intentionally reject or reinterpret a native HTML attribute?

Do not infer these answers from WHATWG alone. WHATWG describes the browser
platform; React adds a public rendering contract on top of it.

### 3. React DOM source for unresolved behavior

When the public documentation does not settle a question, inspect the matching
React DOM source in the official React repository, especially the host-property
and unknown-property handling under
[`packages/react-dom-bindings`](https://github.com/facebook/react/tree/main/packages/react-dom-bindings).

React source is a secondary authority for this package's public contract. It can
explain an implementation detail or a compatibility behavior, but an internal
branch alone is not enough to add a new public rule exception. The behavior must
also be stable, observable, and compatible with the supported React 19+ surface.

### 4. WAI-ARIA and related standards

This rule skips `aria-*` attributes. If a future rule validates ARIA names or
values, use the [WAI-ARIA specification](https://www.w3.org/TR/wai-aria/) and
the applicable ARIA in HTML mapping specification. Do not add ARIA semantics to
the HTML attribute table as an unrelated exception.

### 5. The checked-in HTML table

[`lib/html5-attributes.js`](../lib/html5-attributes.js) is the package's
reviewed HTML metadata contract. It is maintained directly in the repository,
not generated during installation or publication.

For every change:

- start from the relevant WHATWG element or global-attribute section;
- preserve the distinction between content attributes and DOM properties;
- store finite keyword sets only when WHATWG defines a closed set;
- store an attribute without a finite value list when its value is arbitrary or
  cannot be decided safely by this rule;
- record the primary source and rationale in the change description;
- add a valid case and an invalid near-miss to the rule tests when behavior
  changes.

Third-party HTML validators may still be useful for independent investigation,
but they are not package dependencies and their metadata must not silently
change this contract.

## The decision model

The target model has separate layers. It must not flatten all names into one
unexplained list.

### HTML layer

For each lowercase HTML element, store the HTML content attributes from WHATWG.
For an attribute with a finite keyword set, store the allowed keywords. For an
attribute whose valid values are arbitrary strings, URLs, numbers, or values
that cannot be safely decided statically, store the attribute without a finite
value list.

### React layer

For each supported React host element, store React props that are valid in JSX
even when they are not HTML content attributes. This layer includes controlled
form props and React naming/normalization rules.

Examples:

- `select.value` and `textarea.value` belong to the React layer;
- `option.value` belongs to the HTML layer;
- `input.value` is present in both layers;
- `defaultValue` is a React prop and must not be inferred from the HTML
  `value` attribute;
- `onChange` is a React event prop and is intentionally ignored by this rule.

### Shared and ignored layers

Global HTML attributes and the package's explicitly supported universal
attributes are shared across applicable elements. `data-*`, `aria-*`, React
event props, dynamic spreads, and unknown attribute spellings remain outside the
rule's static contract.

### Static value checking

Apply a finite value check only when the authoritative source defines a closed
set of values and the JSX value is statically known.

These cases are different:

```jsx
<button type="submit" />       // check against the HTML keyword set
<button type={buttonType} />   // defer because the value is dynamic
<select value={status} />      // allow the React prop; do not use HTML enum logic
<option value="queued" />     // allow the HTML content attribute
```

A source representation must not silently become an incomplete finite list. If
the rule cannot preserve the source semantics, it should allow the attribute's
value and leave broader validation to a different rule.

## What the current implementation actually does

The current implementation has explicit, checked-in layers:

1. `lib/html5-attributes.js` stores the reviewed HTML contract.
2. `no-invalid-html-attribute` merges the HTML tables with the
   explicit React DOM attribute layer, then applies global attributes, universal
   attributes, aliases, and the `REACT_ONLY_ATTRIBUTES` set.
3. If an attribute is known somewhere in the HTML data but absent on the
   current element, the rule reports it. If the spelling is completely unknown,
   the rule skips it.

Before the HTML and React layers were split, the HTML data contained
`input.value`, so `value` was a known attribute. The element entries for
`option`, `select`, and `textarea` did not contain the corresponding contract.
The rule therefore interpreted valid uses as known-but-invalid attributes.

## Recommended implementation direction

Do not solve future gaps by adding an endless list of overrides to one HTML
table. The preferred design is now established for the #29 `value` case and
should be followed for future gaps:

1. Keep a checked-in HTML layer whose provenance points to the relevant WHATWG
   sections.
2. Add a separate checked-in React DOM contract for supported host props and
   normalized names.
3. Make the merge explicit in the rule: HTML attributes plus applicable React
   props plus shared attributes.
4. Record a primary source and a short rationale for every manual exception.
5. Keep the published package self-contained. Linting must continue to use the
   checked-in contract and must not load metadata from the network or filesystem.

The #29 regression matrix covers `value` on `input`, `option`, `select`, and
`textarea`, including JSX and `React.createElement` entry points. Future changes
should extend the same matrix pattern. Each test should prove both sides of the
contract: valid React/HTML uses are accepted and genuinely invalid
element-specific attributes remain reported.

## Review checklist for a metadata change

Before merging a change to this contract, answer every question below:

- Which source defines the behavior: WHATWG, React documentation, React source,
  or an explicit package boundary?
- Is the name an HTML content attribute, a DOM property, a React prop, or more
  than one of these?
- Which lowercase intrinsic elements accept it?
- Is the value space finite, arbitrary, dynamic, or implementation-defined?
- Does React normalize the JSX spelling?
- Does the change affect `input`, `option`, `select`, or `textarea` together?
- Does it add a valid case and preserve an invalid near-miss?
- Is the source URL and rationale recorded beside the manual exception?
- Has the checked-in metadata diff been inspected against the primary source?
- Does the combined `recommended` configuration pass the new regression?

If the source cannot answer the question with a bounded false-positive policy,
the rule should skip the case. A narrow, documented skip is safer than claiming
that a stale or partial metadata table is the complete platform contract.
