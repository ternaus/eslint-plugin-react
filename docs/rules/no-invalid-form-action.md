# react/no-invalid-form-action

Reports native form props that conflict with React 19 Actions and `formAction`
on an input or button that cannot submit a form. Enabled as an error in
`recommended`.

For a function-valued `action`, React supplies the form's `method` and
`encType` and executes the function in the current window. For a
function-valued `formAction`, React also owns the submitter's `name`,
`formMethod`, `formEncType`, and `formTarget`. Explicit values for these props
are overridden. See [React form Actions](https://react.dev/reference/react-dom/components/form)
and the [React 19 validation](https://github.com/facebook/react/blob/v19.0.0/packages/react-dom-bindings/src/client/ReactDOMComponent.js#L124).

## Incorrect

```jsx
async function save(formData) {
  await saveData(formData);
}

<form action={save} method="get" />;
<button type="button" formAction={save}>Save</button>;
<input type="text" formAction="/save" />;
```

## Correct

```jsx
<form action={save} />;
<button type="submit" formAction={save}>Save</button>;
<input type="image" formAction="/save" />;
<form action="/save" method="get" target="preview" />;
<button type="submit" name="operation" formAction="/save">Save</button>;
```

## Analysis boundary

The rule checks JSX and imported React `createElement` calls for native
`form`, `button`, and `input` elements. It recognizes inline functions,
unmodified local function declarations, functions stored directly in `const`
bindings, and the dispatch function destructured from React `useActionState`.
For conflicting props it requires a literal, template literal, or a `const`
initialized with one. Explicit nullish values and unknown dynamic values are
skipped.

Submitter types are checked when `formAction` is a known function or a known
non-null literal value. An input needs `type="submit"` or `type="image"`; a
button needs `type="submit"` or no type. Unknown types are not guessed.

Imported application functions, mutable bindings, arbitrary aliases, spreads,
computed object keys, getters, custom components, customized built-ins, and
visible SVG/MathML contexts are skipped. A visible SVG `foreignObject`
restores the HTML context. Incorrect placement of `action` on a button or
`formAction` on a form belongs to `no-invalid-html-attribute`.

No automatic fix is offered: removing attributes cannot determine whether the
author intended a React Action or a URL-based submission.
